import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Thread schema
export interface ThreadData {
  id?: string
  title: string
  content: string
  severity: string
  timestamp: string
  camera_id: string
}

// Activity schema
export interface ActivityData {
  id?: string
  title: string
  content: string
  severity: string
  timestamp: string
  camera_id: string
  thread_id?: string
}

// Threads service
export const threadsService = {
  async saveThread(threadData: ThreadData) {
    console.log("Saving thread to Supabase:", threadData);
    
    try {
      const { data, error } = await supabase
        .from('threads')
        .insert([threadData])
        .select()

      if (error) {
        console.error('Error saving thread:', error)
        throw error
      }

      console.log("Thread saved successfully:", data?.[0]);
      return data?.[0]
    } catch (error) {
      console.error('Exception saving thread:', error);
      throw error;
    }
  },

  async getThreadsByCameraId(cameraId: string) {
    console.log(`Fetching threads for camera ${cameraId}`);
    
    try {
      const { data, error } = await supabase
        .from('threads')
        .select('*')
        .eq('camera_id', cameraId)
        .order('timestamp', { ascending: false })

      if (error) {
        console.error('Error fetching threads:', error)
        throw error
      }

      console.log(`Retrieved ${data?.length || 0} threads for camera ${cameraId}`);
      return data || []
    } catch (error) {
      console.error('Exception fetching threads:', error);
      return [];
    }
  },

  async getThreadById(id: string) {
    console.log(`Fetching thread with ID ${id}`);
    
    try {
      const { data, error } = await supabase
        .from('threads')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching thread:', error)
        throw error
      }

      console.log("Thread retrieved:", data);
      return data
    } catch (error) {
      console.error('Exception fetching thread:', error);
      throw error;
    }
  }
}

// Activities service
export const activitiesService = {
  async saveActivity(activityData: ActivityData) {
    console.log("Saving activity to Supabase:", activityData);
    
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([activityData])
        .select()

      if (error) {
        console.error('Error saving activity:', error)
        throw error
      }

      console.log("Activity saved successfully:", data?.[0]);
      return data?.[0]
    } catch (error) {
      console.error('Exception saving activity:', error);
      throw error;
    }
  },

  async getAllActivities() {
    console.log("Fetching all activities");
    
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('timestamp', { ascending: false })

      if (error) {
        console.error('Error fetching all activities:', error)
        throw error
      }

      console.log(`Retrieved ${data?.length || 0} total activities`);
      return data || []
    } catch (error) {
      console.error('Exception fetching all activities:', error);
      return [];
    }
  },

  async getActivitiesByCameraId(cameraId: string) {
    console.log(`Fetching activities for camera ${cameraId}`);
    
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('camera_id', cameraId)
        .order('timestamp', { ascending: false })

      if (error) {
        console.error('Error fetching activities:', error)
        throw error
      }

      console.log(`Retrieved ${data?.length || 0} activities for camera ${cameraId}`);
      return data || []
    } catch (error) {
      console.error('Exception fetching activities:', error);
      return [];
    }
  },

  async getActivityById(id: string) {
    console.log(`Fetching activity with ID ${id}`);
    
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching activity:', error)
        throw error
      }

      console.log("Activity retrieved:", data);
      return data
    } catch (error) {
      console.error('Exception fetching activity:', error);
      throw error;
    }
  }
} 