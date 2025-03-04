"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"
import type { TagsModel } from "@/types"

interface TagInputProps {
  tags: TagsModel[]
  onAddTag: (tag: TagsModel) => void
  onRemoveTag: (tagId: number) => void
  suggestions?: string[]
}

export function TagInput({ tags, onAddTag, onRemoveTag, suggestions = [] }: TagInputProps) {
  const [newTagName, setNewTagName] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleAddTag = () => {
    if (!newTagName.trim()) return

    onAddTag({ name: newTagName.trim() })
    setNewTagName("")
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(newTagName.toLowerCase()) &&
      !tags.some((tag) => tag.name.toLowerCase() === suggestion.toLowerCase()),
  )

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
            {tag.name}
            <button
              onClick={(e) => {
                e.preventDefault()
                onRemoveTag(tag.id!)
              }}
              className="rounded-full hover:bg-muted p-0.5"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag.name} tag</span>
            </button>
          </Badge>
        ))}
      </div>

      <div className="relative">
        <div className="flex gap-2">
          <Input
            value={newTagName}
            onChange={(e) => {
              setNewTagName(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking them
              setTimeout(() => setShowSuggestions(false), 200)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Add a tag..."
            className="flex-1"
          />
          <Button type="button" size="sm" variant="outline" onClick={handleAddTag} disabled={!newTagName.trim()}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add tag</span>
          </Button>
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg">
            <ul className="py-1">
              {filteredSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  className="px-3 py-2 hover:bg-muted cursor-pointer"
                  onClick={() => {
                    onAddTag({ name: suggestion })
                    setNewTagName("")
                    setShowSuggestions(false)
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

