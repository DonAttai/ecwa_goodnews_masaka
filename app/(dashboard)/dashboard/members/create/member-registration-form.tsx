"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  User,
  Users,
  Heart,
  Church,
  FileSignature,
  AlertCircle,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Save,
  Plus,
  Trash2,
  X,
  Camera,
  CheckCircle,
} from "lucide-react"
import { nigeriaStates, getLgasByState } from "@/lib/nigeria-locations"
import { memberFormSchema, MemberFormValues } from "../schemas"
import { createMember } from "../actions"
import { StepIndicator } from "./components/StepIndicator"
import { FormProgress } from "./form-progress"
import PersonalInfoStep from "./steps/PersonalInfoStep"
import PassportPhotoStep from "./steps/PassportPhotoStep"
import FamilyFellowshipStep from "./steps/FamilyFellowshipStep"
import SpiritualDataStep from "./steps/SpiritualDataStep"
import DisciplineServiceStep from "./steps/DisciplineServiceStep"
import RecommendationsStep from "./steps/RecommendationsStep"
import DeclarationStep from "./steps/DeclarationStep"
import { shouldShowChildrenField } from "./utils/marita-status"

interface Child {
  name: string
  contact: string
}

interface StepItem {
  title: string
  icon: React.ElementType
  description: string
}

const steps: StepItem[] = [
  {
    title: "Personal Data",
    icon: User,
    description: "Personal & Contact Information",
  },
  {
    title: "Family & Fellowship",
    icon: Users,
    description: "Children & Fellowship Groups",
  },
  {
    title: "Spiritual Data",
    icon: Heart,
    description: "Salvation & Baptism",
  },
  {
    title: "Discipline & Service",
    icon: Church,
    description: "Church Discipline & Previous Service",
  },
  {
    title: "Passport Photo",
    icon: Camera,
    description: "Upload your passport photograph (Optional)",
  },
  {
    title: "Recommendations",
    icon: Lightbulb,
    description: "Suggestions & Recommendations",
  },
  {
    title: "Declaration",
    icon: FileSignature,
    description: "Signatures & Confirmation",
  },
]

const DEFAULT_VALUES: Omit<MemberFormValues, "id"> = {
  surname: "",
  firstName: "",
  otherNames: "",
  presentAddress: "",
  phoneNumber: "",
  email: "",
  previousPlaceOfWorship: "",
  maritalStatus: "SINGLE" as const,
  gender: null as any,
  spouseName: "",
  homeCell: "",
  zone: "",
  stateOfOrigin: "",
  lga: "",
  tribe: "",
  children: [],
  fellowshipGroupIds: [],
  acceptedChrist: "NO" as const,
  baptized: "NO" as const,
  baptismPlace: "",
  baptizedBy: "",
  communicant: "NO" as const,
  beenOnDiscipline: "NO" as const,
  disciplineReason: "",
  disciplineDate: null,
  disciplineReliefDate: null,
  previousChurchPosition: "",
  suggestions: "",
  memberSignature: "",
  memberSignedDate: null,
  pastorSignature: "",
  pastorSignedDate: null,
} satisfies Omit<MemberFormValues, "id">

