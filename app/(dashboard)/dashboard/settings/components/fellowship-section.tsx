// FellowshipSection.tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Trash2 } from "lucide-react"
import { FellowshipType } from "../types/fellowship"
import { Controller, UseFormReturn } from "react-hook-form"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

interface FellowshipPropType {
  isPending: boolean
  fellowships: FellowshipType[]
  handleAddFellowship: (data: FellowshipType) => Promise<void>
  form: UseFormReturn<FellowshipType>
  onEdit: (fellowship: FellowshipType) => void // Add this
  onDelete: (id: string) => void // Add this
}

export default function FellowshipSection({
  isPending,
  fellowships,
  handleAddFellowship,
  form,
  onEdit, // Add this
  onDelete, // Add this
}: FellowshipPropType) {
  return (
    <div className="space-y-8">
      {/* Add New Fellowship */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Fellowship</CardTitle>
          <CardDescription>
            Small groups, ministries, or classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleAddFellowship)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">
                        Name
                        <span className="ml-1 text-red-500">*</span>
                      </FieldLabel>

                      <Input
                        {...field}
                        id="name"
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g., Youth Fellowship"
                        autoComplete="off"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-textarea-about">
                      Fellowship Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="form-rhf-textarea-about"
                      aria-invalid={fieldState.invalid}
                      placeholder="Men fellowship..."
                      className="min-h-30"
                    />
                    <FieldDescription>
                      Give a brief description of the fellowship
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Fellowship"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Fellowships */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Fellowships ({fellowships.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {fellowships.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              No fellowships yet. Add one above.
            </p>
          ) : (
            <div className="space-y-4">
              {fellowships.map((f) => (
                <div
                  key={f.id}
                  className="group flex items-start justify-between rounded-2xl border p-5 hover:bg-muted/50"
                >
                  <div>
                    <p className="text-lg font-semibold">{f.name}</p>
                    {f.description && (
                      <p className="mt-1 text-muted-foreground">
                        {f.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(f)} // Add this
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(f.id!)} // Add this
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
