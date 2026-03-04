import { Comment } from "../types/comment_types"

// Immutable helpers that operate on a comment tree
export function newId () {
    return Math.random().toString(36).substring(2, 10)
}

export function likeComment(comments: Comment[], id: string): Comment[] {
    return comments.map(c => {
        if (c.id === id) return { ...c, likedByMe: !c.likedByMe, likes: c.likedByMe ? c.likes - 1 : c.likes + 1 }
        return { ...c, replies: likeComment(c.replies, id) }
    })
}

export function deleteComment(comments: Comment[], id: string): Comment[] {
    return comments
        .filter(c => c.id !== id)
        .map(c => ({ ...c, replies: deleteComment(c.replies, id) }))
}

export function editComment(comments: Comment[], id: string, body: string): Comment[] {
    return comments.map(c => {
        if (c.id === id) return { ...c, body }
        return { ...c, replies: editComment(c.replies, id, body) }
    })
}

export function addReply(comments: Comment[], parentId: string, reply: Comment): Comment[] {
    return comments.map(c => {
        if (c.id === parentId) return { ...c, replies: [...c.replies, reply] }
        return { ...c, replies: addReply(c.replies, parentId, reply) }
    })
}