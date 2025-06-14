import Link from "next/link"
import { ArrowLeft, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DocsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">PikaMed API Documentation</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="mb-4">
              All API endpoints require authentication using Firebase Authentication. Include the Firebase ID token in
              the Authorization header:
            </p>
            <div className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-4 relative">
              <code>Authorization: Bearer YOUR_FIREBASE_ID_TOKEN</code>
              <Button variant="ghost" size="icon" className="absolute right-2 top-2">
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy</span>
              </Button>
            </div>
            <p>The API uses role-based access control with the following roles:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>user</strong> - Basic access for patients
              </li>
              <li>
                <strong>doctor</strong> - Access to patient data and management
              </li>
              <li>
                <strong>admin</strong> - Administrative access
              </li>
              <li>
                <strong>superadmin</strong> - Full system access
              </li>
            </ul>
          </div>
        </div>

        <Tabs defaultValue="user" className="mb-8">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="user">User Endpoints</TabsTrigger>
            <TabsTrigger value="doctor">Doctor Endpoints</TabsTrigger>
            <TabsTrigger value="admin">Admin Endpoints</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">User Endpoints</h3>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">GET /user-access</h4>
              <p className="mb-2">Check if the user has basic access to the system.</p>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Response
{
  "access": true
}`}
                </code>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">POST /info</h4>
              <p className="mb-2">Submit user health information and metrics.</p>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Request Body
{
  "name": "John Doe",
  "uid": "user123",
  "photoURL": "https://example.com/photo.jpg",
  "selectedLanguage": "en",
  "targetWater": 2500,
  "availableWater": 1500,
  "cupSize": 250,
  "changeWaterClock": "18:00",
  "changeWaterDay": "Monday",
  "InsulinListData": [...],
  "size": 175,
  "weight": 70,
  "bmiCategory": "Normal",
  "bmi": 22.9,
  "notificationRequest": true
}`}
                </code>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">POST /ai</h4>
              <p className="mb-2">Get AI-powered responses for diabetes management.</p>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Request Body
{
  "uid": "user123",
  "message": "How should I adjust my insulin after exercise?",
  "targetWater": 2500,
  "availableWater": 1500,
  "cupSize": 250,
  "changeWaterDay": "Monday",
  "changeWaterClock": "18:00",
  "weight": 70,
  "size": 175,
  "bmi": 22.9,
  "bmiCategory": "Normal",
  "name": "John Doe",
  "selectedLanguage": "en",
  "localTime": "14:30",
  "insulinPlan": {...}
}`}
                </code>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="doctor" className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Doctor Endpoints</h3>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">GET /doctor-access</h4>
              <p className="mb-2">Check if the user has doctor privileges.</p>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Response
{
  "access": true
}`}
                </code>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">GET /get-users</h4>
              <p className="mb-2">Get a list of all registered users.</p>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Response
{
  "success": true,
  "patients": [
    {
      "email": "patient@example.com",
      "displayName": "Patient Name",
      "uid": "user123"
    },
    ...
  ]
}`}
                </code>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">POST /send-warning</h4>
              <p className="mb-2">Send a notification to a patient when accessing their data.</p>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Request Body
{
  "doktorUid": "doctor123",
  "patientUid": "user123"
}`}
                </code>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Admin Endpoints</h3>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">GET /admin-access</h4>
              <p className="mb-2">Check if the user has admin privileges.</p>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Response
{
  "access": true
}`}
                </code>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">POST /add-doctor</h4>
              <p className="mb-2">Assign doctor role to a user.</p>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Request Body
{
  "uid": "admin123",
  "doctorEmail": "doctor@example.com"
}`}
                </code>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">POST /delete-doctor</h4>
              <p className="mb-2">Remove doctor role from a user.</p>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Request Body
{
  "uid": "admin123",
  "doctorEmail": "doctor@example.com"
}`}
                </code>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">GET /get-doctors</h4>
              <p className="mb-2">Get a list of all users with doctor role.</p>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Response
{
  "success": true,
  "doctors": [
    {
      "email": "doctor@example.com",
      "fullName": "Doctor Name"
    },
    ...
  ]
}`}
                </code>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Notification Endpoints</h3>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">POST /notificationInfo</h4>
              <p className="mb-2">Register for insulin reminder notifications.</p>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Request Body
{
  "uid": "user123",
  "name": "John Doe",
  "email": "patient@example.com",
  "InsulinListData": [
    {
      "hour": 8,
      "minute": 0,
      "titleTxt": "Morning Insulin"
    },
    {
      "hour": 20,
      "minute": 0,
      "titleTxt": "Evening Insulin"
    }
  ],
  "notificationRequest": true
}`}
                </code>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">GET /unsubscribe</h4>
              <p className="mb-2">Unsubscribe from insulin reminder notifications.</p>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Query Parameters
?uid=user123`}
                </code>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">POST /send-notification</h4>
              <p className="mb-2">Send custom notifications to users (admin only).</p>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Request Body
{
  "message": "Important update about your insulin plan",
  "target": "all", // "all", "doctor", "user", or "specific"
  "targetId": "user123", // Only required if target is "specific"
  "senderUid": "admin123",
  "title": "Insulin Plan Update"
}`}
                </code>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
