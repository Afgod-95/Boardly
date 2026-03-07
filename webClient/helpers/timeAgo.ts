export const timeAgoShort = (date: string | number | Date) => {
  const now = new Date()
  const past = new Date(date)

  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  const intervals: [number, string][] = [
    [604800, "w"], // week
    [86400, "d"],  // day
    [3600, "h"],   // hour
    [60, "m"],     // minute
    [1, "s"]
  ]

  const weeks = Math.floor(seconds / 604800)

  // if more than 4 weeks show date
  if (weeks > 4) {
    return past.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })
  }

  for (const [sec, label] of intervals) {
    const count = Math.floor(seconds / sec)
    if (count >= 1) return `${count}${label}`
  }

  return "now"
}