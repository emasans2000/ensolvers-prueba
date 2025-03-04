export interface NotesModel {
  id: number
  title: string
  content: string | null
  isDeleted: boolean
  isComplete: boolean
  tags: TagsModel[] | null
  createdAt: string
  updatedAt: string
}

export interface TagsModel {
  id?: number
  name: string
}

