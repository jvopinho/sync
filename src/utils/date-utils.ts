export const dateISO = (timestamp: string | number | Date = new Date()) => {
  if(!(timestamp instanceof Date)) {
    timestamp = new Date(timestamp)
  }

  return timestamp.toISOString()
}