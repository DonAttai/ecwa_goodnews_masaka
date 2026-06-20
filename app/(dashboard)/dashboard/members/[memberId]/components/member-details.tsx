import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Mail,
  Phone,
  MapPin,
  MapPinned,
  Church,
  Cross,
  Droplets,
  Shield,
  PenLine,
  Users,
  Heart,
  FileSignature,
  Scale,
  Sparkles,
} from "lucide-react"
import { StatusBadge } from "./status-badge"
import { InfoCard } from "./info-card"
import { ChildCard } from "./child-card"
import { FellowshipGroupCard } from "./fellowship-group-card"
import { EditButton } from "./edit-member-button"
import { DeleteButton } from "./delete-member-button"
import { MemberFormValues } from "../../schemas"

type MemberDetailsPageProps = {
  member: MemberFormValues
  isAdmin: boolean
}

export default async function MemberDetailsPage({
  member,
  isAdmin,
}: MemberDetailsPageProps) {
  if (!member) notFound()

  const getInitials = () => {
    return `${member.firstName?.[0] || ""}${member.surname?.[0] || ""}`.toUpperCase()
  }

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "N/A"
    try {
      return new Date(date).toLocaleDateString()
    } catch {
      return "N/A"
    }
  }

  const memberFullName = `${member.surname} ${member.firstName}`

  return (
    <div className="relative min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        {/* HERO SECTION */}
        <Card className="relative overflow-hidden border-0 shadow-xl">
          {/* Edit Button - Top Right Corner */}
          {isAdmin && (
            <div className="absolute top-4 right-4 z-10">
              <EditButton memberId={member.id} />
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-primary/5 to-transparent" />
          <CardContent className="relative p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <Avatar className="h-28 w-28 border-4 border-background shadow-xl sm:h-32 sm:w-32">
                {member.passportUrl ? (
                  <AvatarImage src={member.passportUrl} alt="Passport" />
                ) : (
                  <AvatarFallback className="bg-linear-to-br from-primary to-primary/70 text-2xl text-white sm:text-3xl">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 space-y-3 text-center md:text-left">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight wrap-break-word sm:text-3xl">
                    {member.surname} {member.firstName}
                    {member.otherNames && (
                      <span className="text-muted-foreground">
                        {" "}
                        ({member.otherNames})
                      </span>
                    )}
                  </h1>
                  <div className="mt-2 space-y-1">
                    <p className="font-mono text-sm wrap-break-word text-muted-foreground">
                      Phone: {member.phoneNumber || "N/A"}
                    </p>
                    <p className="font-mono text-sm wrap-break-word text-muted-foreground">
                      Email: {member.email || "N/A"}
                    </p>
                    <p className="font-mono text-sm text-muted-foreground">
                      Marital Status: {member.maritalStatus || "N/A"}
                    </p>
                    {member.spouseName && (
                      <p className="font-mono text-sm text-muted-foreground">
                        Spouse: {member.spouseName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions Card */}
        {member.suggestions && (
          <Card className="overflow-hidden border-0 bg-linear-to-r from-amber-50 to-yellow-50 shadow-lg dark:from-amber-950/30 dark:to-yellow-950/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <h3 className="mb-2 font-semibold text-amber-800 dark:text-amber-300">
                    Suggestions & Notes
                  </h3>
                  <p className="text-muted-foreground italic">
                    "{member.suggestions}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* QUICK STATS GRID */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={MapPin}
            label="Present Address"
            value={member.presentAddress}
          />
          <InfoCard
            icon={MapPinned}
            label="State Of Origin"
            value={member.stateOfOrigin || "N/A"}
          />
          <InfoCard icon={MapPin} label="LGA" value={member.lga || "N/A"} />
          <InfoCard icon={Users} label="Tribe" value={member.tribe} />
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Spiritual Journey */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Cross className="h-5 w-5 text-purple-600" />
                  Spiritual Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Heart className="h-4 w-4 text-rose-500" />
                      Accepted Christ
                    </span>
                    <StatusBadge label={member.acceptedChrist} showIcon />
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      Baptized
                    </span>
                    <StatusBadge label={member.baptized} showIcon />
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Church className="h-4 w-4 text-emerald-500" />
                      Communicant
                    </span>
                    <StatusBadge label={member.communicant} showIcon />
                  </div>
                </div>

                {(member.baptismPlace || member.baptizedBy) && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <div className="rounded-lg bg-muted/20 p-3">
                        <p className="text-xs font-medium text-muted-foreground">
                          Baptism Details
                        </p>
                        <div className="mt-2 space-y-1">
                          {member.baptismPlace && (
                            <p className="text-sm wrap-break-word">
                              📍 {member.baptismPlace}
                            </p>
                          )}
                          {member.baptizedBy && (
                            <p className="text-sm wrap-break-word">
                              👨‍🏫 By: {member.baptizedBy}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Fellowship Groups */}
            {member.fellowshipGroupIds &&
              member.fellowshipGroupIds.length > 0 && (
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardHeader className="bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Users className="h-5 w-5 text-emerald-600" />
                      Fellowship Groups ({member.fellowshipGroupIds.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-6">
                    {member.fellowshipGroupIds.map((groupId, idx) => (
                      <FellowshipGroupCard
                        key={groupId || idx}
                        groupId={groupId}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Discipline Record */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Scale className="h-5 w-5 text-amber-600" />
                  Discipline Record
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center justify-between rounded-lg bg-muted/30 p-3">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Shield className="h-4 w-4 text-amber-500" />
                    Ever been on discipline?
                  </span>
                  <StatusBadge label={member.beenOnDiscipline} showIcon />
                </div>

                {member.beenOnDiscipline === "YES" && (
                  <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50/30 p-4 dark:border-amber-800 dark:bg-amber-950/20">
                    <InfoCard label="Reason" value={member.disciplineReason} />
                    {member.disciplineDate && (
                      <InfoCard
                        label="Discipline Date"
                        value={formatDate(member.disciplineDate)}
                      />
                    )}
                    {member.disciplineReliefDate && (
                      <InfoCard
                        label="Relief Date"
                        value={formatDate(member.disciplineReliefDate)}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Previous Church Info */}
            {(member.previousPlaceOfWorship ||
              member.previousChurchPosition) && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Church className="h-5 w-5 text-muted-foreground" />
                    Previous Church
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {member.previousPlaceOfWorship && (
                    <InfoCard
                      label="Previous Place of Worship"
                      value={member.previousPlaceOfWorship}
                    />
                  )}
                  {member.previousChurchPosition && (
                    <InfoCard
                      label="Previous Position"
                      value={member.previousChurchPosition}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Signatures */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-linear-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileSignature className="h-5 w-5" />
                  Approvals & Signatures
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <PenLine className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground">
                      Member Signature
                    </p>
                  </div>
                  <p className="mt-2 font-serif text-base font-medium wrap-break-word sm:text-lg">
                    {member.memberSignature || "N/A"}
                  </p>
                  {member.memberSignedDate && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(member.memberSignedDate)}
                    </p>
                  )}
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <Cross className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground">
                      Pastor Signature
                    </p>
                  </div>
                  <p className="mt-2 font-serif text-base font-medium wrap-break-word sm:text-lg">
                    {member.pastorSignature || "N/A"}
                  </p>
                  {member.pastorSignedDate && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(member.pastorSignedDate)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CHILDREN SECTION - Full Width */}
        {member.children && member.children.length > 0 && (
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Heart className="h-5 w-5 text-blue-600" />
                Children ({member.children.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
              {member.children.map((child, idx) => (
                <ChildCard key={child.id || idx} child={child} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* DELETE BUTTON - Bottom Right Corner */}

        {isAdmin && (
          <div className="flex justify-end pt-4">
            <DeleteButton memberId={member.id} memberName={memberFullName} />
          </div>
        )}
      </div>
    </div>
  )
}
