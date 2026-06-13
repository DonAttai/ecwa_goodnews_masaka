import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Bell,
  Church,
  Globe,
  Languages,
  Moon,
  Palette,
  Shield,
  Users,
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="text-sm text-slate-500">
          Manage church information and system preferences
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Church Information Section */}
        <Card>
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Church className="h-5 w-5 text-indigo-500" />
              Church Information
            </CardTitle>
            <CardDescription>
              Basic information about your church
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label htmlFor="churchName">Church name</Label>
              <Input
                id="churchName"
                placeholder="Enter church name"
                className="bg-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="founded">Founded year</Label>
                <Input
                  id="founded"
                  type="number"
                  placeholder="e.g., 1985"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="denomination">Denomination</Label>
                <Input
                  id="denomination"
                  placeholder="e.g., Baptist, Methodist, Non-denominational"
                  className="bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Church address</Label>
              <Input
                id="address"
                placeholder="Street address, city, state, ZIP"
                className="bg-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Church email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="office@yourchurch.org"
                  className="bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Church description</Label>
              <Textarea
                id="description"
                placeholder="Write a brief description of your church mission and vision..."
                className="min-h-[100px] bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceTimes">Service times</Label>
              <Input
                id="serviceTimes"
                placeholder="e.g., Sunday 9:00 AM & 11:00 AM, Wednesday 7:00 PM"
                className="bg-white"
              />
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 bg-slate-50/50">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Save Church Info
            </Button>
          </CardFooter>
        </Card>

        {/* System Preferences */}
        <Card>
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-indigo-500" />
              System Preferences
            </CardTitle>
            <CardDescription>
              Customize your system appearance and behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Dark mode</Label>
                <p className="text-sm text-slate-500">
                  Toggle between light and dark theme
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-slate-400" />
                <Switch className="data-[state=checked]:bg-indigo-600" />
              </div>
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Language</Label>
                <p className="text-sm text-slate-500">
                  Choose your preferred language
                </p>
              </div>
              <select className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="pt">Português</option>
              </select>
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Date format</Label>
                <p className="text-sm text-slate-500">
                  Choose how dates are displayed
                </p>
              </div>
              <select className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                <option value="us">MM/DD/YYYY (US)</option>
                <option value="eu">DD/MM/YYYY (EU)</option>
                <option value="iso">YYYY-MM-DD (ISO)</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 bg-slate-50/50">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Save Preferences
            </Button>
          </CardFooter>
        </Card>

        {/* Notifications Settings */}
        <Card>
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-indigo-500" />
              Notifications
            </CardTitle>
            <CardDescription>Configure system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email notifications</Label>
                <p className="text-sm text-slate-500">
                  Receive system updates via email
                </p>
              </div>
              <Switch
                defaultChecked
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Member activity alerts</Label>
                <p className="text-sm text-slate-500">
                  Get notified about new member registrations
                </p>
              </div>
              <Switch
                defaultChecked
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Event reminders</Label>
                <p className="text-sm text-slate-500">
                  Receive reminders about upcoming church events
                </p>
              </div>
              <Switch
                defaultChecked
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 bg-slate-50/50">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Save Notification Settings
            </Button>
          </CardFooter>
        </Card>

        {/* Member Management Settings */}
        <Card>
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-indigo-500" />
              Member Management
            </CardTitle>
            <CardDescription>Configure member-related settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto member ID</Label>
                <p className="text-sm text-slate-500">
                  Automatically generate member IDs for new members
                </p>
              </div>
              <Switch
                defaultChecked
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Require approval</Label>
                <p className="text-sm text-slate-500">
                  Require admin approval for new member registrations
                </p>
              </div>
              <Switch className="data-[state=checked]:bg-indigo-600" />
            </div>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="defaultRole">Default member role</Label>
              <select
                id="defaultRole"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="member">Member</option>
                <option value="regular">Regular Attendee</option>
                <option value="visitor">Visitor</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 bg-slate-50/50">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Save Member Settings
            </Button>
          </CardFooter>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader className="border-b border-red-100">
            <CardTitle className="flex items-center gap-2 text-lg text-red-600">
              <Shield className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that affect your church data
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-lg border border-red-200 bg-red-50/30 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-semibold text-red-700">
                    Export all church data
                  </h4>
                  <p className="text-sm text-red-600">
                    Download a complete backup of all church member and activity
                    data
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Export Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
