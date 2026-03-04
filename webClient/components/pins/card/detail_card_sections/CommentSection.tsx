// ─── CommentSection ───────────────────────────────────────────────────────────
import { useRef, useState } from "react";
import { Comment } from "./types/comment_types";
import { CURRENT_USER, SEED_COMMENTS } from "./seed_data/seed_data";
import { newId, addReply, likeComment, editComment, deleteComment } from "./helpers/comment.helper";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CommentNode } from "./CommentNode";

interface CommentSectionProps {
    pinId: string | number;
}

export const CommentSection = ({
    pinId
}: CommentSectionProps) => {
    const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS)
    const [newComment, setNewComment] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    const totalCount = (list: Comment[]): number =>
        list.reduce((acc, c) => acc + 1 + totalCount(c.replies), 0)

    const submitComment = () => {
        if (!newComment.trim()) return
        const comment: Comment = {
            id: newId(),
            author: CURRENT_USER,
            body: newComment.trim(),
            createdAt: new Date(),
            likes: 0,
            likedByMe: false,
            replies: [],
        }
        setComments((p) => [comment, ...p])
        setNewComment("")
    }

    const handleReply = (parentId: string, body: string) => {
        const reply: Comment = {
            id: newId(),
            author: CURRENT_USER,
            body,
            createdAt: new Date(),
            likes: 0,
            likedByMe: false,
            replies: [],
        }
        setComments((p) => addReply(p, parentId, reply))
    }

    return (
        <div className="px-5 pb-8 pt-2">
            {/* Section header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold">
                    Comments
                    {totalCount(comments) > 0 && (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            {totalCount(comments)}
                        </span>
                    )}
                </h3>
            </div>

            {/* Comment list */}
            <div className="space-y-0.5 mb-6">
                {comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No comments yet — be the first!
                    </p>
                ) : (
                    <AnimatePresence initial={false}>
                        {comments.map(c => (
                            <CommentNode
                                key={c.id}
                                comment={c}
                                depth={0}
                                onLike={id => setComments((p) => likeComment(p, id))}
                                onDelete={id => setComments((p) => deleteComment(p, id))}
                                onEdit={(id, body) => setComments((p) => editComment(p, id, body))}
                                onReply={handleReply}
                            />
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* New comment input */}
            <div className="flex gap-3 items-start">
                <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                    <AvatarImage src={CURRENT_USER.avatar} />
                    <AvatarFallback className="text-xs">
                        {CURRENT_USER.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center gap-2 rounded-2xl border bg-muted/40 px-4 py-2.5 focus-within:ring-2 focus-within:ring-violet-500 transition-all">
                    <input
                        ref={inputRef}
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") submitComment() }}
                        placeholder="Add a comment…"
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                    />
                    <AnimatePresence>
                        {newComment.trim() && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={submitComment}
                                className="shrink-0 p-1.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                            >
                                <Send size={13} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}