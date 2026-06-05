"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { memberFormSchema } from "./schemas"
import { requireAdmin } from "@/lib/auth"

export async function createMember(formData: FormData) {
  try {
    await requireAdmin()

    // Extract text fields
    const surname = formData.get("surname") as string
    const firstName = formData.get("firstName") as string
    const otherNames = formData.get("otherNames") as string
    const presentAddress = formData.get("presentAddress") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const email = formData.get("email") as string
    const previousPlaceOfWorship = formData.get(
      "previousPlaceOfWorship"
    ) as string
    const maritalStatus = formData.get("maritalStatus") as string
    const spouseName = formData.get("spouseName") as string
    const homeCell = formData.get("homeCell") as string
    const zone = formData.get("zone") as string
    const stateOfOrigin = formData.get("stateOfOrigin") as string
    const lga = formData.get("lga") as string
    const tribe = formData.get("tribe") as string
    const acceptedChrist = formData.get("acceptedChrist") as string
    const baptized = formData.get("baptized") as string
    const baptismPlace = formData.get("baptismPlace") as string
    const baptizedBy = formData.get("baptizedBy") as string
    const communicant = formData.get("communicant") as string
    const beenOnDiscipline = formData.get("beenOnDiscipline") as string
    const disciplineReason = formData.get("disciplineReason") as string
    const disciplineDate = formData.get("disciplineDate") as string
    const disciplineReliefDate = formData.get("disciplineReliefDate") as string
    const previousChurchPosition = formData.get(
      "previousChurchPosition"
    ) as string
    const suggestions = formData.get("suggestions") as string
    const memberSignature = formData.get("memberSignature") as string
    const memberSignedDate = formData.get("memberSignedDate") as string
    const pastorSignature = formData.get("pastorSignature") as string
    const pastorSignedDate = formData.get("pastorSignedDate") as string
    const children = JSON.parse((formData.get("children") as string) || "[]")

    // Handle passport upload
    const passportUrl = formData.get("passportUrl") as string | null

    // Convert YES/NO strings to booleans
    const convertToBoolean = (value: string | null): boolean => {
      return value === "YES"
    }

    // Validate with Zod
    const validationData = {
      surname,
      firstName,
      otherNames: otherNames || undefined,
      presentAddress,
      phoneNumber,
      email: email || undefined,
      previousPlaceOfWorship: previousPlaceOfWorship || undefined,
      maritalStatus,
      spouseName: spouseName || undefined,
      homeCell: homeCell || undefined,
      zone: zone || undefined,
      stateOfOrigin,
      lga,
      tribe,
      passportUrl: passportUrl || undefined,
      children,
      fellowshipGroupIds: JSON.parse(
        (formData.get("fellowshipGroupIds") as string) || "[]"
      ),
      acceptedChrist: acceptedChrist as "YES" | "NO",
      baptized: baptized as "YES" | "NO",
      baptismPlace: baptismPlace || undefined,
      baptizedBy: baptizedBy || undefined,
      communicant: communicant as "YES" | "NO",
      beenOnDiscipline: beenOnDiscipline as "YES" | "NO",
      disciplineReason: disciplineReason || undefined,
      disciplineDate: disciplineDate || undefined,
      disciplineReliefDate: disciplineReliefDate || undefined,
      previousChurchPosition: previousChurchPosition || undefined,
      suggestions: suggestions || undefined,
      memberSignature: memberSignature || undefined,
      memberSignedDate: memberSignedDate || undefined,
      pastorSignature: pastorSignature || undefined,
      pastorSignedDate: pastorSignedDate || undefined,
    }

    const parsed = memberFormSchema.safeParse(validationData)

    if (!parsed.success) {
      console.error("Validation errors:", parsed.error.flatten())
      return {
        success: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
        message: "Please check the form for errors",
      }
    }

    const validatedData = parsed.data

    // Create member in database
    const member = await prisma.member.create({
      data: {
        surname: validatedData.surname,
        firstName: validatedData.firstName,
        otherNames: validatedData.otherNames,
        presentAddress: validatedData.presentAddress,
        phoneNumber: validatedData.phoneNumber,
        email: validatedData.email,
        previousPlaceOfWorship: validatedData.previousPlaceOfWorship,
        maritalStatus: validatedData.maritalStatus,
        spouseName: validatedData.spouseName,
        homeCell: validatedData.homeCell,
        zone: validatedData.zone,
        stateOfOrigin: validatedData.stateOfOrigin,
        lga: validatedData.lga,
        tribe: validatedData.tribe,
        passportUrl: validatedData.passportUrl,
        acceptedChrist: convertToBoolean(validatedData.acceptedChrist)
          ? "YES"
          : "NO",
        baptized: convertToBoolean(validatedData.baptized) ? "YES" : "NO",
        baptismPlace: validatedData.baptismPlace,
        baptizedBy: validatedData.baptizedBy,
        communicant: convertToBoolean(validatedData.communicant) ? "YES" : "NO",
        beenOnDiscipline: convertToBoolean(validatedData.beenOnDiscipline)
          ? "YES"
          : "NO",
        disciplineReason: validatedData.disciplineReason,
        disciplineDate: validatedData.disciplineDate
          ? new Date(validatedData.disciplineDate)
          : null,
        disciplineReliefDate: validatedData.disciplineReliefDate
          ? new Date(validatedData.disciplineReliefDate)
          : null,
        previousChurchPosition: validatedData.previousChurchPosition,
        suggestions: validatedData.suggestions,
        memberSignature: validatedData.memberSignature,
        memberSignedDate: validatedData.memberSignedDate
          ? new Date(validatedData.memberSignedDate)
          : null,
        pastorSignature: validatedData.pastorSignature,
        pastorSignedDate: validatedData.pastorSignedDate
          ? new Date(validatedData.pastorSignedDate)
          : null,
      },
    })

    // Create children
    if (validatedData.children && validatedData.children.length > 0) {
      await prisma.child.createMany({
        data: validatedData.children.map((child: any) => ({
          name: child.name,
          contact: child.contact,
          memberId: member.id,
        })),
      })
    }

    // add fellowship group associations
    if (validatedData.fellowshipGroupIds?.length) {
      const operations = validatedData.fellowshipGroupIds.map(
        (fellowshipId: string) =>
          prisma.memberFellowship.upsert({
            where: {
              memberId_fellowshipId: {
                memberId: member.id,
                fellowshipId,
              },
            },
            update: {},
            create: {
              memberId: member.id,
              fellowshipId,
              addedAt: new Date(),
            },
          })
      )

      await Promise.all(operations)
    }

    revalidatePath("/dashboard/members")
    revalidatePath(`/dashboard/members/${member.id}`)

    return {
      success: true,
      message: "Member created successfully",
      memberId: member.id,
    }
  } catch (error) {
    console.error("Create Member Error:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server error occurred while creating member",
    }
  }
}
