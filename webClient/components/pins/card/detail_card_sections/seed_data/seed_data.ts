
import { CommentAuthor, Comment } from "../types/comment_types"

// ─── Seed data ────────────────────────────────────────────────────────────────

export const CURRENT_USER: CommentAuthor = {
    id: "me",
    name: "You",
    avatar: undefined,
    profileUrl: "/dashboard/profile",
}

export const SEED_COMMENTS: Comment[] = [
    {
        id: "c1",
        author: { id: "u1", name: "Zoe Nakamura", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Zoe", profileUrl: "/dashboard/profile/zoe" },
        body: "This lighting is absolutely incredible — what time of day was this taken?",
        createdAt: new Date(Date.now() - 1000 * 60 * 42),
        likes: 8,
        likedByMe: false,
        replies: [
            {
                id: "c1r1",
                author: { id: "u2", name: "Felix Wagner", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Felix", profileUrl: "/dashboard/profile/felix" },
                body: "Golden hour, around 6pm I think. The haze really helped with the atmosphere.",
                createdAt: new Date(Date.now() - 1000 * 60 * 30),
                likes: 3,
                likedByMe: true,
                replies: [
                    {
                        id: "c1r1r1",
                        author: { id: "u1", name: "Zoe Nakamura", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Zoe", profileUrl: "/dashboard/profile/zoe" },
                        body: "That haze is everything. Makes it look like a painting 🎨",
                        createdAt: new Date(Date.now() - 1000 * 60 * 18),
                        likes: 1,
                        likedByMe: false,
                        replies: [],
                    },
                ],
            },
        ],
    },
    {
        id: "c2",
        author: { id: "u3", name: "Aneka Osei", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Aneka", profileUrl: "/dashboard/profile/aneka" },
        body: "Saved this to my moodboard immediately. The colour palette here is so good.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
        likes: 14,
        likedByMe: false,
        replies: [],
    },
    {
        id: "c3",
        author: CURRENT_USER,
        body: "One of my favourite shots from last summer ☀️",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        likes: 5,
        likedByMe: false,
        replies: [],
    },
]