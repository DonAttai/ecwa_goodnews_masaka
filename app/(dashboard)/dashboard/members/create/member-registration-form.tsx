"use client"

import * as React from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldPath, Resolver, useForm } from "react-hook-form"
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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
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
  Camera,
  CheckCircle,
} from "lucide-react"
import { getLgasByState } from "@/lib/nigeria-locations"
import { memberFormSchema, MemberFormValues } from "../schemas"
import { createMember } from "../actions"
import { toMemberFormData } from "../serialize"
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
import {
  saveDraft,
  loadDraft,
  clearDraft,
  type MemberDraft,
} from "./utils/draft"
import { submittableProgress } from "./utils/progress"

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
  gender: undefined as unknown as "MALE" | "FEMALE",
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

export interface FellowshipOption {
  id: string
  name: string
  description?: string | null
}

export default function MemberRegistrationForm({
  initialFellowships,
}: {
  initialFellowships?: FellowshipOption[]
}) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [passportUrl, setPassportUrl] = React.useState<string | null>(null)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [availableLgas, setAvailableLgas] = React.useState<string[]>([])
  const [fellowships, setFellowships] = React.useState<
    Array<{ id: string; name: string; description?: string }>
  >(
    (initialFellowships ?? []).map((fellowship) => ({
      id: fellowship.id,
      name: fellowship.name,
      description: fellowship.description ?? undefined,
    }))
  )
  const [isLoadingFellowships, setIsLoadingFellowships] = React.useState(
    initialFellowships === undefined
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showSuccessModal, setShowSuccessModal] = React.useState(false)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  )
  const [createdMember, setCreatedMember] = React.useState<{
    id: string
    name: string
  } | null>(null)
  const [pendingDraft, setPendingDraft] = React.useState<MemberDraft | null>(
    null
  )
  const [showResetConfirm, setShowResetConfirm] = React.useState(false)
  const [maxVisited, setMaxVisited] = React.useState(0)
  const [duplicateMatch, setDuplicateMatch] = React.useState<{
    id: string
    name: string
  } | null>(null)
  const titleRef = React.useRef<HTMLHeadingElement>(null)
  const prevStateRef = React.useRef<string>("")

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(
      memberFormSchema
    ) as unknown as Resolver<MemberFormValues>,
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  })

  const selectedState = form.watch("stateOfOrigin")
  const phoneValue = form.watch("phoneNumber")
  const watchedChildren = (form.watch("children") as Child[]) || []
  const isMarried = form.watch("maritalStatus") === "MARRIED"
  const maritalStatus = form.watch("maritalStatus")
  const showChildrenField = shouldShowChildrenField(maritalStatus)
  const isBaptized = form.watch("baptized") === "YES"
  const hasBeenOnDiscipline = form.watch("beenOnDiscipline") === "YES"

  const allWatchedValues = form.watch()
  const progress = submittableProgress(
    allWatchedValues as unknown as Record<string, unknown>
  )

  // Offer to resume an autosaved draft (shared admin PCs: explicit opt-in)
  React.useEffect(() => {
    const draft = loadDraft()
    if (draft) {
      setPendingDraft(draft)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Live duplicate-phone warning (non-blocking; server enforces on submit)
  React.useEffect(() => {
    const digits = String(phoneValue ?? "").replace(/\D/g, "")
    if (digits.length < 10) {
      setDuplicateMatch(null)
      return
    }
    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/members/check-duplicate?phone=${encodeURIComponent(String(phoneValue))}`
        )
        if (!response.ok) return
        const data = await response.json()
        if (!cancelled) {
          setDuplicateMatch(data.match ?? null)
        }
      } catch {
        // fail silently — server validation is the source of truth
      }
    }, 600)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [phoneValue])

  // Autosave draft (debounced) — skipped once success modal is showing
  React.useEffect(() => {
    if (showSuccessModal) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const subscription = form.watch((values) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        saveDraft({
          values: values as Record<string, unknown>,
          passportUrl,
          currentStep,
          savedAt: new Date().toISOString(),
        })
      }, 500)
    })
    return () => {
      subscription.unsubscribe()
      if (timer) clearTimeout(timer)
    }
  }, [form, passportUrl, currentStep, showSuccessModal])

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
    // Only clear LGA when the state actually changed (not on mount/restore)
    if (selectedState !== prevStateRef.current) {
      prevStateRef.current = selectedState || ""
      if (selectedState) {
        setAvailableLgas(getLgasByState(selectedState))
        if (form.getValues("lga")) {
          form.setValue("lga", "")
        }
      } else {
        setAvailableLgas([])
      }
    } else if (selectedState && availableLgas.length === 0) {
      setAvailableLgas(getLgasByState(selectedState))
    }
  }, [selectedState, form, availableLgas.length])

  // Fellowships come preloaded from the server page; client fetch is
  // fallback only (e.g. direct client render without initial data).
  React.useEffect(() => {
    if (initialFellowships !== undefined) return
    const fetchFellowships = async () => {
      try {
        const response = await fetch("/api/fellowships")
        const data = await response.json()
        setFellowships(
          (Array.isArray(data) ? data : []).map((fellowship) => ({
            id: fellowship.id,
            name: fellowship.name,
            description: fellowship.description ?? undefined,
          }))
        )
      } catch (error) {
        console.error("Failed to fetch fellowships:", error)
        toast.error("Failed to load fellowship groups")
      } finally {
        setIsLoadingFellowships(false)
      }
    }

    fetchFellowships()
  }, [initialFellowships])

  const resetForm = () => {
    form.reset(DEFAULT_VALUES)
    setPassportUrl(null)
    setCurrentStep(0)
    setSubmitError(null)
    setCreatedMember(null)
    setMaxVisited(0)
    setPendingDraft(null)
    setDuplicateMatch(null)
    clearDraft()
  }

  const resumeDraft = () => {
    if (!pendingDraft) return
    form.reset(pendingDraft.values as Partial<MemberFormValues>)
    setPassportUrl(pendingDraft.passportUrl)
    const step = Math.min(
      Math.max(pendingDraft.currentStep, 0),
      steps.length - 1
    )
    setCurrentStep(step)
    setMaxVisited(step)
    if (pendingDraft.values.stateOfOrigin) {
      setAvailableLgas(
        getLgasByState(String(pendingDraft.values.stateOfOrigin))
      )
    }
    setPendingDraft(null)
    toast.success("Draft resumed")
  }

  const discardDraft = () => {
    clearDraft()
    setPendingDraft(null)
  }

  const focusTitle = () => {
    requestAnimationFrame(() => {
      titleRef.current?.focus()
    })
  }

  const addChild = () => {
    const currentChildren = (form.getValues("children") as Child[]) || []
    form.setValue(
      "children",
      [...currentChildren, { name: "", contact: "" }],
      { shouldValidate: true, shouldDirty: true }
    )
  }

  const removeChild = (index: number) => {
    const currentChildren = (form.getValues("children") as Child[]) || []
    form.setValue(
      "children",
      currentChildren.filter((_, i) => i !== index),
      { shouldValidate: true, shouldDirty: true }
    )
  }

  const updateChild = (index: number, field: keyof Child, value: string) => {
    const currentChildren = (form.getValues("children") as Child[]) || []
    const updatedChildren = currentChildren.map((child, i) =>
      i === index ? { ...child, [field]: value } : child
    )
    form.setValue("children", updatedChildren, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const handlePassportUpload = (url: string) => {
    setPassportUrl(url)
    toast.success("Passport photograph uploaded successfully!")
  }

  const handlePassportRemove = () => {
    setPassportUrl(null)
  }

  const moveToStep = (step: number) => {
    if (step <= maxVisited && step !== currentStep) {
      setCurrentStep(step)
      setSubmitError(null) // Clear error when moving between visited steps
      focusTitle()
    }
  }

  /** Maps any form field to the wizard step that renders it. */
  const stepForField = (field: string): number => {
    if (
      [
        "surname",
        "firstName",
        "otherNames",
        "presentAddress",
        "phoneNumber",
        "email",
        "previousPlaceOfWorship",
        "maritalStatus",
        "gender",
        "spouseName",
        "homeCell",
        "zone",
        "stateOfOrigin",
        "lga",
        "tribe",
      ].includes(field)
    ) {
      return 0
    }
    if (["children", "fellowshipGroupIds"].includes(field)) {
      return 1
    }
    if (
      [
        "acceptedChrist",
        "baptized",
        "baptismPlace",
        "baptizedBy",
        "communicant",
      ].includes(field)
    ) {
      return 2
    }
    if (
      [
        "beenOnDiscipline",
        "disciplineReason",
        "disciplineDate",
        "disciplineReliefDate",
        "previousChurchPosition",
      ].includes(field)
    ) {
      return 3
    }
    if (["suggestions"].includes(field)) {
      return 5
    }
    if (
      [
        "memberSignature",
        "memberSignedDate",
        "pastorSignature",
        "pastorSignedDate",
      ].includes(field)
    ) {
      return 6
    }
    return 0
  }

  /** Jumps to the step containing a failed field and focuses it. */
  const goToFieldStep = (field: string) => {
    const step = stepForField(field)
    setCurrentStep(step)
    setMaxVisited((prev) => Math.max(prev, step))
    setSubmitError("Please check the highlighted fields for errors")
    focusTitle()
    setTimeout(() => {
      const errorElement = document.querySelector(
        `[name="${field}"]`
      ) as HTMLElement | null
      errorElement?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
      errorElement?.focus({ preventScroll: true })
    }, 100)
  }

  const validateCurrentStep = async () => {
    // Clear previous errors before validation
    setSubmitError(null)

    const stepFields: FieldPath<MemberFormValues>[] = []
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
        // Recommendations are optional — never block Next
        return true
      case 6:
        // Declaration signatures are optional for bulk admin entry
        return true
      default:
        return true
    }

    const isStepValid = await form.trigger(stepFields)

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
      const next = currentStep + 1
      setCurrentStep(next)
      setMaxVisited((prev) => Math.max(prev, next))
      window.scrollTo({ top: 0, behavior: "smooth" })
      focusTitle()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setSubmitError(null) // Clear error when going back
      window.scrollTo({ top: 0, behavior: "smooth" })
      focusTitle()
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
      const formDataToSend = toMemberFormData(data)

      // Only append passportUrl if it exists
      if (passportUrl) {
        formDataToSend.append("passportUrl", passportUrl)
      }

      const result = await createMember(formDataToSend)

      if (result.success) {
        const message = result.message || "Member registered successfully!"
        const newMember = {
          id: result.data?.memberId ?? "",
          name: `${data.firstName} ${data.surname}`,
        }
        resetForm()
        // set after reset since resetForm clears created-member state
        setSuccessMessage(message)
        setCreatedMember(newMember)
        setShowSuccessModal(true)
        return
      }

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, errors]) => {
          const errorMessage = Array.isArray(errors) ? errors[0] : errors
          form.setError(field as FieldPath<MemberFormValues>, {
            message: errorMessage,
          })
        })

        toast.error("Please check the form for errors")
        setSubmitError("Please check the highlighted fields for errors")

        const errorField = Object.keys(result.fieldErrors)[0]
        if (errorField) {
          goToFieldStep(errorField)
        }
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

  // Full-schema gate: onSubmit only fires when the whole form is valid.
  // Otherwise jump to the first failing step instead of submitting.
  const handleFormSubmit = form.handleSubmit(onSubmit, (errors) => {
    const firstField = Object.keys(errors)[0]
    if (firstField) {
      goToFieldStep(firstField)
      toast.error(
        `Step ${stepForField(firstField) + 1}: please complete the highlighted fields`
      )
    } else {
      toast.error("Please fill in all required fields correctly")
    }
  })

  return (
    <Card className="mx-auto w-full max-w-5xl shadow-lg">
      <CardHeader className="border-b bg-linear-to-r from-primary/5 to-primary/10">
        <div className="mb-2 text-center">
          <CardTitle ref={titleRef} tabIndex={-1} className="mt-2 text-xl">
            MEMBERSHIP FORM
          </CardTitle>
        </div>
      </CardHeader>

      {pendingDraft && (
        <div className="mx-6 mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm">
              Unsaved draft found. Resume where you left off?
            </p>
            <div className="flex gap-2">
              <Button type="button" size="sm" onClick={resumeDraft}>
                Resume
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={discardDraft}
              >
                Discard
              </Button>
            </div>
          </div>
        </div>
      )}

      {duplicateMatch && currentStep === 0 && (
        <div className="mx-6 mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm">
              Possible duplicate: this number is already registered to{" "}
              <span className="font-semibold">{duplicateMatch.name}</span>.
            </p>
            <Button type="button" size="sm" variant="outline" asChild>
              <Link href={`/dashboard/members/${duplicateMatch.id}`}>
                View member
              </Link>
            </Button>
          </div>
        </div>
      )}

      <CardContent className="pt-6">
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm font-medium">
            <span>
              Step {currentStep + 1} of {steps.length} — Registration Progress
            </span>
            <span className="text-primary">
              {progress}% of required fields filled
            </span>
          </div>
          <FormProgress value={progress} />
        </div>

        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          maxVisited={maxVisited}
          passportUrl={passportUrl}
          onStepClick={moveToStep}
        />

        <form
          id="member-registration-form"
          // No type="submit" button exists in this form (footer buttons are
          // type="button"), so the browser cannot implicitly submit. This
          // handler is a defensive backstop only.
          onSubmit={(event) => event.preventDefault()}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return
            const target = event.target as HTMLElement | null
            // Only single-line inputs: textareas keep Enter=newline,
            // buttons/selects keep native behavior.
            if (!target || target.tagName !== "INPUT") return
            event.preventDefault()
            if (currentStep < steps.length - 1) {
              void nextStep()
            } else {
              void handleFormSubmit()
            }
          }}
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
          <AlertDialogHeader className="items-center text-center sm:group-data-[size=default]/alert-dialog-content:place-items-center sm:group-data-[size=default]/alert-dialog-content:text-center">
            <div className="mb-2 flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center text-lg">
              Success!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {successMessage}
              {createdMember && (
                <span className="mt-1 block font-semibold text-foreground">
                  {createdMember.name} has been added to the membership. Form
                  cleared — ready for the next entry.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {createdMember?.id && (
              <Button asChild variant="outline">
                <Link href={`/dashboard/members/${createdMember.id}`}>
                  View member
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessModal(false)
                window.scrollTo({ top: 0, behavior: "smooth" })
                focusTitle()
              }}
            >
              Register another
            </Button>
            <AlertDialogAction
              onClick={() => setShowSuccessModal(false)}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              OK
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Discard all entries?</AlertDialogTitle>
            <AlertDialogDescription>
              This clears every step of this form and any autosaved draft. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetForm()
                setShowResetConfirm(false)
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
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
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowResetConfirm(true)}
          >
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
