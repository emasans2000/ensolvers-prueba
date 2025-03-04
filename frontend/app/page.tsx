"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotesList } from "@/components/notes-list"
import { CreateNoteButton } from "@/components/create-note-button"

export default function Home() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Notes</h1>
        <CreateNoteButton />
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Notes</TabsTrigger>
          <TabsTrigger value="archived">Archived Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <NotesList endpoint="active" />
        </TabsContent>
        <TabsContent value="archived">
          <NotesList endpoint="archived" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

