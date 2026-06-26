"use client"

import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Menu, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { toast } from "sonner"
import { Church, User, Users } from "lucide-react"

// Server Actions
import { updateGeneralSettings } from "../actions/general"
import {
  createFellowship,
  updateFellowship,
  deleteFellowship,
} from "../actions/fellowship"
import FellowshipSection from "./fellowship-section"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { fellowshipSchema, FellowshipType } from "../types/fellowship"
import { generalSchema, GeneralType } from "../types/general"
import GeneralSection from "./general-section"
import MembershipLandingPage from "./membership"

interface SettingsPageProps {
  fellowships: FellowshipType[]
  generalSettings: GeneralType
}

export default function SettingsPage({
  fellowships,
  generalSettings,
}: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState<
    "general" | "membership" | "fellowships"
  >("general")

  const [isPending, startTransition] = useTransition()

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const [editingFellowship, setEditingFellowship] =
    useState<FellowshipType | null>(null)

  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fellowshipToDelete, setFellowshipToDelete] = useState<string | null>(
    null
  )

  // Close mobile sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileSidebarOpen])

  // general settings form
  const generalForm = useForm<GeneralType>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      churchName: generalSettings?.churchName || "",
      address: generalSettings?.address || "",
      phone: generalSettings?.phone || "",
      email: generalSettings?.email || "",
      website: generalSettings?.website || "",
      logoUrl: generalSettings?.logoUrl || "",
      welcomeMessage: generalSettings?.welcomeMessage || "",
    },
  })

  // General settings handler
  const handleUpdateSettings = async (data: GeneralType): Promise<void> => {
    startTransition(async () => {
      const formDataToSend = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "string") {
            formDataToSend.append(key, value)
          }
        }
      })

      const result = await updateGeneralSettings(formDataToSend)

      if (result.success) {
        toast.success(result.message)
        return
      } else {
        toast.error(result.message || "Failed to create fellowship")
      }
    })
  }

  // fellowship form
  const fellowshipForm = useForm<FellowshipType>({
    resolver: zodResolver(fellowshipSchema),
    defaultValues: { name: "", description: "" },
  })

  // FELLOWSHIP HANDLERS
  const handleAddFellowship = async (data: FellowshipType) => {
    try {
      const formDataToSend = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "string") {
            formDataToSend.append(key, value)
          }
        }
      })

      const result = await createFellowship(formDataToSend)
      if (result.success) {
        toast.success(result.message)
        fellowshipForm.reset({ name: "", description: "" })
        return
      } else {
        toast.error(result.message || "Failed to create fellowship")
      }
    } catch (error) {
      toast.error("Failed to create fellowship")
    }
  }

  const handleEditFellowship = async (data: FellowshipType) => {
    try {
      const formDataToSend = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "string") {
            formDataToSend.append(key, value)
          }
        }
      })

      const result = await updateFellowship(data.id!, formDataToSend)
      if (result.success) {
        toast.success(result.message)
        setEditingFellowship(null)
        // Refresh fellowships list or update state
      } else {
        toast.error(result.message || "Failed to update fellowship")
      }
    } catch (error) {
      toast.error("Failed to update fellowship")
    }
  }

  // Open delete confirmation dialog
  const handleDeleteClick = (id: string) => {
    setFellowshipToDelete(id)
    setDeleteDialogOpen(true)
  }

  // Handle actual deletion
  const handleDeleteFellowship = async () => {
    if (!fellowshipToDelete) return

    try {
      const result = await deleteFellowship(fellowshipToDelete)
      if (result.success) {
        toast.success(result.message)
        setDeleteDialogOpen(false)
        setFellowshipToDelete(null)
      } else {
        toast.error(result.message || "Failed to delete fellowship")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete fellowship")
    }
  }

  const sidebarItems = [
    { id: "general", label: "General", icon: Church },
    { id: "membership", label: "Membership", icon: User },
    { id: "fellowships", label: "Fellowships", icon: Users },
  ] as const

  return (
    <div className="min-h-screen bg-background md:flex">
      {/* Mobile Header with Hamburger */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/80 p-4 backdrop-blur-sm md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <Church className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground capitalize">
              {activeSection}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-label="Toggle menu"
          className="text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {isMobileSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden w-72 shrink-0 border-r border-border bg-card/80 p-6 backdrop-blur-sm md:block">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <Church className="h-6 w-6 text-primary" />
          </div>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                  isActive
                    ? "bg-primary/20 text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <>
        {/* Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar Panel */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-70 transform border-r border-border bg-card p-6 transition-transform duration-300 ease-in-out md:hidden ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <Church className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Settings
                </h1>
                <p className="text-sm text-muted-foreground">
                  Church Administration
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-label="Close menu"
              className="text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    setIsMobileSidebarOpen(false)
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                    isActive
                      ? "bg-primary/20 text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        {/* Desktop Header */}
        <div className="mb-6 hidden md:block">
          <h2 className="text-gold text-2xl font-bold tracking-tight capitalize sm:text-3xl">
            {activeSection}
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage your church configuration
          </p>
        </div>

        {/* Mobile Header (hidden when sidebar is open) */}
        <div className="mb-6 md:hidden">
          <h2 className="text-gold text-2xl font-bold tracking-tight capitalize">
            {activeSection}
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your church configuration
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl">
          {/* GENERAL */}
          {activeSection === "general" && (
            <GeneralSection
              generalSettings={generalSettings}
              form={generalForm}
              isPending={isPending}
              handleUpdateSettings={handleUpdateSettings}
            />
          )}

          {/* MEMBERSHIP */}

          {activeSection === "membership" && <MembershipLandingPage />}

          {/* FELLOWSHIPS (Full CRUD) */}
          {activeSection === "fellowships" && (
            <FellowshipSection
              isPending={isPending}
              form={fellowshipForm}
              fellowships={fellowships}
              handleAddFellowship={handleAddFellowship}
              onEdit={setEditingFellowship}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </div>

      {/* Edit Fellowship Dialog */}
      <Dialog
        open={!!editingFellowship}
        onOpenChange={() => setEditingFellowship(null)}
      >
        <DialogContent className="mx-4 border-border bg-card text-foreground sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Edit Fellowship
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update the fellowship details below.
            </DialogDescription>
          </DialogHeader>
          {editingFellowship && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleEditFellowship(editingFellowship)
              }}
            >
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Name</Label>
                  <Input
                    value={editingFellowship.name}
                    onChange={(e) =>
                      setEditingFellowship((prev) =>
                        prev ? { ...prev, name: e.target.value } : null
                      )
                    }
                    className="border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Description</Label>
                  <Textarea
                    value={editingFellowship.description || ""}
                    onChange={(e) =>
                      setEditingFellowship((prev) =>
                        prev ? { ...prev, description: e.target.value } : null
                      )
                    }
                    rows={5}
                    className="border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>
              </div>
              <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingFellowship(null)}
                  className="w-full border-border text-foreground hover:bg-muted sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" className="btn-gold w-full sm:w-auto">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="mx-4 border-border bg-card text-foreground sm:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete Fellowship?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This fellowship will be permanently
              removed from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false)
                setFellowshipToDelete(null)
              }}
              className="w-full border-border bg-muted/30 text-foreground hover:bg-muted sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFellowship}
              className="text-destructive-foreground w-full bg-destructive hover:bg-destructive/90 sm:w-auto"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
