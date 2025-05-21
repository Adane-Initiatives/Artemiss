-- Create threads table
CREATE TABLE IF NOT EXISTS threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'low', 'medium', 'high')),
  timestamp TIMESTAMPTZ NOT NULL,
  camera_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on camera_id for faster queries
CREATE INDEX IF NOT EXISTS idx_threads_camera_id ON threads (camera_id);
CREATE INDEX IF NOT EXISTS idx_threads_timestamp ON threads (timestamp DESC);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  timestamp TIMESTAMPTZ NOT NULL,
  camera_id TEXT NOT NULL,
  thread_id UUID REFERENCES threads(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for activities
CREATE INDEX IF NOT EXISTS idx_activities_camera_id ON activities (camera_id);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activities_thread_id ON activities (thread_id);

-- Row Level Security Policies
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to threads
CREATE POLICY thread_read_policy ON threads
  FOR SELECT USING (true);

-- Create policy to allow read access to activities
CREATE POLICY activity_read_policy ON activities
  FOR SELECT USING (true);

-- Create policy to allow insert into threads
CREATE POLICY thread_insert_policy ON threads
  FOR INSERT WITH CHECK (true);

-- Create policy to allow insert into activities
CREATE POLICY activity_insert_policy ON activities
  FOR INSERT WITH CHECK (true); 