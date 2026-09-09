"use client"

import { Plus, Upload, X, Receipt } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createRequisition } from "../actions"
import { Controller, useForm } from "react-hook-form"
import { requisitionSchema, RequisitionType } from "../schema"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { RHFSelect } from "./rhf-select"
import * as z from "zod"
import { Skeleton } from "@/components/ui/skeleton"
import { useDialogFormReady } from "@/hooks/use-dialog-form-ready"
import { CldUploadWidget } from "next-cloudinary"

const defaultValues = {
  title: "",
  description: "",
  category: "",
  amount: "",
  currency: "NGN",
  priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
  neededBy: "",
  rejectionReason: "",
  receiptUrl: "",
}

// Lightweight placeholder shown for a single frame while the dialog shell
// paints, so the heavy form can mount on the next frame without blocking
// the opening interaction (INP).
function RequisitionFormSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
export default function RequisitionForm() {
  const { open, contentReady, handleOpenChange, handleClose } =
    useDialogFormReady()
  const form = useForm<
    z.input<typeof requisitionSchema>,
    unknown,
    RequisitionType
  >({
    resolver: zodResolver(requisitionSchema),
    defaultValues,
    mode: "onBlur",
  })

  async function onSubmit(data: RequisitionType) {
    try {
      const result = await createRequisition({
        ...data,
        neededBy: data.neededBy || undefined,
      })

      if (!result.success) {
        toast.error(result.message || "Failed to submit requisition")
        return
      }

      handleClose()
      toast.success(result.message || "Requisition submitted")
    } catch (error) {
      console.error(error)
      toast.error("An unexpected error happened")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen) form.reset(defaultValues)
        handleOpenChange(isOpen)
      }}
    >
      <DialogTrigger asChild>
        <Button className="btn-gold h-10 w-fit rounded-xl text-sm font-semibold sm:rounded-xl sm:px-4 md:h-11 md:px-5 md:text-base">
          <Plus />
          Create Requisition
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl p-0 sm:max-w-2xl">
        <div className="p-5 sm:p-6">
          <DialogHeader className="mb-4 text-left">
            <DialogTitle className="text-lg sm:text-xl">
              New requisition request
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to submit a request for approval.
            </DialogDescription>
          </DialogHeader>

          {contentReady ? (
            <div className="animate-in fade-in-0">
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g. Church van fuel"
                        autoComplete="off"
                        className="h-12 text-base"
                      />
                      <FieldDescription>
                        Provide a concise title for your requisition.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="category"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Transport, equipment, welfare..."
                        autoComplete="off"
                        className="h-12 text-base"
                      />
                      <FieldDescription>
                        Provide a category for your requisition.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="amount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Amount</FieldLabel>

                      <Input
                        {...field}
                        id={field.name}
                        type="number"
                        inputMode="decimal"
                        aria-invalid={fieldState.invalid}
                        placeholder="0.00"
                        autoComplete="off"
                        className="h-12 text-base"
                        value={
                          typeof field.value === "number" ? field.value : ""
                        }
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || undefined)
                        }
                      />

                      <FieldDescription>
                        Provide the amount for your requisition.
                      </FieldDescription>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <RHFSelect
                    control={form.control}
                    name="currency"
                    label="Currency"
                    placeholder="Select"
                    className="min-w-120px"
                    options={[
                      { label: "NGN", value: "NGN" },
                      { label: "USD", value: "USD" },
                    ]}
                  />

                  <RHFSelect
                    control={form.control}
                    name="priority"
                    label="Priority"
                    placeholder="Select"
                    className="min-w-120px"
                    options={[
                      { label: "Low", value: "LOW" },
                      { label: "Medium", value: "MEDIUM" },
                      { label: "High", value: "HIGH" },
                      { label: "Urgent", value: "URGENT" },
                    ]}
                  />
                </div>

                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-textarea-about">
                        More about the requisition
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="form-rhf-textarea-about"
                        aria-invalid={fieldState.invalid}
                        placeholder="Money to fuel the church vehicle..."
                        className="min-h-30 text-base"
                      />
                      <FieldDescription>
                        Describe the request and why it is needed
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="neededBy"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Needed By</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="date"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        className="h-12 text-base"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="receiptUrl"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Receipt / supporting doc (optional)</FieldLabel>
                      {field.value ? (
                        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3">
                          <Receipt className="size-4 shrink-0 text-primary" />
                          <a
                            href={field.value}
                            target="_blank"
                            rel="noreferrer"
                            className="min-w-0 flex-1 truncate text-sm font-medium text-primary hover:underline"
                          >
                            View uploaded file
                          </a>
                          <button
                            type="button"
                            onClick={() => field.onChange("")}
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                            aria-label="Remove receipt"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <CldUploadWidget
                          signatureEndpoint="/api/cloudinary-sign"
                          options={{
                            maxFiles: 1,
                            maxFileSize: 5242880, // 5MB
                            sources: ["local", "camera"],
                            folder: "requisitions",
                          }}
                          onSuccess={({ info }) => {
                            const url =
                              typeof info === "string"
                                ? undefined
                                : info?.secure_url
                            if (url) {
                              field.onChange(url)
                              toast.success("Receipt uploaded")
                            } else {
                              toast.error("No file URL returned")
                            }
                          }}
                          onError={() =>
                            toast.error("Upload failed. Please try again.")
                          }
                        >
                          {({ open, isLoading }) => (
                            <Button
                              type="button"
                              variant="outline"
                              disabled={isLoading}
                              onClick={() => open()}
                              className="h-12 w-full text-base"
                            >
                              <Upload className="mr-2 size-4" />
                              {isLoading ? "Uploading..." : "Upload receipt"}
                            </Button>
                          )}
                        </CldUploadWidget>
                      )}
                      <FieldDescription>
                        Photo or PDF of a quote, invoice, or receipt.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <div className="sticky bottom-0 -mx-1 bg-gradient-to-t from-card via-card to-transparent pt-4 pb-1">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="h-12 w-full text-base font-semibold"
                  >
                    {form.formState.isSubmitting
                      ? "Submitting..."
                      : "Submit requisition"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <RequisitionFormSkeleton />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
