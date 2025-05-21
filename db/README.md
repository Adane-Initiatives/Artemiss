# Supabase Setup for Camera Monitoring System

This folder contains the database schema and instructions for setting up Supabase to work with the camera monitoring system.

## Setup Instructions

1. **Create a Supabase Project**:
   - Go to [Supabase](https://supabase.com) and sign up or log in
   - Create a new project
   - Note your project URL and anon/public key

2. **Set Environment Variables**:
   - Create or update `.env.local` in your project root with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_GOOGLE_API_KEY=your-gemini-api-key
   ```

3. **Run the Schema SQL**:
   - In the Supabase dashboard, go to SQL Editor
   - Copy and paste the contents of `schema.sql` from this directory
   - Run the SQL to create the necessary tables, indexes, and permissions

4. **Verify Tables**:
   - Go to the Table Editor in Supabase
   - Confirm you can see `threads` and `activities` tables

## Tables

### Threads
Stores AI-generated observations from video analysis.

| Column      | Type      | Description                            |
|-------------|-----------|----------------------------------------|
| id          | UUID      | Primary key                            |
| title       | TEXT      | Short summary of observation           |
| content     | TEXT      | Detailed description                   |
| severity    | TEXT      | One of: info, low, medium, high        |
| timestamp   | TIMESTAMP | When the observation occurred          |
| camera_id   | TEXT      | Camera identifier                      |
| created_at  | TIMESTAMP | When the record was created            |

### Activities
Stores important events that require attention.

| Column      | Type      | Description                            |
|-------------|-----------|----------------------------------------|
| id          | UUID      | Primary key                            |
| title       | TEXT      | Short summary of activity              |
| content     | TEXT      | Detailed description                   |
| severity    | TEXT      | One of: critical, warning, info        |
| timestamp   | TIMESTAMP | When the activity occurred             |
| camera_id   | TEXT      | Camera identifier                      |
| thread_id   | UUID      | Reference to the thread (if from one)  |
| created_at  | TIMESTAMP | When the record was created            |

## Maintenance

- Consider setting up a database retention policy for old records
- Monitor your storage usage if you decide to enable video clip storage
- Review and adjust RLS policies as needed for production use 