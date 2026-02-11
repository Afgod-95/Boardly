export interface BoardItem {
  id: string            // uuid / hex / slug
  title: string
  description?: string
  coverPinId?: string   // for preview image
  createdAt?: string
  updatedAt?: string
  // relationships
  pinIds: (string | number)[]
  collaboratorId?: (string | number)[]
  createdByUser?: boolean
}


export type BoardsSortBy = "A-Z" | "CUSTOM" | "LAST_ADDED";

export type PinsFilterView = 'favorites' | 'created' | null
export type BoardsFilterView = 'group' | 'all' | null
export type CollagesFilterView = 'published' | 'draft' | null
