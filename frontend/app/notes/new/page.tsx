"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { apiClient } from "@/lib/api-client"

export default function NewNotePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Title is required")
      return
    }

    setSaving(true)
    try {
      const newNote = await apiClient.createNote({
        title,
        content,
        isDeleted: false,
        isComplete: false,
      })

      router.push(`/notes/${newNote.id}`)
    } catch (error) {
      console.error("Error creating note:", error)
      alert("Failed to create note. Please try again.")
      setSaving(false)
    }
  }

  return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notes
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create New Note</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-medium"
                    placeholder="Note Title"
                />
              </div>
              <div>
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] resize-none"
                    placeholder="Write your note here..."
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSave} disabled={saving || !title.trim()}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Note
            </Button>
          </CardFooter>
        </Card>
      </div>
  )
}

