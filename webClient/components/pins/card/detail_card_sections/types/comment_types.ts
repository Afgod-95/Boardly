// ─── Comment types ────────────────────────────────────────────────────────────

export interface CommentAuthor {
    id: string
    name: string
    avatar?: string
    profileUrl?: string
}

export interface Comment {
    id: string
    author: CommentAuthor
    body: string
    createdAt: Date
    likes: number
    likedByMe: boolean
    replies: Comment[]
}