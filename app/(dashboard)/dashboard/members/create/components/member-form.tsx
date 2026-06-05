"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// UI Components
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Import Nigeria locations data
import { nigeriaStates, getLgasByState } from "@/lib/nigeria-locations"

// Icons
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
} from "lucide-react"
import { memberFormSchema, MemberFormValues } from "../../schemas"
import { createMember } from "../../actions"
import { CloudinaryUploader } from "./cloudinary-uploader"

// Child Information Interface
interface Child {
  name: string
  contact: string
}

// Step configuration
interface Step {
  title: string
  icon: React.ElementType
  description: string
}

export default function CreateMemberPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [passportUrl, setPassportUrl] = React.useState<string | null>(null)
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  // State for dynamic LGA options
  const [availableLgas, setAvailableLgas] = React.useState<string[]>([])
  const [fellowships, setFellowships] = React.useState<
    Array<{ id: string; name: string; description?: string }>
  >([])
  const [isLoadingFellowships, setIsLoadingFellowships] = React.useState(true)

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema) as any,
    defaultValues: {
      surname: "",
      firstName: "",
      otherNames: "",
      presentAddress: "",
      phoneNumber: "",
      email: "",
      previousPlaceOfWorship: "",
      maritalStatus: "SINGLE",
      spouseName: "",
      homeCell: "",
      zone: "",
      stateOfOrigin: "",
      lga: "",
      tribe: "",
      children: [],
      fellowshipGroupIds: [],
      acceptedChrist: "NO",
      baptized: "NO",
      baptismPlace: "",
      baptizedBy: "",
      communicant: "NO",
      beenOnDiscipline: "NO",
      disciplineReason: "",
      disciplineDate: null,
      disciplineReliefDate: null,
      previousChurchPosition: "",
      suggestions: "",
      memberSignature: "",
      memberSignedDate: null,
      pastorSignature: "",
      pastorSignedDate: null,
    },
    mode: "onBlur", // Only validate on blur, not on change
  })

  // Watch fields for conditional rendering
  const selectedState = form.watch("stateOfOrigin")
  const watchedChildren = (form.watch("children") as Child[]) || []
  const isMarried = form.watch("maritalStatus") === "MARRIED"
  const isBaptized = form.watch("baptized") === "YES"
  const hasBeenOnDiscipline = form.watch("beenOnDiscipline") === "YES"

  // Define steps with NO validation fields - we'll validate on submit only
  const steps: Step[] = [
    {
      title: "Personal Data",
      icon: User,
      description: "Personal & Contact Information",
    },
    {
      title: "Passport Photo",
      icon: Camera,
      description: "Upload your passport photograph",
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

  const progress = ((currentStep + 1) / steps.length) * 100

  // Update available LGAs when state changes
  React.useEffect(() => {
    if (selectedState) {
      const lgas = getLgasByState(selectedState)
      setAvailableLgas(lgas)
      if (form.getValues("lga")) {
        form.setValue("lga", "")
      }
    } else {
      setAvailableLgas([])
    }
  }, [selectedState, form])

  // Fetch fellowships when component mounts
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
    form.reset({
      surname: "",
      firstName: "",
      otherNames: "",
      presentAddress: "",
      phoneNumber: "",
      email: "",
      previousPlaceOfWorship: "",
      maritalStatus: "SINGLE",
      spouseName: "",
      homeCell: "",
      zone: "",
      stateOfOrigin: "",
      lga: "",
      tribe: "",
      children: [],
      fellowshipGroupIds: [],
      acceptedChrist: "NO",
      baptized: "NO",
      baptismPlace: "",
      baptizedBy: "",
      communicant: "NO",
      beenOnDiscipline: "NO",
      disciplineReason: "",
      disciplineDate: null,
      disciplineReliefDate: null,
      previousChurchPosition: "",
      suggestions: "",
      memberSignature: "",
      memberSignedDate: null,
      pastorSignature: "",
      pastorSignedDate: null,
    })
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

  const onSubmit = async (data: MemberFormValues) => {
    // Validate passport is uploaded
    if (!passportUrl) {
      toast.error("Please upload a passport photograph before submitting")
      setCurrentStep(1)
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()

      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (key === "children") {
            formDataToSend.append(key, JSON.stringify(value))
          } else if (typeof value === "string") {
            formDataToSend.append(key, value)
          } else if (typeof value === "boolean") {
            formDataToSend.append(key, value ? "YES" : "NO")
          }
        }
      })

      // Append passport URL
      formDataToSend.append("passportUrl", passportUrl)

      // Call the server action directly
      const result = await createMember(formDataToSend)

      if (result.success) {
        toast.success(result.message || "Member registered successfully!")
        resetForm()
        router.push("/members")
      } else {
        // Handle validation errors
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            const errorMessage = Array.isArray(errors) ? errors[0] : errors
            form.setError(field as any, { message: errorMessage })
          })
          toast.error("Please check the form for errors")
          setSubmitError("Please check the highlighted fields for errors")

          // Find the step containing the error field and navigate to it
          const errorField = Object.keys(result.fieldErrors)[0]
          // Simple mapping of fields to steps
          let errorStepIndex = 0
          if (
            [
              "surname",
              "firstName",
              "presentAddress",
              "phoneNumber",
              "maritalStatus",
              "stateOfOrigin",
              "lga",
              "tribe",
            ].includes(errorField)
          ) {
            errorStepIndex = 0
          } else if (["fellowshipGroupIds"].includes(errorField)) {
            errorStepIndex = 2
          } else if (
            ["acceptedChrist", "baptized", "communicant"].includes(errorField)
          ) {
            errorStepIndex = 3
          } else if (["beenOnDiscipline"].includes(errorField)) {
            errorStepIndex = 4
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
            const errorElement = document.querySelector(
              `[name="${errorField}"]`
            )
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
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again."
      if (error instanceof Error) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
      setSubmitError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    console.log("Current step:", currentStep, "Moving to:", currentStep + 1)

    // Special handling for passport step
    if (currentStep === 1) {
      if (!passportUrl) {
        toast.error("Please upload a passport photograph to continue")
        return
      }
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    // For all other steps, just move forward - NO VALIDATION
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePassportUpload = (url: string) => {
    setPassportUrl(url)
    toast.success("Passport photograph uploaded successfully!")
  }

  const handlePassportRemove = () => {
    setPassportUrl(null)
  }

  // Helper component for required field label
  const RequiredLabel = ({
    children,
    required,
  }: {
    children: React.ReactNode
    required?: boolean
  }) => (
    <FieldLabel>
      {children}
      {required && (
        <span className="text-red-500" style={{ marginLeft: "2px" }}>
          *
        </span>
      )}
    </FieldLabel>
  )

  return (
    <Card className="mx-auto w-full max-w-5xl shadow-lg">
      <CardHeader className="border-b bg-linear-to-r from-primary/5 to-primary/10">
        <div className="mb-2 text-center">
          <CardTitle className="mt-2 text-xl">MEMBERSHIP FORM</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm font-medium">
            <span>Registration Progress</span>
            <span className="text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicator */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {steps.map((step, idx) => {
              const Icon = step.icon
              const isActive = idx === currentStep
              const isCompleted = idx < currentStep
              const isPassportStep = idx === 1
              const hasPassport = isPassportStep && passportUrl

              return (
                <div
                  key={idx}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : isCompleted || hasPassport
                        ? "bg-green-100 text-green-700"
                        : "bg-muted"
                  } hover:opacity-80`}
                  onClick={() => {
                    // Allow navigation only to completed steps
                    if (idx < currentStep) {
                      console.log("Navigating to step:", idx)
                      setCurrentStep(idx)
                    }
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden text-sm font-medium sm:inline">
                    {step.title}
                  </span>
                  {(isCompleted || (hasPassport && idx === 1)) && (
                    <Badge variant="secondary" className="ml-1">
                      ✓
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form */}
        <form
          id="member-registration-form"
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("Form validation errors:", errors)
            toast.error("Please fill in all required fields correctly")
          })}
        >
          <FieldGroup>
            {/* STEP 0: PERSONAL DATA */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="rounded-lg bg-primary/5 p-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <User className="h-5 w-5 text-primary" />
                    SECTION A: PERSONAL DATA
                  </h3>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md border-b pb-2 font-medium">
                    1. Personal Information
                  </h4>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Controller
                      name="surname"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <RequiredLabel required>Surname</RequiredLabel>
                          <Input
                            {...field}
                            id="surname"
                            placeholder="Enter surname"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="firstName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <RequiredLabel required>First Name</RequiredLabel>
                          <Input
                            {...field}
                            id="firstName"
                            placeholder="Enter first name"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="otherNames"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="otherNames">
                            Other Name(s)
                          </FieldLabel>
                          <Input
                            {...field}
                            id="otherNames"
                            placeholder="Enter other names"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="presentAddress"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <RequiredLabel required>
                            Present Address
                          </RequiredLabel>
                          <Textarea
                            {...field}
                            id="presentAddress"
                            placeholder="Enter full address"
                            rows={2}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="phoneNumber"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <RequiredLabel required>Phone Number</RequiredLabel>
                          <Input
                            {...field}
                            id="phoneNumber"
                            type="tel"
                            placeholder="+234 XXX XXX XXXX"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="email">Email Address</FieldLabel>
                          <Input
                            {...field}
                            id="email"
                            type="email"
                            placeholder="member@example.com"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="previousPlaceOfWorship"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="previousPlaceOfWorship">
                            Previous Place of Worship
                          </FieldLabel>
                          <Input
                            {...field}
                            id="previousPlaceOfWorship"
                            placeholder="Previous church name"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="maritalStatus"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <RequiredLabel required>Marital Status</RequiredLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger id="maritalStatus">
                              <SelectValue placeholder="Select marital status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SINGLE">Single</SelectItem>
                              <SelectItem value="MARRIED">Married</SelectItem>
                              <SelectItem value="DIVORCED">Divorced</SelectItem>
                              <SelectItem value="WIDOWED">Widowed</SelectItem>
                              <SelectItem value="SEPARATED">
                                Separated
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    {isMarried && (
                      <Controller
                        name="spouseName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <RequiredLabel required>Spouse Name</RequiredLabel>
                            <Input
                              {...field}
                              id="spouseName"
                              placeholder="Enter spouse's name"
                            />
                            <FieldDescription>
                              Required if married
                            </FieldDescription>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    )}

                    <Controller
                      name="homeCell"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="homeCell">Home Cell</FieldLabel>
                          <Input
                            {...field}
                            id="homeCell"
                            placeholder="Enter home cell"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="zone"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="zone">Zone</FieldLabel>
                          <Input
                            {...field}
                            id="zone"
                            placeholder="Enter zone"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="stateOfOrigin"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <RequiredLabel required>
                            State of Origin
                          </RequiredLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger id="stateOfOrigin">
                              <SelectValue placeholder="Select your state of origin" />
                            </SelectTrigger>
                            <SelectContent className="max-h-75">
                              {nigeriaStates.map((state) => (
                                <SelectItem key={state.name} value={state.name}>
                                  {state.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="lga"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <RequiredLabel required>LGA</RequiredLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!selectedState}
                          >
                            <SelectTrigger id="lga">
                              <SelectValue
                                placeholder={
                                  selectedState
                                    ? "Select your LGA"
                                    : "Please select a state first"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="max-h-75">
                              {availableLgas.map((lga) => (
                                <SelectItem key={lga} value={lga}>
                                  {lga}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {!selectedState && (
                            <FieldDescription>
                              Please select your state of origin first
                            </FieldDescription>
                          )}
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="tribe"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <RequiredLabel required>Tribe</RequiredLabel>
                          <Input
                            {...field}
                            id="tribe"
                            placeholder="Enter your tribe"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: PASSPORT PHOTO UPLOAD */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                  <div className="text-center">
                    <Camera className="mx-auto h-12 w-12 text-primary" />
                    <h3 className="mt-4 text-2xl font-semibold">
                      Upload Your Passport Photograph
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      This photo will be used for your membership identification
                    </p>
                  </div>
                </div>

                <div className="flex justify-center py-8">
                  <CloudinaryUploader
                    onUpload={handlePassportUpload}
                    onRemove={handlePassportRemove}
                    currentImage={passportUrl}
                  />
                </div>

                {!passportUrl && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm text-amber-800">
                      ⚠️ Please upload a recent passport photograph (maximum
                      5MB). Supported formats: JPEG, PNG, WebP
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: FAMILY & FELLOWSHIP */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="rounded-lg bg-primary/5 p-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <Users className="h-5 w-5 text-primary" />
                    FAMILY & FELLOWSHIP INFORMATION
                  </h3>
                </div>

                {/* Children Information */}
                <div className="space-y-4">
                  <h4 className="text-md border-b pb-2 font-medium">
                    Children Information (If Any)
                  </h4>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Child's Name</TableHead>
                        <TableHead>Contact Number</TableHead>
                        <TableHead className="w-20">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {watchedChildren.map((child, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Input
                              value={child.name}
                              onChange={(e) =>
                                updateChild(index, "name", e.target.value)
                              }
                              placeholder="Child's name"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={child.contact}
                              onChange={(e) =>
                                updateChild(index, "contact", e.target.value)
                              }
                              placeholder="Contact number"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeChild(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {watchedChildren.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-muted-foreground"
                          >
                            No children added yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addChild}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Child
                  </Button>
                </div>

                {/* Fellowship Information */}
                <div className="space-y-4">
                  <h4 className="text-md border-b pb-2 font-medium">
                    Fellowship Groups
                  </h4>

                  <Controller
                    name="fellowshipGroupIds"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <RequiredLabel required>
                          Select Fellowship Groups
                        </RequiredLabel>

                        {isLoadingFellowships ? (
                          <div className="py-4 text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Loading fellowship groups...
                            </p>
                          </div>
                        ) : fellowships.length === 0 ? (
                          <div className="rounded-lg border py-4 text-center">
                            <p className="text-sm text-muted-foreground">
                              No fellowship groups found
                            </p>
                          </div>
                        ) : (
                          <div className="grid max-h-60 grid-cols-1 gap-3 overflow-y-auto rounded-lg border p-4 md:grid-cols-2">
                            {fellowships.map((fellowship) => (
                              <label
                                key={fellowship.id}
                                className="flex cursor-pointer items-start space-y-0 space-x-3 rounded p-2 hover:bg-muted"
                              >
                                <input
                                  type="checkbox"
                                  value={fellowship.id}
                                  checked={
                                    field.value?.includes(fellowship.id) ||
                                    false
                                  }
                                  onChange={(e) => {
                                    const currentValues = field.value || []
                                    if (e.target.checked) {
                                      field.onChange([
                                        ...currentValues,
                                        fellowship.id,
                                      ])
                                    } else {
                                      field.onChange(
                                        currentValues.filter(
                                          (id) => id !== fellowship.id
                                        )
                                      )
                                    }
                                  }}
                                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {fellowship.name}
                                  </div>
                                  {fellowship.description && (
                                    <div className="text-sm text-muted-foreground">
                                      {fellowship.description}
                                    </div>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>
                        )}

                        <FieldDescription>
                          Select all fellowship groups this member belongs to
                        </FieldDescription>

                        {field.value && field.value.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {field.value.map((id) => {
                              const fellowship = fellowships.find(
                                (f) => f.id === id
                              )
                              return fellowship ? (
                                <Badge key={id} variant="secondary">
                                  {fellowship.name}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      field.onChange(
                                        field.value?.filter(
                                          (i: string) => i !== id
                                        )
                                      )
                                    }}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ) : null
                            })}
                          </div>
                        )}

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: SPIRITUAL DATA */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="rounded-lg bg-primary/5 p-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <Heart className="h-5 w-5 text-primary" />
                    SPIRITUAL DATA
                  </h3>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md border-b pb-2 font-medium">
                    Salvation &amp; Baptism Information
                  </h4>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Controller
                      name="acceptedChrist"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <RequiredLabel required>
                            Accepted Christ as personal Saviour?
                          </RequiredLabel>
                          <div className="mt-2 flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="YES"
                                checked={field.value === "YES"}
                                onChange={() => field.onChange("YES")}
                                className="radio"
                              />
                              Yes
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="NO"
                                checked={field.value === "NO"}
                                onChange={() => field.onChange("NO")}
                                className="radio"
                              />
                              No
                            </label>
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="baptized"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <RequiredLabel required>
                            Are you baptized?
                          </RequiredLabel>
                          <div className="mt-2 flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="YES"
                                checked={field.value === "YES"}
                                onChange={() => field.onChange("YES")}
                                className="radio"
                              />
                              Yes
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="NO"
                                checked={field.value === "NO"}
                                onChange={() => field.onChange("NO")}
                                className="radio"
                              />
                              No
                            </label>
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    {isBaptized && (
                      <>
                        <Controller
                          name="baptismPlace"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="baptismPlace">
                                Place of Baptism
                              </FieldLabel>
                              <Input
                                {...field}
                                id="baptismPlace"
                                placeholder="Where were you baptized?"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />

                        <Controller
                          name="baptizedBy"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="baptizedBy">
                                Name of the Person Who Baptized You
                              </FieldLabel>
                              <Input
                                {...field}
                                id="baptizedBy"
                                placeholder="Who baptized you?"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </>
                    )}

                    <Controller
                      name="communicant"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <RequiredLabel required>
                            Are you a communicant?
                          </RequiredLabel>
                          <div className="mt-2 flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="YES"
                                checked={field.value === "YES"}
                                onChange={() => field.onChange("YES")}
                                className="radio"
                              />
                              Yes
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="NO"
                                checked={field.value === "NO"}
                                onChange={() => field.onChange("NO")}
                                className="radio"
                              />
                              No
                            </label>
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: DISCIPLINE & SERVICE */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="rounded-lg bg-primary/5 p-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <Church className="h-5 w-5 text-primary" />
                    DISCIPLINE & SERVICE RECORD
                  </h3>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md flex items-center gap-2 border-b pb-2 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    Church Discipline Record
                  </h4>

                  <div className="grid grid-cols-1 gap-6">
                    <Controller
                      name="beenOnDiscipline"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <RequiredLabel required>
                            Have you ever been on Church discipline?
                          </RequiredLabel>
                          <div className="mt-2 flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="YES"
                                checked={field.value === "YES"}
                                onChange={() => field.onChange("YES")}
                                className="radio"
                              />
                              Yes
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="NO"
                                checked={field.value === "NO"}
                                onChange={() => field.onChange("NO")}
                                className="radio"
                              />
                              No
                            </label>
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    {hasBeenOnDiscipline && (
                      <>
                        <Controller
                          name="disciplineReason"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="disciplineReason">
                                If Yes, State Reason
                              </FieldLabel>
                              <Textarea
                                {...field}
                                id="disciplineReason"
                                placeholder="State reason for discipline"
                                rows={2}
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <Controller
                            name="disciplineDate"
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="disciplineDate">
                                  Date of Discipline
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id="disciplineDate"
                                  type="date"
                                  value={field.value ?? ""}
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />

                          <Controller
                            name="disciplineReliefDate"
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="disciplineReliefDate">
                                  Date of Relief
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id="disciplineReliefDate"
                                  type="date"
                                  value={field.value ?? ""}
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md border-b pb-2 font-medium">
                    Previous Church Service
                  </h4>
                  <Controller
                    name="previousChurchPosition"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="previousChurchPosition">
                          Position Held in Your Previous Church
                        </FieldLabel>
                        <Input
                          {...field}
                          id="previousChurchPosition"
                          placeholder="E.g., Elder, Deacon, Usher"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>
            )}

            {/* STEP 5: RECOMMENDATIONS */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="rounded-lg bg-primary/5 p-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    SUGGESTIONS & RECOMMENDATIONS
                  </h3>
                </div>

                <Controller
                  name="suggestions"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="suggestions">
                        Suggestions/Recommendations towards improving the work
                        of God here:
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="suggestions"
                        placeholder="Please share your suggestions or recommendations..."
                        rows={8}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            )}

            {/* STEP 6: DECLARATION */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="rounded-lg bg-primary/5 p-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <FileSignature className="h-5 w-5 text-primary" />
                    DECLARATION
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* Member's Details */}
                  <div className="space-y-4 rounded-lg border p-4">
                    <h4 className="text-md font-semibold">Member's Details</h4>
                    <div className="space-y-4">
                      <Controller
                        name="memberSignature"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <RequiredLabel required>
                              Signature of Member
                            </RequiredLabel>
                            <Input
                              {...field}
                              id="memberSignature"
                              placeholder="Type full name as signature"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="memberSignedDate"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <RequiredLabel required>Date</RequiredLabel>
                            <Input
                              {...field}
                              id="memberSignedDate"
                              type="date"
                              value={field.value ?? ""}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>
                  </div>

                  {/* Pastor's Details */}
                  <div className="space-y-4 rounded-lg border p-4">
                    <h4 className="text-md font-semibold">Pastor's Details</h4>
                    <div className="space-y-4">
                      <Controller
                        name="pastorSignature"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <RequiredLabel required>
                              Pastor's Signature
                            </RequiredLabel>
                            <Input
                              {...field}
                              id="pastorSignature"
                              placeholder="Pastor's signature"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="pastorSignedDate"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <RequiredLabel required>Date</RequiredLabel>
                            <Input
                              {...field}
                              id="pastorSignedDate"
                              type="date"
                              value={field.value ?? ""}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </FieldGroup>
        </form>
      </CardContent>

      {submitError && (
        <div className="mx-6 mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-500">{submitError}</p>
        </div>
      )}

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
          <Button type="button" variant="outline" onClick={() => resetForm()}>
            Reset
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              type="submit"
              form="member-registration-form"
              disabled={isSubmitting || !passportUrl}
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
            <Button
              type="button"
              onClick={nextStep}
              className="gap-2"
              disabled={currentStep === 1 && !passportUrl}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
