// ============================================
// Data Enrichment Layer
// Maps raw TheCocktailDB data to enriched Cocktail objects
// ============================================

import type { Spirit, TasteProfile, PrepMethod, AlcoholStrength } from './types';

// ---- SPIRIT CLASSIFICATION ----
const SPIRIT_KEYWORDS: [string[], Spirit][] = [
    [['vodka'], 'Vodka'],
    [['gin', 'sloe gin'], 'Gin'],
    [['rum', 'dark rum', 'light rum', 'white rum', 'spiced rum', 'coconut rum', 'malibu'], 'Rum'],
    [['tequila', 'reposado', 'anejo', 'blanco'], 'Tequila'],
    [['mezcal'], 'Mezcal'],
    [['bourbon'], 'Bourbon'],
    [['scotch', 'scotch whisky'], 'Scotch'],
    [['whiskey', 'whisky', 'rye', 'irish whiskey', 'blended whiskey'], 'Whiskey'],
    [['brandy', 'cognac', 'armagnac', 'calvados'], 'Brandy'],
    [['champagne', 'prosecco', 'sparkling wine', 'cava'], 'Champagne'],
    [['wine', 'red wine', 'white wine', 'port', 'sherry'], 'Wine'],
    [['beer', 'ale', 'lager', 'stout', 'guinness'], 'Beer'],
    [['absinthe'], 'Absinthe'],
    [['amaretto', 'disaronno'], 'Amaretto'],
    [['kahlua', 'kahlúa', 'coffee liqueur'], 'Kahlúa'],
    [['baileys', 'irish cream'], 'Baileys'],
    [['aperol'], 'Aperol'],
    [['campari'], 'Campari'],
    [['vermouth', 'dry vermouth', 'sweet vermouth'], 'Vermouth'],
    [['pisco'], 'Pisco'],
    [['sake'], 'Sake'],
    [['cachaca', 'cachaça'], 'Cachaça'],
];

export function classifySpirit(ingredients: string[]): { primary: Spirit; secondary: Spirit | null } {
    const found: Spirit[] = [];

    for (const ing of ingredients) {
        const ingLower = ing.toLowerCase();
        for (const [keywords, spirit] of SPIRIT_KEYWORDS) {
            if (keywords.some(kw => ingLower.includes(kw)) && !found.includes(spirit)) {
                found.push(spirit);
            }
        }
    }

    if (found.length === 0) return { primary: 'Other', secondary: null };
    return { primary: found[0], secondary: found[1] || null };
}

// ---- TASTE PROFILE CLASSIFICATION ----
const TASTE_INGREDIENT_MAP: Record<string, TasteProfile[]> = {
    // Sweet
    'sugar': ['Sweet'],
    'simple syrup': ['Sweet'],
    'honey': ['Sweet'],
    'agave': ['Sweet'],
    'grenadine': ['Sweet', 'Fruity'],
    'triple sec': ['Sweet'],
    'cointreau': ['Sweet'],
    'grand marnier': ['Sweet'],
    'cream': ['Sweet'],
    'condensed milk': ['Sweet'],
    'chocolate': ['Sweet'],
    'vanilla': ['Sweet'],
    'maraschino': ['Sweet'],
    'creme de': ['Sweet'],
    'liqueur': ['Sweet'],
    'kahlua': ['Sweet'],
    'baileys': ['Sweet'],
    'amaretto': ['Sweet'],
    'malibu': ['Sweet'],
    'blue curacao': ['Sweet'],
    'galliano': ['Sweet'],
    'frangelico': ['Sweet'],
    'chambord': ['Sweet'],
    'midori': ['Sweet', 'Fruity'],
    'schnapps': ['Sweet'],

    // Sour / Citrus
    'lemon': ['Sour', 'Refreshing'],
    'lime': ['Sour', 'Refreshing'],
    'grapefruit': ['Sour', 'Fruity'],
    'orange juice': ['Fruity', 'Sweet'],
    'cranberry': ['Sour', 'Fruity'],
    'sour mix': ['Sour'],
    'citrus': ['Sour'],

    // Bitter
    'bitters': ['Bitter'],
    'angostura': ['Bitter'],
    'campari': ['Bitter'],
    'aperol': ['Bitter', 'Sweet'],
    'fernet': ['Bitter', 'Herbal'],
    'amaro': ['Bitter', 'Herbal'],
    'tonic': ['Bitter', 'Refreshing'],

    // Herbal
    'mint': ['Herbal', 'Refreshing'],
    'basil': ['Herbal'],
    'rosemary': ['Herbal'],
    'thyme': ['Herbal'],
    'chartreuse': ['Herbal'],
    'absinthe': ['Herbal'],
    'elderflower': ['Floral', 'Sweet'],
    'st. germain': ['Floral', 'Sweet'],
    'vermouth': ['Herbal', 'Dry'],

    // Fruity
    'pineapple': ['Fruity', 'Sweet'],
    'mango': ['Fruity', 'Sweet'],
    'passion fruit': ['Fruity'],
    'peach': ['Fruity', 'Sweet'],
    'strawberry': ['Fruity', 'Sweet'],
    'raspberry': ['Fruity'],
    'blackberry': ['Fruity'],
    'coconut': ['Fruity', 'Sweet'],
    'banana': ['Fruity', 'Sweet'],
    'apple': ['Fruity'],
    'watermelon': ['Fruity', 'Refreshing'],

    // Smoky
    'mezcal': ['Smoky', 'Strong'],
    'scotch': ['Smoky'],
    'lapsang': ['Smoky'],

    // Spicy
    'tabasco': ['Spicy'],
    'jalapeño': ['Spicy'],
    'jalapeno': ['Spicy'],
    'chili': ['Spicy'],
    'pepper': ['Spicy'],
    'ginger': ['Spicy', 'Refreshing'],
    'cinnamon': ['Spicy', 'Sweet'],
    'cayenne': ['Spicy'],
    'horseradish': ['Spicy'],

    // Earthy
    'coffee': ['Earthy', 'Bitter'],
    'espresso': ['Earthy', 'Bitter'],
    'cacao': ['Earthy'],
    'tea': ['Earthy'],
    'matcha': ['Earthy'],
    'turmeric': ['Earthy'],

    // Refreshing
    'soda': ['Refreshing'],
    'club soda': ['Refreshing'],
    'sparkling': ['Refreshing'],
    'tonic water': ['Refreshing', 'Bitter'],
    'cucumber': ['Refreshing'],
    'ice': ['Refreshing'],

    // Floral
    'rose': ['Floral'],
    'lavender': ['Floral'],
    'hibiscus': ['Floral'],
    'violet': ['Floral'],

    // Dry
    'dry vermouth': ['Dry'],
    'dry gin': ['Dry'],

    // Strong
    'bourbon': ['Strong'],
    'whiskey': ['Strong'],
    'rum': ['Strong'],
    'tequila': ['Strong'],
    'vodka': ['Strong'],
    'gin': ['Strong'],
    'brandy': ['Strong'],
    'cognac': ['Strong'],
};

