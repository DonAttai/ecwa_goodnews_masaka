"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
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

interface RequisitionFormProps {
  isAdmin: boolean
  canCreateRequisition: boolean
}

export default function RequisitionForm({
  canCreateRequisition,
}: RequisitionFormProps) {
  const [open, setOpen] = useState(false)
  const form = useForm<
    z.input<typeof requisitionSchema>,
    unknown,
    RequisitionType
  >({
    resolver: zodResolver(requisitionSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      amount: "",
      currency: "NGN",
      priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      dueDate: "",
      rejectionReason: "",
    },
    mode: "onBlur",
  })

  async function onSubmit(data: RequisitionType) {
    const cleanData = {
      ...data,
      amount: data.amount,
      dueDate: data.dueDate || undefined,
    }
    try {
      const result = await createRequisition(cleanData)

      if (result.success) {
        toast.success(result.message || "Requisition submitted")
        form.reset({
          title: "",
          description: "",
          category: "",
          amount: "",
          currency: "NGN",
          priority: "MEDIUM",
          dueDate: "",
          rejectionReason: "",
        })
        setOpen(false)
      } else {
        toast.error(result.message || "Failed to submit requisition")
      }
    } catch {
      toast.error("An unexpected error happened")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {canCreateRequisition && (
        <DialogTrigger asChild>
          <Button className="btn-gold h-9 w-fit rounded-lg text-sm sm:w-auto sm:rounded-xl sm:px-4 md:h-10 md:px-5">
            <Plus />
            Make a requisition
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0 sm:max-w-2xl">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle>New requisition request</DialogTitle>
            <DialogDescription>
              Fill in the details below to submit a request for approval.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                    aria-invalid={fieldState.invalid}
                    placeholder="0.00"
                    autoComplete="off"
                    value={typeof field.value === "number" ? field.value : ""}
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
                    className="min-h-30"
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
              name="dueDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Due Date</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="date"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting
                ? "Submitting..."
                : "Submit requisition"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
