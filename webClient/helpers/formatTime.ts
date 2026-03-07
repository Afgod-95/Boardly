export function formatTime(iso: string | Date): string {
  const date = new Date(iso)

  if (isNaN(date.getTime())) return ""

  const diff = Math.floor((Date.now() - date.getTime()) / 1000)

  if (diff < 60) return "Just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`

  return `${Math.floor(diff / 86400)}d`
}