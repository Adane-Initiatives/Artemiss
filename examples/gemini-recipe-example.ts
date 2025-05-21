/**
 * Example showing how to use Gemini's structured output with recipes
 */
import { getRecipes } from '../lib/gemini-helpers';

async function main() {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.error("API key not set in environment variables. Please set NEXT_PUBLIC_GOOGLE_API_KEY.");
      return;
    }
    
    // Example query for cookie recipes
    const prompt = "List 3 popular chocolate chip cookie recipes with the exact measurements of ingredients.";
    
    console.log("Fetching recipes from Gemini...");
    const recipes = await getRecipes(apiKey, prompt);
    
    // Display the structured results
    console.log("Received structured recipes:");
    console.log(JSON.stringify(recipes, null, 2));
    
    // Display in a more readable format
    console.log("\nRecipes:");
    recipes.forEach((recipe, index) => {
      console.log(`\nRecipe ${index + 1}: ${recipe.recipeName}`);
      console.log("Ingredients:");
      recipe.ingredients.forEach(ingredient => {
        console.log(`- ${ingredient}`);
      });
    });
    
  } catch (error) {
    console.error("Error in recipe example:", error);
  }
}

// Run the example if called directly
if (require.main === module) {
  main();
}

export default main; 