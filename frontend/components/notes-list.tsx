"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Loader2, Search, TagIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { apiClient } from "@/lib/api-client"
import type { NotesModel, TagsModel } from "@/types"

interface NotesListProps {
  endpoint: "active" | "archived" | "all"
  showFilters?: boolean
}

export function NotesList({ endpoint, showFilters = true }: NotesListProps) {
  const [notes, setNotes] = useState<NotesModel[]>([])
  const [filteredNotes, setFilteredNotes] = useState<NotesModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [availableTags, setAvailableTags] = useState<TagsModel[]>([])

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true)
      setError(null)
      try {
        let data: NotesModel[]
        switch (endpoint) {
          case "active":
            data = await apiClient.getActiveNotes()
            break
          case "archived":
            data = await apiClient.getArchivedNotes()
            break
          default:
            data = await apiClient.getAllNotes()
        }

        setNotes(data)
        setFilteredNotes(data)

        const tags = new Set<string>()
        data.forEach((note: NotesModel) => {
          note.tags?.forEach((tag) => {
            tags.add(tag.name)
          })
        })
        setAvailableTags(Array.from(tags).map((name, id) => ({ id, name })))
      } catch (error) {
        console.error("Error fetching notes:", error)
        setError("Failed to load notes. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [endpoint])

  useEffect(() => {
    let filtered = [...notes]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (note) => note.title.toLowerCase().includes(query) || note.content?.toLowerCase().includes(query),
      )
    }

    if (selectedTag && selectedTag !== "all") {
      filtered = filtered.filter((note) => note.tags?.some((tag) => tag.name === selectedTag))
    }

    setFilteredNotes(filtered)
  }, [searchQuery, selectedTag, notes])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <TagIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {availableTags.map((tag) => (
                <SelectItem key={tag.id} value={tag.name}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || selectedTag !== "all" ? "No notes match your filters" : "No notes found"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <Link href={`/notes/${note.id}`} key={note.id}>
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2">{note.title}</CardTitle>
                  <CardDescription>
                    {note.updatedAt && <>Updated {formatDistanceToNow(new Date(note.updatedAt))} ago</>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{note.content || "No content"}</p>
                </CardContent>
                {note.tags && note.tags.length > 0 && (
                  <CardFooter>
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <Badge key={tag.id} variant="secondary">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

