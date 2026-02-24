// ============================================
// TheCocktailDB API Client
// ============================================

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

interface ApiDrink {
    idDrink: string;
    strDrink: string;
    strCategory: string;
    strAlcoholic: string;
    strGlass: string;
    strInstructions: string;
    strDrinkThumb: string;
    strIngredient1: string | null;
    strIngredient2: string | null;
    strIngredient3: string | null;
    strIngredient4: string | null;
    strIngredient5: string | null;
    strIngredient6: string | null;
    strIngredient7: string | null;
    strIngredient8: string | null;
    strIngredient9: string | null;
    strIngredient10: string | null;
    strIngredient11: string | null;
    strIngredient12: string | null;
    strIngredient13: string | null;
    strIngredient14: string | null;
    strIngredient15: string | null;
    strMeasure1: string | null;
    strMeasure2: string | null;
    strMeasure3: string | null;
    strMeasure4: string | null;
    strMeasure5: string | null;
    strMeasure6: string | null;
    strMeasure7: string | null;
    strMeasure8: string | null;
    strMeasure9: string | null;
    strMeasure10: string | null;
    strMeasure11: string | null;
    strMeasure12: string | null;
    strMeasure13: string | null;
    strMeasure14: string | null;
    strMeasure15: string | null;
}

interface ApiResponse {
    drinks: ApiDrink[] | null;
}

export interface ParsedDrink {
    id: string;
    name: string;
    glass: string;
    instructions: string;
    imageUrl: string;
    isAlcoholic: boolean;
    ingredients: { name: string; measure: string }[];
}

function parseDrink(drink: ApiDrink): ParsedDrink {
    const ingredients: { name: string; measure: string }[] = [];

    for (let i = 1; i <= 15; i++) {
        const ing = drink[`strIngredient${i}` as keyof ApiDrink] as string | null;
        const measure = drink[`strMeasure${i}` as keyof ApiDrink] as string | null;

        if (ing && ing.trim()) {
            ingredients.push({
                name: ing.trim(),
                measure: measure?.trim() || '',
            });
        }
    }

    return {
        id: drink.idDrink,
        name: drink.strDrink,
        glass: drink.strGlass || 'Cocktail glass',
        instructions: drink.strInstructions || '',
        imageUrl: drink.strDrinkThumb || '',
        isAlcoholic: drink.strAlcoholic !== 'Non alcoholic',
        ingredients,
    };
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchCocktailsByLetter(letter: string): Promise<ParsedDrink[]> {
    try {
        const res = await fetch(`${BASE_URL}/search.php?f=${letter}`);
        const data: ApiResponse = await res.json();

        if (!data.drinks) return [];
        return data.drinks.map(parseDrink);
    } catch (err) {
        console.error(`Failed to fetch letter ${letter}:`, err);
        return [];
    }
}

export async function fetchAllCocktails(): Promise<ParsedDrink[]> {
    const allDrinks: ParsedDrink[] = [];
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

    for (const letter of letters) {
        console.log(`  Fetching cocktails starting with "${letter.toUpperCase()}"...`);
        const drinks = await fetchCocktailsByLetter(letter);
        allDrinks.push(...drinks);
        // Rate limit - be respectful
        await delay(500);
    }

    // Deduplicate by ID
    const seen = new Set<string>();
    const unique = allDrinks.filter(d => {
        if (seen.has(d.id)) return false;
        seen.add(d.id);
        return true;
    });

    return unique;
}

export async function fetchRandomCocktail(): Promise<ParsedDrink | null> {
    try {
        const res = await fetch(`${BASE_URL}/random.php`);
        const data: ApiResponse = await res.json();
        if (!data.drinks || data.drinks.length === 0) return null;
        return parseDrink(data.drinks[0]);
    } catch {
        return null;
    }
}
