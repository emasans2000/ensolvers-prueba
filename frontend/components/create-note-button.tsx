"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function CreateNoteButton() {
  const router = useRouter()

  return (
    <Button onClick={() => router.push("/notes/new")}>
      <Plus className="mr-2 h-4 w-4" /> New Note
    </Button>
  )
}

