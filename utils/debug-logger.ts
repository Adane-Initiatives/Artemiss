// Simple utility to help with debugging
export const debugLogger = {
    log: (message: string, data?: any) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[DEBUG] ${message}`, data || "")
      }
    },
  
    error: (message: string, error?: any) => {
      if (process.env.NODE_ENV !== "production") {
        console.error(`[ERROR] ${message}`, error || "")
      }
    },
  }
  