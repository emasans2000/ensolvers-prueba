"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TagInput } from "@/components/tag-input"
import { Loader2, ArrowLeft, Archive, Trash, Save, ArchiveRestore } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { apiClient } from "@/lib/api-client"
import type { NotesModel, TagsModel } from "@/types"

export default function NotePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [note, setNote] = useState<NotesModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [tags, setTags] = useState<TagsModel[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const noteData = await apiClient.getNoteById(Number.parseInt(params.id))
        setNote(noteData)
        setTitle(noteData.title)
        setContent(noteData.content || "")
        setIsComplete(noteData.isComplete)
        setTags(noteData.tags || [])

        // Fetch all notes to get available tags
        const allNotes = await apiClient.getAllNotes()
        const uniqueTags = new Set<string>()
        allNotes.forEach((note: NotesModel) => {
          note.tags?.forEach((tag) => {
            uniqueTags.add(tag.name)
          })
        })
        setAvailableTags(Array.from(uniqueTags))
      } catch (error) {
        console.error("Error fetching note:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const handleSave = async () => {
    if (!note) return

    setSaving(true)
    try {
      await apiClient.updateNote(note.id, {
        ...note,
        title,
        content,
        isComplete,
      })

      const updatedNote = await apiClient.getNoteById(note.id)
      setNote(updatedNote)
    } catch (error) {
      console.error("Error updating note:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleArchiveToggle = async () => {
    if (!note) return

    setSaving(true)
    try {
      if (note.isDeleted) {
        await apiClient.unarchiveNote(note.id)
      } else {
        await apiClient.archiveNote(note.id)
      }

      const updatedNote = await apiClient.getNoteById(note.id)
      setNote(updatedNote)
    } catch (error) {
      console.error("Error toggling archive status:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!note || !confirm("Are you sure you want to delete this note?")) return

    setSaving(true)
    try {
      await apiClient.deleteNote(note.id)
      router.push("/")
    } catch (error) {
      console.error("Error deleting note:", error)
      setSaving(false)
    }
  }

  const handleAddTag = async (tag: TagsModel) => {
    if (!note) return

    try {
      await apiClient.addTagToNote(note.id, tag)
      const updatedNote = await apiClient.getNoteById(note.id)
      setNote(updatedNote)
      setTags(updatedNote.tags || [])
    } catch (error) {
      console.error("Error adding tag:", error)
    }
  }

  const handleRemoveTag = async (tagId: number) => {
    if (!note) return

    try {
      await apiClient.removeTagFromNote(note.id, tagId)
      const updatedNote = await apiClient.getNoteById(note.id)
      setNote(updatedNote)
      setTags(updatedNote.tags || [])
    } catch (error) {
      console.error("Error removing tag:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!note) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Note not found</h2>
          <Button onClick={() => router.push("/")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notes
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold border-none p-0 focus-visible:ring-0 h-auto"
              placeholder="Note Title"
            />
            <div className="flex items-center text-sm text-muted-foreground">
              {note.updatedAt && <span>Updated {formatDistanceToNow(new Date(note.updatedAt))} ago</span>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] border-none p-0 focus-visible:ring-0 resize-none"
            placeholder="Write your note here..."
          />

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Tags</h3>
            <TagInput tags={tags} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} suggestions={availableTags} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleArchiveToggle} disabled={saving}>
              {note.isDeleted ? (
                <>
                  <ArchiveRestore className="mr-2 h-4 w-4" /> Unarchive
                </>
              ) : (
                <>
                  <Archive className="mr-2 h-4 w-4" /> Archive
                </>
              )}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

