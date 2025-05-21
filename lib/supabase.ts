import { createClient } from "@supabase/supabase-js"

// Define database schema types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          id: string
          title: string
          content: string
          severity: "critical" | "warning" | "info"
          timestamp: string
          camera_id: string
          thread_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          severity: "critical" | "warning" | "info"
          timestamp: string
          camera_id: string
          thread_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          severity?: "critical" | "warning" | "info"
          timestamp?: string
          camera_id?: string
          thread_id?: string | null
          created_at?: string
        }
      }
      threads: {
        Row: {
          id: string
          title: string
          content: string
          severity: "info" | "low" | "medium" | "high"
          timestamp: string
          camera_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          severity: "info" | "low" | "medium" | "high"
          timestamp: string
          camera_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          severity?: "info" | "low" | "medium" | "high"
          timestamp?: string
          camera_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Helper functions for working with activities
export const activitiesService = {
  async getActivitiesByCameraId(cameraId: string, limit = 20) {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("camera_id", cameraId)
      .order("timestamp", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching activities:", error)
      return []
    }

    return data
  },

  async getAllActivities(limit = 100, filterThreadsOnly = false) {
    let query = supabase
      .from("activities")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(limit)
    
    // If we only want activities with threads
    if (filterThreadsOnly) {
      query = query.not('thread_id', 'is', null)
    }

    const { data, error } = await query
    
    if (error) {
      console.error("Error fetching all activities:", error)
      return []
    }

    return data
  },

  async saveActivity(activity: {
    title: string
    content: string
    severity: "critical" | "warning" | "info"
    timestamp: string
    camera_id: string
    thread_id?: string | null
  }) {
    try {
      const { data, error } = await supabase.from("activities").insert([activity]).select()

      if (error) {
        console.error("Error saving activity:", error)
        throw error
      }

      return data?.[0] || null
    } catch (error) {
      console.error("Exception saving activity:", error)
      return null
    }
  },
}

// Helper functions for working with threads
export const threadsService = {
  async getThreadsByCameraId(cameraId: string, limit = 20) {
    const { data, error } = await supabase
      .from("threads")
      .select("*")
      .eq("camera_id", cameraId)
      .order("timestamp", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching threads:", error)
      return []
    }

    return data
  },

  async getThreadById(threadId: string) {
    console.log(`Fetching thread with ID: ${threadId}`);
    
    try {
      const { data, error } = await supabase
        .from("threads")
        .select("*")
        .eq("id", threadId)
        .limit(1);
        
      if (error) {
        console.error("Error fetching thread by ID:", error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (exception) {
      console.error("Exception in getThreadById:", exception);
      return { data: null, error: exception };
    }
  },

  async getAllThreads(limit = 100) {
    // Fetch all threads directly
    console.log("Starting to fetch all threads from database");
    try {
      const { data, error } = await supabase
        .from("threads")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(limit)
      
      if (error) {
        console.error("Error fetching all threads:", error)
        return []
      }
      
      console.log(`Found ${data?.length || 0} threads in the database`);
      if (data && data.length > 0) {
        console.log("First thread sample:", JSON.stringify(data[0], null, 2));
      } else {
        console.log("No threads found in database - check if threads table has data");
      }
      
      return data || []
    } catch (exception) {
      console.error("Exception in getAllThreads:", exception);
      return [];
    }
  },

  async getActivitiesWithThreads(limit = 100) {
    // Explicitly query for activities that have a non-null thread_id
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .neq("thread_id", null)  // Use neq instead of not-is for better compatibility
      .order("timestamp", { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error("Error fetching activities with threads:", error)
      return []
    }
    
    console.log(`Found ${data?.length || 0} activities with threads`)
    return data || []
  },

  async saveThread(thread: {
    title: string
    content: string
    severity: "info" | "low" | "medium" | "high"
    timestamp: string
    camera_id: string
  }) {
    try {
      const { data, error } = await supabase.from("threads").insert([thread]).select()

      if (error) {
        console.error("Error saving thread:", error)
        throw error
      }

      return data?.[0] || null
    } catch (error) {
      console.error("Exception saving thread:", error)
      return null
    }
  },
}
