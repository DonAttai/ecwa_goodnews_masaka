"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { PersonalInformation } from "../../../components/member-form/sections/personal-information"
import { FamilyInformation } from "../../../components/member-form/sections/family-information"
import { ChurchLife } from "../../../components/member-form/sections/church-life"
import { SpiritualStatus } from "../../../components/member-form/sections/spiritual status"
import { Discipline } from "../../../components/member-form/sections/discipline"
import { Button } from "@/components/ui/button"
import { baseMemberFormSchema } from "../../../schemas"
import { useTransition, useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateMember } from "../../../actions"
import { toast } from "sonner"
import { z } from "zod"
import { useRouter } from "next/navigation"

const partialMemberSchema = baseMemberFormSchema.partial()
export type PartialMemberFormValues = z.input<typeof partialMemberSchema> & {
  id?: string
}

type UpdateMemberFormProp = {
  member: PartialMemberFormValues
}

export default function UpdateMemberForm({ member }: UpdateMemberFormProp) {
  const [isPending, startTransition] = useTransition()
  const [isFormReady, setIsFormReady] = useState(false)
  const router = useRouter()
  const memberName = `${member.firstName} ${member.surname}`

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => setIsFormReady(true), 0)
    return () => clearTimeout(timer)
  }, [])

  // Memoize the default values to prevent unnecessary re-renders
  const defaultValues = useMemo(
    () => ({
      surname: member.surname,
      firstName: member.firstName,
      otherNames: member.otherNames || "",
      presentAddress: member.presentAddress,
      phoneNumber: member.phoneNumber,
      email: member.email || "",
      maritalStatus: member.maritalStatus as any,
      spouseName: member.spouseName || "",
      homeCell: member.homeCell || "",
      zone: member.zone || "",
      acceptedChrist: member.acceptedChrist,
      baptized: member.baptized,
      baptismPlace: member.baptismPlace || "",
      baptizedBy: member.baptizedBy || "",
      communicant: member.communicant,
      beenOnDiscipline: member.beenOnDiscipline,
      disciplineReason: member.disciplineReason || "",
      disciplineDate: member.disciplineDate || null,
      disciplineReliefDate: member.disciplineReliefDate || null,
      children: (member.children || []).map((child) => ({
        id: child.id,
        name: child.name,
        contact: child.contact || "",
      })),
      fellowshipGroupIds: (member.fellowshipGroupIds || []).map(
        (fellowshipId) => fellowshipId
      ),
    }),
    [member]
  ) // Only recreate if member changes

  const form = useForm<PartialMemberFormValues>({
    resolver: zodResolver(partialMemberSchema),
    defaultValues,
    // CRITICAL: These options prevent re-renders
    shouldUnregister: false,
    shouldFocusError: true,
    delayError: 300,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "children",
  })

  const onSubmit = async (data: PartialMemberFormValues) => {
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

    startTransition(async () => {
      const result = await updateMember(member.id!, formDataToSend)

      if (result.success) {
        toast.success(result.message)
        router.push(`/dashboard/members/${member.id}`)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  if (!isFormReady) {
    return (
      <div className="flex justify-center px-4">
        <Card className="w-full max-w-4xl">
          <CardContent className="py-8">
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center px-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Update <span className="font-bold text-blue-400">{memberName}</span>{" "}
            Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <PersonalInformation form={form} />

            <FamilyInformation
              form={form}
              fields={fields}
              append={append}
              remove={remove}
            />

            <ChurchLife form={form} />

            <SpiritualStatus form={form} />

            <Discipline form={form} />

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
