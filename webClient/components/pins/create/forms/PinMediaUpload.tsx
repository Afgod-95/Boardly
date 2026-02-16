import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react'

interface PinMediaUploadProps {
  imageValue: string
  videoValue?: string
  onImageChange: (url: string) => void
  onVideoChange?: (url: string) => void
  onRemove: () => void
}

const PinMediaUpload = ({
  imageValue,
  videoValue,
  onImageChange,
  onVideoChange,
  onRemove
}: PinMediaUploadProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. DERIVE media type from props instead of local state
  // This ensures that when you switch drafts, the UI updates immediately
  const mediaType = videoValue ? 'video' : imageValue ? 'image' : null
  const hasMedia = !!(imageValue || videoValue)

  const handleFileChange = (file: File) => {
    const url = URL.createObjectURL(file)
    if (file.type.startsWith('image/')) {
      onImageChange(url)
    } else if (file.type.startsWith('video/') && onVideoChange) {
      onVideoChange(url)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(file)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {!hasMedia ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-[32px] h-125 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isDragging
              ? 'border-violet-600 bg-violet-50'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
        >
          <div className="flex flex-col items-center gap-6 text-center px-8">
            <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">
              <Upload size={36} />
            </div>
            <div className="space-y-2">
              <p className="font-bold text-xl text-slate-900">
                Select a file to upload
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                We recommend high-quality .jpg or .mp4 files.
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileChange(file)
            }}
          />
        </div>
      ) : (
        <div className="relative rounded-[32px] h-125 w-full overflow-hidden group shadow-2xl/10 bg-slate-100 ring-1 ring-slate-200">
          {mediaType === 'image' && imageValue ? (
            <Image
              src={imageValue}
              alt="Pin preview"
              width={800}
              height={1000}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              // 2. CRITICAL: unoptimized allows blob URLs to render correctly
              unoptimized
            />
          ) : mediaType === 'video' && videoValue ? (
            <video
              src={videoValue}
              controls
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              key={videoValue} // Force re-render when video changes
            />
          ) : null}

          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              className="absolute top-5 right-5 bg-white text-slate-900 rounded-full p-3 shadow-xl transition hover:bg-red-50 hover:text-red-600 active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          <div className="absolute bottom-5 left-5 backdrop-blur-md bg-white/80 text-slate-900 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border border-white/20 pointer-events-none">
            {mediaType === 'image' ? <ImageIcon size={14} /> : <Video size={14} />}
            {mediaType}
          </div>
        </div>
      )}
    </div>
  )
}

export default PinMediaUpload