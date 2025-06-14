import type React from "react"
import Link from "next/link"
import { ArrowRight, Shield, Stethoscope, User, MessageSquare, Bell, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-purple-700 to-purple-900 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">PikaMed API</h1>
            <p className="text-lg text-purple-100 max-w-2xl mb-8">
              A comprehensive healthcare API for diabetes management with insulin tracking, notifications, and
              doctor-patient communication
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-purple-100">
                <Link href="/docs">
                  API Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/test">
                  Test API
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto">
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-purple-600" />}
                title="Role-Based Authentication"
                description="Secure endpoints with different access levels for superadmins, admins, doctors, and patients"
              />
              <FeatureCard
                icon={<Stethoscope className="h-10 w-10 text-purple-600" />}
                title="Doctor-Patient Management"
                description="Assign doctors to patients and manage healthcare relationships securely"
              />
              <FeatureCard
                icon={<MessageSquare className="h-10 w-10 text-purple-600" />}
                title="AI Integration"
                description="Gemini API integration for intelligent responses to patient queries about diabetes management"
              />
              <FeatureCard
                icon={<Bell className="h-10 w-10 text-purple-600" />}
                title="Notification System"
                description="Email notifications for insulin reminders with customizable schedules"
              />
              <FeatureCard
                icon={<Database className="h-10 w-10 text-purple-600" />}
                title="Data Management"
                description="Store and retrieve patient data including insulin plans, water intake, and health metrics"
              />
              <FeatureCard
                icon={<User className="h-10 w-10 text-purple-600" />}
                title="User Management"
                description="Comprehensive user management with role assignment and access control"
              />
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Getting Started</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Authentication</h3>
              <p className="mb-4">All API requests require a valid Firebase authentication token:</p>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
                <code>
                  {`// Example request with authentication
fetch('https://api.pikamed.com/user-access', {
  headers: {
    'Authorization': 'Bearer YOUR_FIREBASE_ID_TOKEN'
  }
})`}
                </code>
              </pre>

              <h3 className="text-xl font-semibold mb-4">Basic Endpoints</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>
                  <code>/user-access</code> - Check if user has basic access
                </li>
                <li>
                  <code>/doctor-access</code> - Check if user has doctor privileges
                </li>
                <li>
                  <code>/admin-access</code> - Check if user has admin privileges
                </li>
                <li>
                  <code>/info</code> - Submit user health information
                </li>
                <li>
                  <code>/ai</code> - Get AI-powered responses for diabetes management
                </li>
              </ul>

              <div className="flex justify-center">
                <Button asChild>
                  <Link href="/docs">
                    View Full Documentation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 px-4 md:px-6">
        <div className="container mx-auto text-center">
          <p>© 2025 PikaMed API. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        {icon}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
