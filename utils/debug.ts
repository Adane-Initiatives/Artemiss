/**
 * Debug utility for logging in development environments
 */
export const debug = {
    log: (message: string, data?: any) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[DEBUG] ${message}`, data || "")
      }
    },
  
    error: (message: string, error?: any) => {
      if (process.env.NODE_ENV !== "production") {
        console.error(`[ERROR] ${message}`, error || "")
  
        // Log additional details if available
        if (error?.message) {
          console.error(`Error message: ${error.message}`)
        }
  
        if (error?.stack) {
          console.error(`Stack trace: ${error.stack}`)
        }
      }
    },
  
    warn: (message: string, data?: any) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[WARN] ${message}`, data || "")
      }
    },
  
    info: (message: string, data?: any) => {
      if (process.env.NODE_ENV !== "production") {
        console.info(`[INFO] ${message}`, data || "")
      }
    },
  }
  