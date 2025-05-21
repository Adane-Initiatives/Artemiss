# Serafin - Traffic Monitoring System

Serafin is an AI-powered traffic monitoring system that analyzes camera feeds to detect incidents, monitor traffic conditions, and provide real-time insights.

## Features

- AI-powered traffic camera monitoring
- Automated incident detection and classification
- Thread-based analysis of traffic conditions
- Activity log for critical events
- Chat interface for interacting with camera feeds
- Persistent storage with Supabase

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Google API key with Gemini API access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Dash
```

2. Install dependencies:
```bash
npm install
# If you encounter peer dependency issues, use:
npm install --legacy-peer-deps
```

3. Configure environment variables:
Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key
```

4. Set up Supabase database:
   - Go to your Supabase project SQL Editor
   - Run the SQL schema in `lib/supabase/schema.sql`
   - This will create the necessary tables and indexes

5. Start the development server:
```bash
npm run dev
```

## Database Schema

The application uses two main tables:

### Threads
Stores analysis results from periodic camera snapshots:
- `id`: UUID primary key
- `title`: Analysis title
- `content`: Detailed analysis
- `severity`: Severity level (info/low/medium/high)
- `timestamp`: When the analysis was created
- `camera_id`: Reference to camera
- `created_at`: Record creation timestamp

### Activities
Stores important events requiring attention:
- `id`: UUID primary key
- `title`: Activity title
- `content`: Detailed description
- `severity`: Severity level (info/warning/critical)
- `timestamp`: When the activity was created
- `camera_id`: Reference to camera
- `thread_id`: Optional reference to a thread
- `created_at`: Record creation timestamp

## AI Integration

The application uses Google's Generative AI (Gemini) for analyzing camera feeds:

1. Image Analysis: Periodically captures screenshots from camera feeds and analyzes them to detect traffic conditions and incidents.
2. Chat Interaction: Allows users to ask questions about the current camera view and receive AI-powered responses.

Make sure your Google API key has access to the Gemini API and the appropriate quota to handle your expected usage. 