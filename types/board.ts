export interface BoardItem {
  id: string            // uuid / hex / slug
  title: string
  description?: string
  coverPinId?: string   // for preview image
  createdAt?: string
  updatedAt?: string
  // relationships
  pinIds: (string | number)[]
}
