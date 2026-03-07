import React, { useState } from 'react'
import { DialogScrollableContent } from '../../shared/dialogs/DialogsScrollableContent'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import { Users, Pencil, AlignLeft, Plus, Check, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '../../ui/avatar'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { createBoard } from '@/redux/boardSlice'
import { BoardItem } from '@/types/board'
import { toast } from 'sonner'

const SUGGESTIONS = [
  { id: 1, name: 'Alex Rivera', email: 'alex@example.com', initials: 'AR' },
  { id: 2, name: 'Sarah Chen', email: 'sarah.c@design.com', initials: 'SC' },
]

const CreateBoardModal = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    collaborators: ''
  })
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleCollaborator = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    // Validate
    if (!formData.title.trim()) {
      setError('Board title is required')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      // Simulate async (replace with real API call when backend is ready)
      await new Promise(res => setTimeout(res, 800))

      const newBoard: BoardItem = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pinIds: [],
        collaboratorId: selectedIds,
        createdByUser: true,
      }

      dispatch(createBoard(newBoard))
      setTimeout(() => {
        setFormData({ title: '', description: '', collaborators: '' })
        setSelectedIds([])
      }, 2000) // close after 2 second
      onClose()
      toast.success(`Board "${newBoard.title}" created!`)

      // Reset form
      setFormData({ title: '', description: '', collaborators: '' })
      setSelectedIds([])
    } catch (err) {
      toast.error('Failed to create board. Please try again.')
      console.error('Create board error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DialogScrollableContent
      dialogTitle='Create Board'
      isActionButton={true}
      buttonTitle={
        isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Creating…
          </span>
        ) : 'Create Board'
      }
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
    >
      <div className="space-y-6 py-4">

        {/* Board Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-2">
            <Pencil size={16} className="text-muted-foreground" />
            Board Title
          </Label>
          <Input
            id="title"
            placeholder='e.g., "Architecture Inspiration"'
            className={`rounded-xl border-muted-foreground/20 focus:ring-accent ${error ? 'border-red-400 focus:ring-red-300' : ''}`}
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value })
              if (error) setError(null)
            }}
            disabled={isLoading}
          />
          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
            <AlignLeft size={16} className="text-muted-foreground" />
            Board Description
            <span className="text-muted-foreground/50 font-normal text-xs">(optional)</span>
          </Label>
          <Textarea
            id="description"
            placeholder="What's this board about?"
            className="min-h-20 rounded-xl border-muted-foreground/20 resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={isLoading}
          />
        </div>

        {/* Collaborators */}
        <div className="space-y-3">
          <Label htmlFor="collaborators" className="text-sm font-semibold flex items-center gap-2">
            <Users size={16} className="text-muted-foreground" />
            Add Collaborators
            <span className="text-muted-foreground/50 font-normal text-xs">(optional)</span>
          </Label>
          <div className="relative">
            <Input
              id="collaborators"
              placeholder="Search by name or email"
              className="rounded-xl border-muted-foreground/20 pl-10 h-11"
              value={formData.collaborators}
              onChange={(e) => setFormData({ ...formData, collaborators: e.target.value })}
              disabled={isLoading}
            />
            <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
          </div>

          {/* Suggested Users */}
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground/70 px-1">Suggested</p>
            <div className="grid grid-cols-1 gap-2">
              {SUGGESTIONS
                .filter(u =>
                  !formData.collaborators ||
                  u.name.toLowerCase().includes(formData.collaborators.toLowerCase()) ||
                  u.email.toLowerCase().includes(formData.collaborators.toLowerCase())
                )
                .map((user) => {
                  const isSelected = selectedIds.includes(user.id)
                  return (
                    <button
                      key={user.id}
                      onClick={() => toggleCollaborator(user.id)}
                      disabled={isLoading}
                      className={`flex items-center justify-between p-2 rounded-xl border transition-all disabled:opacity-50 ${
                        isSelected
                          ? 'bg-accent/10 border-accent'
                          : 'bg-muted/30 border-transparent hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-background">
                          <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">
                            {user.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className={`p-1 rounded-full transition-colors ${
                        isSelected
                          ? 'bg-violet-600 text-white'
                          : 'bg-muted-foreground/20 text-muted-foreground'
                      }`}>
                        {isSelected ? <Check size={14} /> : <Plus size={14} />}
                      </div>
                    </button>
                  )
                })}
            </div>
          </div>
        </div>

      </div>
    </DialogScrollableContent>
  )
}

export default CreateBoardModal