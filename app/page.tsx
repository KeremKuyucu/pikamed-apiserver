import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Mail, Bot, Calendar, Users, Database, Zap } from "lucide-react"

export default function HomePage() {
  const apiEndpoints = [
    {
      category: "Authentication & Logging",
      icon: <Shield className="h-5 w-5" />,
      endpoints: [
        { method: "POST", path: "/api/pikamed/authlog", description: "User login/logout logging", auth: "None" },
        { method: "POST", path: "/api/pikamed/pikamedfeedback", description: "User feedback submission", auth: "User" },
      ],
    },
    {
      category: "AI Integration",
      icon: <Bot className="h-5 w-5" />,
      endpoints: [
        { method: "POST", path: "/api/pikamed/ai", description: "AI consultation with Gemini API", auth: "User" },
      ],
    },
    {
      category: "User Management",
      icon: <Users className="h-5 w-5" />,
      endpoints: [
        { method: "POST", path: "/api/pikamed/add-doctor", description: "Add doctor role to user", auth: "Admin" },
        {
          method: "POST",
          path: "/api/pikamed/delete-doctor",
          description: "Remove doctor role from user",
          auth: "Admin",
        },
        { method: "GET", path: "/api/pikamed/get-doctors", description: "Get all doctors", auth: "Admin" },
        { method: "GET", path: "/api/pikamed/get-admins", description: "Get all admins", auth: "Admin" },
        { method: "GET", path: "/api/pikamed/get-users", description: "Get all users", auth: "Doctor" },
      ],
    },
    {
      category: "Data Management",
      icon: <Database className="h-5 w-5" />,
      endpoints: [
        { method: "POST", path: "/api/pikamed/userdata", description: "Get user data from Discord", auth: "User" },
        { method: "POST", path: "/api/pikamed/info", description: "Submit user information", auth: "User" },
      ],
    },
    {
      category: "Email & Notifications",
      icon: <Mail className="h-5 w-5" />,
      endpoints: [
        {
          method: "POST",
          path: "/api/pikamed/send-notification",
          description: "Send email notifications",
          auth: "Admin",
        },
        {
          method: "POST",
          path: "/api/pikamed/send-warning",
          description: "Send patient access warning",
          auth: "Doctor",
        },
        {
          method: "POST",
          path: "/api/pikamed/notificationInfo",
          description: "Update notification preferences",
          auth: "User",
        },
        {
          method: "GET",
          path: "/api/pikamed/unsubscribe",
          description: "Unsubscribe from notifications",
          auth: "None",
        },
      ],
    },
    {
      category: "Access Control",
      icon: <Zap className="h-5 w-5" />,
      endpoints: [
        {
          method: "GET",
          path: "/api/pikamed/superadmin-access",
          description: "Superadmin access check",
          auth: "Superadmin",
        },
        { method: "GET", path: "/api/pikamed/admin-access", description: "Admin access check", auth: "Admin" },
        { method: "GET", path: "/api/pikamed/doctor-access", description: "Doctor access check", auth: "Doctor" },
        { method: "GET", path: "/api/pikamed/user-access", description: "User access check", auth: "User" },
      ],
    },
    {
      category: "Game API",
      icon: <Calendar className="h-5 w-5" />,
      endpoints: [{ method: "GET", path: "/api/geogame/*", description: "Geography game endpoints", auth: "Varies" }],
    },
  ]

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "POST":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "PUT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "DELETE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getAuthColor = (auth: string) => {
    switch (auth) {
      case "None":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "User":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Doctor":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Admin":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "Superadmin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">PikaMed API Server</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Comprehensive medical application API with AI integration, user management, and notification system
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="px-3 py-1">
              <Bot className="h-4 w-4 mr-1" />
              AI Powered
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Shield className="h-4 w-4 mr-1" />
              Secure Authentication
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Mail className="h-4 w-4 mr-1" />
              Email Notifications
            </Badge>
          </div>
        </div>

        <div className="grid gap-8">
          {apiEndpoints.map((category, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  {category.icon}
                  {category.category}
                </CardTitle>
                <CardDescription>API endpoints for {category.category.toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.endpoints.map((endpoint, endpointIndex) => (
                    <div
                      key={endpointIndex}
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                          <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {endpoint.path}
                          </code>
                        </div>
                        <Badge className={getAuthColor(endpoint.auth)}>{endpoint.auth}</Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{endpoint.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-12" />

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  Firebase Authentication & Authorization
                </li>
                <li className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-500" />
                  AI Integration with Google Gemini
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-500" />
                  Email Notifications via Mailjet
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  Automated Insulin Reminders
                </li>
                <li className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-indigo-500" />
                  Discord Integration for Logging
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">None</span>
                  <Badge className={getAuthColor("None")}>Public Access</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">User</span>
                  <Badge className={getAuthColor("User")}>Level 0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Doctor</span>
                  <Badge className={getAuthColor("Doctor")}>Level 1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Admin</span>
                  <Badge className={getAuthColor("Admin")}>Level 3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Superadmin</span>
                  <Badge className={getAuthColor("Superadmin")}>Level 5</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p>Server is running and all APIs are active</p>
          <p className="text-sm mt-2">Built with Next.js • Deployed on Vercel</p>
        </div>
      </div>
    </div>
  )
}
