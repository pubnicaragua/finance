"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { addQaIssue, resolveQaIssue } from "@/actions/qa-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface QaIssue {
  id: string
  feature: string
  description: string
  status: "open" | "resolved"
  created_at: string
  resolved_at: string | null
}

export default function QaStatusPage() {
  const [qaIssues, setQaIssues] = useState<QaIssue[]>([])
  const [feature, setFeature] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchQaIssues = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/get-qa-issues")
      if (!response.ok) {
        throw new Error("Failed to fetch QA issues")
      }
      const data = await response.json()
      setQaIssues(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load QA issues.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQaIssues()
  }, [])

  const handleAddIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("feature", feature)
    formData.append("description", description)

    const result = await addQaIssue(formData)
    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
      setFeature("")
      setDescription("")
      fetchQaIssues() // Re-fetch issues to update the list
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const handleResolveIssue = async (id: string) => {
    const result = await resolveQaIssue(id)
    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
      fetchQaIssues() // Re-fetch issues to update the list
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">QA Status Page</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor and track software quality assurance issues.</p>
      </header>

      <main className="flex-1 grid gap-8 lg:grid-cols-2">
        <Card className="col-span-full lg:col-span-1">
          <CardHeader>
            <CardTitle>Add New QA Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddIssue} className="space-y-4">
              <div>
                <label htmlFor="feature" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Feature/Module
                </label>
                <Input
                  id="feature"
                  value={feature}
                  onChange={(e) => setFeature(e.target.value)}
                  placeholder="e.g., Client Dashboard, Transaction Form"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail."
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Issue
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-1">
          <CardHeader>
            <CardTitle>Current QA Issues</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">Loading issues...</div>
            ) : qaIssues.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">No QA issues found.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Resolved At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {qaIssues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className="font-medium">{issue.feature}</TableCell>
                        <TableCell>{issue.description}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              issue.status === "open"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            }`}
                          >
                            {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{format(new Date(issue.created_at), "MMM dd, yyyy HH:mm")}</TableCell>
                        <TableCell>
                          {issue.resolved_at ? format(new Date(issue.resolved_at), "MMM dd, yyyy HH:mm") : "N/A"}
                        </TableCell>
                        <TableCell>
                          {issue.status === "open" && (
                            <Button variant="outline" size="sm" onClick={() => handleResolveIssue(issue.id)}>
                              Resolve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
