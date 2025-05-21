# Gemini Structured Output for Camera Monitoring System

This directory contains utilities for interacting with the Gemini AI API, with a focus on generating structured outputs for data consistency and reliability.

## Overview

The Gemini API doesn't directly support the `response_schema` parameter for structured output, so we've implemented a text-based approach that achieves the same result:

1. Define a schema object using our TypeScript types
2. Convert the schema to a text description that's included in the prompt
3. Parse the resulting JSON from the text response

This provides several benefits:
- Predictable, consistent response formats
- Strongly typed data for better type safety
- Simpler implementation that works with all Gemini API versions
- Higher quality responses tailored to your data needs

## Key Files

- `gemini-helpers.ts`: Core utilities for making structured requests to Gemini
- `supabase.ts`: Database client with types for storing AI-generated content

## Using Text-Based Structured Output

The core pattern involves:

1. Define a schema using our TypeScript types
2. Our helper converts this schema to a text description added to your prompt 
3. The AI returns JSON matching the requested format
4. The helper parses and validates the JSON against your expected types

### Example Usage

```typescript
// Import the helper function
import { generateStructuredContent, SchemaType } from './gemini-helpers';

// Define a schema for the data you want
const schema = {
  type: SchemaType.OBJECT,
  properties: {
    title: {
      type: SchemaType.STRING,
      description: "A short title for the analysis"
    },
    points: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING
      },
      description: "Key points from the analysis"
    }
  }
};

// Make the API call with your schema
const result = await generateStructuredContent({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  prompt: "Analyze this text and provide key points...",
  schema
});

// Use the strongly-typed result
console.log(result.title);
result.points.forEach(point => console.log(`- ${point}`));
```

## Media Analysis

The helpers support analyzing different media types:

1. **Image Analysis**:
   ```typescript
   const analysis = await generateStructuredContent({
     apiKey,
     prompt: "Describe what's in this image",
     mediaData: base64ImageData,
     mediaType: "image/jpeg",
     schema: imageSchema
   });
   ```

2. **Video Analysis**:
   ```typescript
   const analysis = await analyzeTrafficVideo(
     apiKey,
     "Analyze this traffic footage",
     base64VideoData
   );
   ```

## Implementation Notes

- The schema is converted to readable text instructions that are added to your prompt
- The response is parsed from the text response's JSON content
- Error handling includes attempts to extract valid JSON from text responses
- Type safety is maintained throughout the process

## Available Schemas

Several pre-built schemas are available:

- **Traffic Video Analysis**: For generating threads from video clips
- **Image Response**: For generating chat responses from current frames
- **Recipe Generator**: Example schema for listing recipes

See `gemini-helpers.ts` for complete implementation details and examples. 