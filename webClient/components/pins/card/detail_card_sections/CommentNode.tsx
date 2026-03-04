
'use client'
import { useState } from "react"
import { CURRENT_USER } from "./seed_data/seed_data"
import { Comment } from "./types/comment_types"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Heart, Reply, Trash2 , Pencil, Send, X, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import clsx from "clsx"

import { formatTime } from "@/helpers/formatTime"

// ─── CommentNode ──────────────────────────────────────────────────────────────

interface CommentNodeProps {
    comment: Comment
    depth: number
    onLike: (id: string) => void
    onDelete: (id: string) => void
    onEdit: (id: string, body: string) => void
    onReply: (parentId: string, body: string) => void
}

export const CommentNode = ({ comment, depth, onLike, onDelete, onEdit, onReply }: CommentNodeProps) => {
    const [replyOpen, setReplyOpen] = useState(false)
    const [replyText, setReplyText] = useState("")
    const [editing, setEditing] = useState(false)
    const [editText, setEditText] = useState(comment.body)
    const [collapsed, setCollapsed] = useState(false)
    const isOwn = comment.author.id === CURRENT_USER.id
    const hasReplies = comment.replies.length > 0

    const submitReply = () => {
        if (!replyText.trim()) return
        onReply(comment.id, replyText.trim())
        setReplyText("")
        setReplyOpen(false)
    }

    const submitEdit = () => {
        if (!editText.trim()) return
        onEdit(comment.id, editText.trim())
        setEditing(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -12, transition: { duration: 0.15 } }}
            className="group"
        >
            <div className="flex gap-2.5">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-0 shrink-0">
                    {comment.author.profileUrl ? (
                        <Link href={comment.author.profileUrl}>
                            <Avatar className="w-8 h-8 ring-2 ring-transparent hover:ring-violet-500 transition-all">
                                <AvatarImage src={comment.author.avatar} />
                                <AvatarFallback className="text-xs">{comment.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Link>
                    ) : (
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback className="text-xs">{comment.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    )}
                    {/* Thread line */}
                    {hasReplies && !collapsed && (
                        <button
                            onClick={() => setCollapsed(true)}
                            className="w-px flex-1 mt-1 bg-border hover:bg-violet-400 transition-colors min-h-4 cursor-pointer"
                        />
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0 pb-3">
                    {/* Author + time */}
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                        {comment.author.profileUrl ? (
                            <Link href={comment.author.profileUrl}
                                className="text-sm font-semibold hover:underline leading-none">
                                {comment.author.name}
                            </Link>
                        ) : (
                            <span className="text-sm font-semibold leading-none">{comment.author.name}</span>
                        )}
                        <span className="text-[11px] text-muted-foreground tabular-nums">{formatTime(comment.createdAt)}</span>
                    </div>

                    {/* Text / edit mode */}
                    {editing ? (
                        <div className="mt-1.5 flex flex-col gap-2">
                            <textarea
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitEdit() } if (e.key === "Escape") setEditing(false) }}
                                autoFocus
                                rows={2}
                                className="w-full resize-none rounded-xl border bg-muted/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                            />
                            <div className="flex items-center gap-2">
                                <button onClick={submitEdit}
                                    className="px-3 py-1 rounded-lg bg-violet-600 text-white text-xs font-medium hover:bg-violet-700 transition-colors">
                                    Save
                                </button>
                                <button onClick={() => { setEditing(false); setEditText(comment.body) }}
                                    className="px-3 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:bg-accent transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm mt-1 leading-relaxed text-foreground/90">{comment.body}</p>
                    )}

                    {/* Actions row */}
                    {!editing && (
                        <div className="flex items-center gap-3 mt-1.5">
                            {/* Like */}
                            <button
                                onClick={() => onLike(comment.id)}
                                className={clsx(
                                    "flex items-center gap-1 text-xs font-medium transition-colors",
                                    comment.likedByMe ? "text-rose-500" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <motion.div whileTap={{ scale: 1.4 }} transition={{ type: "spring", stiffness: 600, damping: 15 }}>
                                    <Heart size={13} className={comment.likedByMe ? "fill-rose-500" : ""} />
                                </motion.div>
                                {comment.likes > 0 && <span>{comment.likes}</span>}
                            </button>

                            {/* Reply — only allow nesting up to depth 2 */}
                            {depth < 3 && (
                                <button
                                    onClick={() => setReplyOpen(o => !o)}
                                    className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Reply size={13} />
                                    Reply
                                </button>
                            )}

                            {/* Own comment actions */}
                            {isOwn && (
                                <>
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Pencil size={12} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(comment.id)}
                                        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Reply input */}
                    <AnimatePresence>
                        {replyOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mt-2 p-3"
                            >
                                <div className="flex gap-2 items-start">
                                    <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                                        <AvatarImage src={CURRENT_USER.avatar} />
                                        <AvatarFallback className="text-[10px]">
                                            {CURRENT_USER.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 flex items-center gap-2 rounded-2xl border bg-muted/40 px-3 py-2 focus-within:ring-2 focus-within:ring-violet-500 transition-all">
                                        <input
                                            autoFocus
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                            onKeyDown={e => { if (e.key === "Enter") submitReply(); if (e.key === "Escape") setReplyOpen(false) }}
                                            placeholder={`Reply to ${comment.author.name}…`}
                                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                                        />
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button onClick={() => setReplyOpen(false)}
                                                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                                                <X size={13} />
                                            </button>
                                            <button onClick={submitReply} disabled={!replyText.trim()}
                                                className="p-1 rounded-lg text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900/40 disabled:opacity-30 transition-colors">
                                                <Send size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Nested replies */}
            <AnimatePresence>
                {hasReplies && (
                    collapsed ? (
                        <motion.button
                            key="expand"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setCollapsed(false)}
                            className="ml-10 mb-3 flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                        >
                            <ChevronDown size={13} />
                            {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                        </motion.button>
                    ) : (
                        <motion.div
                            key="replies"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={clsx("ml-5", depth >= 2 && "ml-3")}
                        >
                            <AnimatePresence initial={false}>
                                {comment.replies.map(r => (
                                    <CommentNode
                                        key={r.id}
                                        comment={r}
                                        depth={depth + 1}
                                        onLike={onLike}
                                        onDelete={onDelete}
                                        onEdit={onEdit}
                                        onReply={onReply}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )
                )}
            </AnimatePresence>
        </motion.div>
    )
}