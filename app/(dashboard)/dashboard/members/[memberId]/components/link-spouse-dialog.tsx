"use client"

import * as React from "react"
import { Link2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SpousePicker } from "../../components/spouse-picker"
import { linkMemberSpouse } from "../../actions"
import type { SpouseCandidate } from "../../matching"

interface LinkSpouseDialogProps {
  memberId: string
  spouseName?: string | null
  surname?: string
  address?: string
  homeCell?: string
  zone?: string
  childNames?: string[]
  gender?: string | null
}

export function LinkSpouseDialog({
  memberId,
  spouseName,
  surname,
  address,
  homeCell,
  zone,
  childNames,
  gender,
}: LinkSpouseDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState(spouseName ?? "")
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()

  const handleSelect = (spouse: SpouseCandidate | null) => {
    if (!spouse) return

    startTransition(async () => {
      const result = await linkMemberSpouse(memberId, spouse.id)
      if (result.success) {
        toast.success(result.message)
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline" className="gap-1.5">
          <Link2 className="h-3.5 w-3.5" />
          Link spouse
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link spouse</DialogTitle>
          <DialogDescription>
            Type the name written on the membership form. Registered members
            will be suggested — linking is never automatic.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Spouse's full name"
            autoFocus
          />
          <SpousePicker
            spouseName={name}
            value={null}
            currentMemberId={memberId}
            surname={surname}
            address={address}
            homeCell={homeCell}
            zone={zone}
            childNames={childNames}
            gender={gender}
            onChange={handleSelect}
          />
          {isPending && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Linking…
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