export function classifyTaste(ingredients: string[]): TasteProfile[] {
    const tags = new Set<TasteProfile>();

    for (const ing of ingredients) {
        const ingLower = ing.toLowerCase();
        for (const [keyword, tastes] of Object.entries(TASTE_INGREDIENT_MAP)) {
            if (ingLower.includes(keyword)) {
                tastes.forEach(t => tags.add(t));
            }
        }
    }

    // Must have at least one tag
    if (tags.size === 0) tags.add('Refreshing');

    return Array.from(tags);
}

// ---- PREPARATION METHOD CLASSIFICATION ----
const METHOD_KEYWORDS: Record<string, PrepMethod> = {
    'shake': 'Shaken',
    'shaken': 'Shaken',
    'stir': 'Stirred',
    'stirred': 'Stirred',
    'blend': 'Blended',
    'blended': 'Blended',
    'blender': 'Blended',
    'layer': 'Layered',
    'layered': 'Layered',
    'float': 'Layered',
    'build': 'Built',
    'built': 'Built',
    'pour': 'Built',
    'muddle': 'Built',
    'press': 'Pressed',
};

export function classifyMethod(instructions: string): PrepMethod {
    const lower = instructions.toLowerCase();

    // Check in priority order  
    if (lower.includes('blend') || lower.includes('blender')) return 'Blended';
    if (lower.includes('layer') || lower.includes('float')) return 'Layered';
    if (lower.includes('shake') || lower.includes('shaken')) return 'Shaken';
    if (lower.includes('stir') || lower.includes('stirred')) return 'Stirred';
    if (lower.includes('press')) return 'Pressed';

    return 'Built';
}

// ---- ALCOHOL STRENGTH ----
const STRONG_SPIRITS = ['vodka', 'gin', 'rum', 'tequila', 'whiskey', 'bourbon', 'scotch', 'mezcal', 'brandy', 'cognac', 'absinthe'];

export function classifyStrength(ingredients: string[]): AlcoholStrength {
    let spiritCount = 0;
    let hasAlcohol = false;

    for (const ing of ingredients) {
        const lower = ing.toLowerCase();
        if (STRONG_SPIRITS.some(s => lower.includes(s))) {
            spiritCount++;
            hasAlcohol = true;
        }
        if (['liqueur', 'wine', 'beer', 'champagne', 'prosecco', 'vermouth', 'aperol', 'campari', 'amaretto', 'kahlua', 'baileys', 'schnapps', 'triple sec', 'cointreau', 'grand marnier'].some(s => lower.includes(s))) {
            hasAlcohol = true;
        }
    }

    if (!hasAlcohol) return 'Non-Alcoholic';
    if (spiritCount >= 3) return 'Strong';
    if (spiritCount >= 2) return 'Medium';
    if (spiritCount >= 1) return 'Medium';
    return 'Light';
}

// ---- SLUG GENERATION ----
export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// ---- SEO META GENERATION ----
export function generateMetaTitle(name: string, spirit: Spirit, country: string): string {
    return `${name} Cocktail Recipe | ${spirit} Drink from ${country}`;
}

export function generateMetaDescription(
    name: string,
    spirit: Spirit,
    country: string,
    ingredients: string[]
): string {
    const ingList = ingredients.slice(0, 4).join(', ');
    return `Learn how to make the perfect ${name} — a ${spirit.toLowerCase()}-based cocktail from ${country}. Made with ${ingList}. Full recipe, ingredients & instructions.`;
}
