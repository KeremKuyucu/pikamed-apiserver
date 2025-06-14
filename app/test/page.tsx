"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TestPage() {
  const [token, setToken] = useState("")
  const [endpoint, setEndpoint] = useState("/user-access")
  const [method, setMethod] = useState("GET")
  const [requestBody, setRequestBody] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResponse("")

    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }

      if (method !== "GET" && requestBody) {
        try {
          options.body = requestBody
        } catch (error) {
          setResponse("Invalid JSON in request body")
          setLoading(false)
          return
        }
      }

      const baseUrl = "https://api.pikamed.com" // Replace with your actual API URL
      const response = await fetch(`${baseUrl}${endpoint}`, options)
      const data = await response.json()

      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

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
        <h1 className="text-3xl font-bold mb-6">Test PikaMed API</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>API Request</CardTitle>
              <CardDescription>Configure your API request parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Firebase ID Token</Label>
                  <Input
                    id="token"
                    placeholder="Enter your Firebase ID token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="method">Method</Label>
                    <Select value={method} onValueChange={setMethod}>
                      <SelectTrigger id="method">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endpoint">Endpoint</Label>
                    <Select value={endpoint} onValueChange={setEndpoint}>
                      <SelectTrigger id="endpoint">
                        <SelectValue placeholder="Select endpoint" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="/user-access">User Access</SelectItem>
                        <SelectItem value="/doctor-access">Doctor Access</SelectItem>
                        <SelectItem value="/admin-access">Admin Access</SelectItem>
                        <SelectItem value="/info">Submit Info</SelectItem>
                        <SelectItem value="/ai">AI Response</SelectItem>
                        <SelectItem value="/get-users">Get Users</SelectItem>
                        <SelectItem value="/get-doctors">Get Doctors</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {method !== "GET" && (
                  <div className="space-y-2">
                    <Label htmlFor="requestBody">Request Body (JSON)</Label>
                    <Textarea
                      id="requestBody"
                      placeholder="Enter request body as JSON"
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="min-h-[200px] font-mono"
                    />
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send Request"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Response</CardTitle>
              <CardDescription>View the response from the API</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto min-h-[300px] max-h-[500px] font-mono text-sm">
                {response || "Response will appear here..."}
              </pre>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Example Requests</h2>

          <Tabs defaultValue="user-info">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="user-info">User Info</TabsTrigger>
              <TabsTrigger value="ai-request">AI Request</TabsTrigger>
              <TabsTrigger value="notification">Notification</TabsTrigger>
            </TabsList>

            <TabsContent value="user-info" className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-2">POST /info Example</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto font-mono text-sm">
                {`{
  "name": "John Doe",
  "uid": "user123",
  "photoURL": "https://example.com/photo.jpg",
  "version": "1.0.0",
  "country": "Turkey",
  "selectedLanguage": "en",
  "targetWater": 2500,
  "availableWater": 1500,
  "cupSize": 250,
  "changeWaterClock": "18:00",
  "changeWaterDay": "Monday",
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
  "size": 175,
  "weight": 70,
  "changeWeightClock": "08:00",
  "bmiCategory": "Normal",
  "bmi": 22.9,
  "notificationRequest": true
}`}
              </pre>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setEndpoint("/info")
                  setMethod("POST")
                  setRequestBody(`{
  "name": "John Doe",
  "uid": "user123",
  "photoURL": "https://example.com/photo.jpg",
  "version": "1.0.0",
  "country": "Turkey",
  "selectedLanguage": "en",
  "targetWater": 2500,
  "availableWater": 1500,
  "cupSize": 250,
  "changeWaterClock": "18:00",
  "changeWaterDay": "Monday",
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
  "size": 175,
  "weight": 70,
  "changeWeightClock": "08:00",
  "bmiCategory": "Normal",
  "bmi": 22.9,
  "notificationRequest": true
}`)
                }}
              >
                Use This Example
              </Button>
            </TabsContent>

            <TabsContent value="ai-request" className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-2">POST /ai Example</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto font-mono text-sm">
                {`{
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
  "insulinPlan": {
    "morning": {
      "time": "08:00",
      "units": 10
    },
    "evening": {
      "time": "20:00",
      "units": 8
    }
  }
}`}
              </pre>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setEndpoint("/ai")
                  setMethod("POST")
                  setRequestBody(`{
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
  "insulinPlan": {
    "morning": {
      "time": "08:00",
      "units": 10
    },
    "evening": {
      "time": "20:00",
      "units": 8
    }
  }
}`)
                }}
              >
                Use This Example
              </Button>
            </TabsContent>

            <TabsContent value="notification" className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-2">POST /notificationInfo Example</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto font-mono text-sm">
                {`{
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
              </pre>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setEndpoint("/notificationInfo")
                  setMethod("POST")
                  setRequestBody(`{
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
}`)
                }}
              >
                Use This Example
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
