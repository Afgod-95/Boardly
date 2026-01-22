import { useRef, useState } from 'react'
import { Upload, X, Image, Video } from 'lucide-react'

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
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (file: File) => {
    if (file.type.startsWith('image/')) {
      setMediaType('image')
      onImageChange(URL.createObjectURL(file))
    } else if (file.type.startsWith('video/') && onVideoChange) {
      setMediaType('video')
      onVideoChange(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(file)
  }

  const handleRemove = () => {
    setMediaType(null)
    onRemove()
  }

  const hasMedia = imageValue || videoValue

  return (
    <div className="flex flex-col gap-4">
      {!hasMedia ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl h-96 flex flex-col items-center justify-center cursor-pointer transition ${
            isDragging
              ? 'border-red-600 bg-red-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}
        >
          <div className="flex flex-col items-center gap-4 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <Upload size={32} className="text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-lg mb-1">
                {isDragging ? 'Drop your file here' : 'Choose a file or drag and drop'}
              </p>
              <p className="text-sm text-gray-500">
                We recommend using high-quality .jpg files or .mp4 videos less than 20MB
              </p>
            </div>

            {/* Media Type Indicators */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Image size={16} />
                <span>Images</span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Video size={16} />
                <span>Videos</span>
              </div>
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
        <div className="relative rounded-2xl overflow-hidden group">
          {mediaType === 'image' && imageValue ? (
            <img
              src={imageValue}
              alt="preview"
              className="w-full h-96 object-cover"
            />
          ) : mediaType === 'video' && videoValue ? (
            <video
              src={videoValue}
              controls
              className="w-full h-96 object-cover"
            />
          ) : null}
          
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>

          {/* Media Type Badge */}
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
            {mediaType === 'image' ? <Image size={14} /> : <Video size={14} />}
            {mediaType === 'image' ? 'Image' : 'Video'}
          </div>
        </div>
      )}
    </div>
  )
}

export default PinMediaUpload