import type { NotesModel, TagsModel } from "@/types"

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5140"
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("API returned non-JSON response")
    }

    return response.json()
  }

  // Notes endpoints
  async getAllNotes(): Promise<NotesModel[]> {
    return this.fetch<NotesModel[]>("/api/Notes")
  }

  async getActiveNotes(): Promise<NotesModel[]> {
    return this.fetch<NotesModel[]>("/api/Notes/active")
  }

  async getArchivedNotes(): Promise<NotesModel[]> {
    return this.fetch<NotesModel[]>("/api/Notes/archived")
  }

  async getNoteById(id: number): Promise<NotesModel> {
    return this.fetch<NotesModel>(`/api/Notes/${id}`)
  }

  async createNote(note: Partial<NotesModel>): Promise<NotesModel> {
    return this.fetch<NotesModel>("/api/Notes", {
      method: "POST",
      body: JSON.stringify(note),
    })
  }

  async updateNote(id: number, note: Partial<NotesModel>): Promise<void> {
    await this.fetch(`/api/Notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(note),
    })
  }

  async deleteNote(id: number): Promise<void> {
    await this.fetch(`/api/Notes/${id}`, {
      method: "DELETE",
    })
  }

  async archiveNote(id: number): Promise<void> {
    await this.fetch(`/api/Notes/${id}/archive`, {
      method: "PUT",
    })
  }

  async unarchiveNote(id: number): Promise<void> {
    await this.fetch(`/api/Notes/${id}/unarchive`, {
      method: "PUT",
    })
  }

  // Tags endpoints
  async addTagToNote(noteId: number, tag: TagsModel): Promise<void> {
    await this.fetch(`/api/Notes/${noteId}/tags`, {
      method: "POST",
      body: JSON.stringify(tag),
    })
  }

  async removeTagFromNote(noteId: number, tagId: number): Promise<void> {
    await this.fetch(`/api/Notes/${noteId}/tags/${tagId}`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient()

