/**
 * Gemini API Helper Functions 
 * 
 * Utilities for working with Google's Gemini API structured outputs
 */

// Type definitions to mirror Gemini's type system
export enum SchemaType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  ARRAY = "ARRAY",
  OBJECT = "OBJECT"
}

// Interface for defining property schemas
export interface PropertySchema {
  type: SchemaType;
  description?: string;
  enum?: string[];
  items?: PropertySchema;
  properties?: Record<string, PropertySchema>;
  required?: string[];
}

// Interface for defining object schemas
export interface ObjectSchema {
  type: SchemaType.OBJECT;
  properties: Record<string, PropertySchema>;
  required?: string[];
}

// Interface for defining array schemas
export interface ArraySchema {
  type: SchemaType.ARRAY;
  items: PropertySchema;
}

/**
 * Convert a schema object to a text description that can be included in the prompt
 */
function schemaToTextDescription(schema: ObjectSchema | ArraySchema): string {
  if (schema.type === SchemaType.ARRAY) {
    return `Format your response as a JSON array of objects with each object having these properties:
${propertySchemaToText(schema.items, 1)}`;
  } else {
    return `Format your response as a JSON object with these properties:
${Object.entries(schema.properties).map(([key, prop]) => 
  `- "${key}": ${propertyToDescription(prop, key)}${schema.required?.includes(key) ? ' (required)' : ''}`
).join('\n')}`;
  }
}

/**
 * Convert a property schema to text description
 */
function propertySchemaToText(schema: PropertySchema, indent: number): string {
  const indentation = '  '.repeat(indent);
  
  if (schema.type === SchemaType.OBJECT && schema.properties) {
    return Object.entries(schema.properties).map(([key, prop]) => 
      `${indentation}- "${key}": ${propertyToDescription(prop, key)}`
    ).join('\n');
  }
  
  return `${indentation}(Invalid schema type)`;
}

/**
 * Get a description of a property type
 */
function propertyToDescription(prop: PropertySchema, name: string): string {
  switch (prop.type) {
    case SchemaType.STRING:
      return prop.enum ? 
        `a string, one of: [${prop.enum.join(', ')}]` : 
        `a string${prop.description ? ` (${prop.description})` : ''}`;
      
    case SchemaType.NUMBER:
      return `a number${prop.description ? ` (${prop.description})` : ''}`;
      
    case SchemaType.BOOLEAN:
      return `a boolean (true or false)${prop.description ? ` (${prop.description})` : ''}`;
      
    case SchemaType.ARRAY:
      if (prop.items) {
        if (prop.items.type === SchemaType.STRING) {
          return `an array of strings${prop.description ? ` (${prop.description})` : ''}`;
        } else if (prop.items.type === SchemaType.NUMBER) {
          return `an array of numbers${prop.description ? ` (${prop.description})` : ''}`;
        } else if (prop.items.type === SchemaType.OBJECT) {
          return `an array of objects${prop.description ? ` (${prop.description})` : ''}`;
        }
      }
      return `an array${prop.description ? ` (${prop.description})` : ''}`;
      
    case SchemaType.OBJECT:
      return `an object${prop.description ? ` (${prop.description})` : ''}`;
      
    default:
      return 'unknown type';
  }
}

/**
 * Generate content with structured output from Gemini
 */
export async function generateStructuredContent<T>({
  apiKey,
  model = "gemini-1.5-flash", 
  prompt,
  mediaData,
  mediaType,
  schema,
  temperature = 0.4
}: {
  apiKey: string;
  model?: string;
  prompt: string;
  mediaData?: string;
  mediaType?: string;
  schema: ObjectSchema | ArraySchema;
  temperature?: number;
}): Promise<T> {
  
  // Prepare the parts array with prompt text
  const parts: any[] = [{ text: prompt }];
  
  // Add media data if provided
  if (mediaData && mediaType) {
    parts.push({
      inline_data: {
        mime_type: mediaType,
        data: mediaData
      }
    });
  }
  
  // Create a JSON schema description from the schema object
  const schemaDescription = schemaToTextDescription(schema);
  
  // Add the schema description to the prompt
  const fullPrompt = `${prompt}\n\n${schemaDescription}\n\nOnly return valid JSON in the exact format specified.`;
  parts[0].text = fullPrompt;
  
  // Make the API request
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts
        }
      ],
      safety_settings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ],
      generation_config: {
        temperature,
        top_k: 32,
        top_p: 0.95,
        max_output_tokens: 800,
      }
      // Note: response_schema and response_mime_type are not supported in this API version
      // Using text-based schema description instead
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }
  
  const responseData = await response.json();
  
  // Extract the text and parse as JSON
  if (responseData.candidates && 
      responseData.candidates[0]?.content?.parts[0]?.text) {
    try {
      const text = responseData.candidates[0].content.parts[0].text;
      // Try to find JSON in the response (it may have extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as T;
      }
      // If no JSON pattern found, try to parse the whole response
      return JSON.parse(text) as T;
    } catch (error) {
      throw new Error(`Failed to parse JSON from response: ${responseData.candidates[0].content.parts[0].text}`);
    }
  }
  
  throw new Error("Failed to get structured response from Gemini API");
}

/**
 * Example usage with a recipe schema
 */
export async function getRecipes(apiKey: string, prompt: string): Promise<Array<{recipeName: string, ingredients: string[]}>> {
  // Define the recipe schema
  const recipeSchema: ArraySchema = {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        recipeName: {
          type: SchemaType.STRING,
          description: "The full name of the recipe"
        },
        ingredients: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING
          },
          description: "List of ingredients with measurements"
        }
      }
    }
  };
  
  // Call the structured content function with proper typing
  const result = await generateStructuredContent<Array<{recipeName: string, ingredients: string[]}>>({
    apiKey,
    prompt,
    schema: recipeSchema
  });
  
  return result;
}

/**
 * Example usage with a thread analysis schema
 */
export async function analyzeTrafficVideo(
  apiKey: string, 
  prompt: string, 
  videoData: string
): Promise<{
  title: string;
  content: string;
  severity: "info" | "low" | "medium" | "high";
  needsAttention: boolean;
}> {
  const analysisSchema: ObjectSchema = {
    type: SchemaType.OBJECT,
    properties: {
      title: {
        type: SchemaType.STRING,
        description: "A concise title summarizing the key observation"
      },
      content: {
        type: SchemaType.STRING,
        description: "A detailed analysis of the traffic scene"
      },
      severity: {
        type: SchemaType.STRING,
        enum: ["info", "low", "medium", "high"],
        description: "Severity level of the observation"
      },
      needsAttention: {
        type: SchemaType.BOOLEAN,
        description: "Whether this situation needs immediate attention"
      }
    },
    required: ["title", "content", "severity", "needsAttention"]
  };
  
  return generateStructuredContent<{
    title: string;
    content: string;
    severity: "info" | "low" | "medium" | "high";
    needsAttention: boolean;
  }>({
    apiKey,
    model: "gemini-2.0-flash", // Use the video-capable model
    prompt,
    mediaData: videoData,
    mediaType: "video/webm",
    schema: analysisSchema,
    temperature: 0.2
  });
} 