// ─── CommentNode ──────────────────────────────────────────────────────────────

export interface CommentNodeProps {
    comment: Comment
    depth: number
    onLike: (id: string) => void
    onDelete: (id: string) => void
    onEdit: (id: string, body: string) => void
    onReply: (parentId: string, body: string) => void
}