export default function MemberRegistrationForm() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [passportUrl, setPassportUrl] = React.useState<string | null>(null)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [availableLgas, setAvailableLgas] = React.useState<string[]>([])
  const [fellowships, setFellowships] = React.useState<
    Array<{ id: string; name: string; description?: string }>
  >([])
  const [isLoadingFellowships, setIsLoadingFellowships] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showSuccessModal, setShowSuccessModal] = React.useState(false)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  )

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema) as any,
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  })

  const selectedState = form.watch("stateOfOrigin")
  const watchedChildren = (form.watch("children") as Child[]) || []
  const isMarried = form.watch("maritalStatus") === "MARRIED"
  const maritalStatus = form.watch("maritalStatus")
  const showChildrenField = shouldShowChildrenField(maritalStatus)
  const isBaptized = form.watch("baptized") === "YES"
  const hasBeenOnDiscipline = form.watch("beenOnDiscipline") === "YES"

  const progress = ((currentStep + 1) / steps.length) * 100

  // Clear submit error when form fields change
  React.useEffect(() => {
    const subscription = form.watch(() => {
      if (submitError) {
        setSubmitError(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, submitError])

  React.useEffect(() => {
    if (selectedState) {
      setAvailableLgas(getLgasByState(selectedState))
      if (form.getValues("lga")) {
        form.setValue("lga", "")
      }
    } else {
      setAvailableLgas([])
    }
  }, [selectedState, form])

  React.useEffect(() => {
    const fetchFellowships = async () => {
      try {
        const response = await fetch("/api/fellowships")
        const data = await response.json()
        setFellowships(data)
      } catch (error) {
        console.error("Failed to fetch fellowships:", error)
        toast.error("Failed to load fellowship groups")
      } finally {
        setIsLoadingFellowships(false)
      }
    }

    fetchFellowships()
  }, [])

  const resetForm = () => {
    form.reset(DEFAULT_VALUES)
    setPassportUrl(null)
    setCurrentStep(0)
    setSubmitError(null)
  }

  const addChild = () => {
    const currentChildren = (form.getValues("children") as Child[]) || []
    form.setValue("children", [...currentChildren, { name: "", contact: "" }])
  }

  const removeChild = (index: number) => {
    const currentChildren = (form.getValues("children") as Child[]) || []
    form.setValue(
      "children",
      currentChildren.filter((_, i) => i !== index)
    )
  }

  const updateChild = (index: number, field: keyof Child, value: string) => {
    const currentChildren = (form.getValues("children") as Child[]) || []
    const updatedChildren = currentChildren.map((child, i) =>
      i === index ? { ...child, [field]: value } : child
    )
    form.setValue("children", updatedChildren)
  }

  const handlePassportUpload = (url: string) => {
    setPassportUrl(url)
    toast.success("Passport photograph uploaded successfully!")
  }

  const handlePassportRemove = () => {
    setPassportUrl(null)
  }

  const moveToStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step)
      setSubmitError(null) // Clear error when moving to previous step
    }
  }

  const validateCurrentStep = async () => {
    // Clear previous errors before validation
    setSubmitError(null)

    const stepFields: Array<keyof MemberFormValues> = []

    switch (currentStep) {
      case 0:
        stepFields.push(
          "surname",
          "firstName",
          "presentAddress",
          "phoneNumber",
          "maritalStatus",
          "gender",
          "stateOfOrigin",
          "lga",
          "tribe"
        )
        if (isMarried) {
          stepFields.push("spouseName")
        }
        break
      case 1:
        stepFields.push("children", "fellowshipGroupIds")
        if (showChildrenField) {
          stepFields.push("children")
        }
        break
      case 2:
        stepFields.push("acceptedChrist", "baptized", "communicant")
        if (isBaptized) {
          stepFields.push("baptismPlace", "baptizedBy")
        }
        break
      case 3:
        stepFields.push("beenOnDiscipline")
        if (hasBeenOnDiscipline) {
          stepFields.push("disciplineReason")
        }
        break
      case 4:
        // Passport upload is now optional - no validation needed
        return true
      case 5:
        stepFields.push("suggestions")
        break
      case 6:
        stepFields.push(
          "memberSignature",
          "memberSignedDate",
          "pastorSignature",
          "pastorSignedDate"
        )
        break
      default:
        return true
    }

    const isStepValid = await form.trigger(stepFields as any)

    if (!isStepValid) {
      setSubmitError("Please fill in all required fields for this step")
      const firstErrorField = Object.keys(form.formState.errors)[0]
      if (firstErrorField) {
        setTimeout(() => {
          const errorElement = document.querySelector(
            `[name="${firstErrorField}"]`
          )
          errorElement?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        }, 100)
      }
    } else {
      // Clear error when validation passes
      setSubmitError(null)
    }

    return isStepValid
  }

  const nextStep = async () => {
    const canAdvance = await validateCurrentStep()
    if (!canAdvance) {
      return
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setSubmitError(null) // Clear error when going back
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const onSubmit = async (data: MemberFormValues) => {
    // Remove passport validation - now optional
    // if (!passportUrl) {
    //   toast.error("Please upload a passport photograph before submitting")
    //   setCurrentStep(4)
    //   return
    // }

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (key === "children") {
            formDataToSend.append(key, JSON.stringify(value))
          } else if (key === "fellowshipGroupIds") {
            formDataToSend.append(key, JSON.stringify(value))
          } else if (typeof value === "string") {
            formDataToSend.append(key, value)
          } else if (typeof value === "boolean") {
            formDataToSend.append(key, value ? "YES" : "NO")
          }
        }
      })

      // Only append passportUrl if it exists
      if (passportUrl) {
        formDataToSend.append("passportUrl", passportUrl)
      }

      const result = await createMember(formDataToSend)

      if (result.success) {
        const message = result.message || "Member registered successfully!"
        setSuccessMessage(message)
        setShowSuccessModal(true)
        resetForm()
        return
      }

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, errors]) => {
          const errorMessage = Array.isArray(errors) ? errors[0] : errors
          form.setError(field as any, { message: errorMessage })
        })

        toast.error("Please check the form for errors")
        setSubmitError("Please check the highlighted fields for errors")

        const errorField = Object.keys(result.fieldErrors)[0]
        let errorStepIndex = 0

        if (
          [
            "surname",
            "firstName",
            "presentAddress",
            "phoneNumber",
            "maritalStatus",
            "gender",
            "stateOfOrigin",
            "lga",
            "tribe",
          ].includes(errorField)
        ) {
          errorStepIndex = 0
        } else if (["fellowshipGroupIds"].includes(errorField)) {
          errorStepIndex = 1
        } else if (
          ["acceptedChrist", "baptized", "communicant"].includes(errorField)
        ) {
          errorStepIndex = 2
        } else if (["beenOnDiscipline"].includes(errorField)) {
          errorStepIndex = 3
        } else if (
          [
            "memberSignature",
            "memberSignedDate",
            "pastorSignature",
            "pastorSignedDate",
          ].includes(errorField)
        ) {
          errorStepIndex = 6
        }

        setCurrentStep(errorStepIndex)
        setTimeout(() => {
          const errorElement = document.querySelector(`[name="${errorField}"]`)
          errorElement?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        }, 100)
      } else {
        const errorMsg = result.message || "Failed to register member"
        toast.error(errorMsg)
        setSubmitError(errorMsg)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      toast.error(errorMessage)
      setSubmitError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormSubmit = form.handleSubmit(onSubmit, () => {
    toast.error("Please fill in all required fields correctly")
  })

  return (
    <Card className="mx-auto w-full max-w-5xl shadow-lg">
      <CardHeader className="border-b bg-linear-to-r from-primary/5 to-primary/10">
        <div className="mb-2 text-center">
          <CardTitle className="mt-2 text-xl">MEMBERSHIP FORM</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm font-medium">
            <span>Registration Progress</span>
            <span className="text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <FormProgress value={progress} />
        </div>

        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          passportUrl={passportUrl}
          onStepClick={moveToStep}
        />

        <form
          id="member-registration-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <FieldGroup>
            {currentStep === 0 && (
              <PersonalInfoStep
                control={form.control}
                isMarried={isMarried}
                selectedState={selectedState}
                availableLgas={availableLgas}
              />
            )}

            {currentStep === 1 && (
              <FamilyFellowshipStep
                control={form.control}
                childrenList={watchedChildren}
                onChildAdd={addChild}
                onChildRemove={removeChild}
                onChildUpdate={updateChild}
                fellowships={fellowships}
                isLoadingFellowships={isLoadingFellowships}
                showChildrenField={showChildrenField}
              />
            )}

            {currentStep === 2 && (
              <SpiritualDataStep
                control={form.control}
                isBaptized={isBaptized}
              />
            )}

            {currentStep === 3 && (
              <DisciplineServiceStep
                control={form.control}
                hasBeenOnDiscipline={hasBeenOnDiscipline}
              />
            )}

            {currentStep === 4 && (
              <PassportPhotoStep
                passportUrl={passportUrl}
                onUpload={handlePassportUpload}
                onRemove={handlePassportRemove}
                isOptional={true}
              />
            )}

            {currentStep === 5 && (
              <RecommendationsStep control={form.control} />
            )}

            {currentStep === 6 && <DeclarationStep control={form.control} />}
          </FieldGroup>
        </form>
      </CardContent>

      {submitError && (
        <div className="mx-6 mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{submitError}</p>
          </div>
        </div>
      )}

      <AlertDialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <AlertDialogContent>
          <AlertDialogHeader className="items-center text-center">
            <div className="mb-2 flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center text-lg">
              Success!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {successMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center gap-2 pt-4">
            <AlertDialogAction
              onClick={() => setShowSuccessModal(false)}
              className="bg-green-600 hover:bg-green-700"
            >
              OK
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <CardFooter className="flex justify-between border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={resetForm}>
            Reset
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              type="button"
              onClick={handleFormSubmit}
              disabled={isSubmitting}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Membership
                  <Save className="h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button type="button" onClick={nextStep} className="gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
