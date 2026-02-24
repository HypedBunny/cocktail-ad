// ============================================
// Cocktails From Around the World — Core Types
// ============================================

export type Spirit =
  | 'Vodka'
  | 'Gin'
  | 'Rum'
  | 'Tequila'
  | 'Whiskey'
  | 'Bourbon'
  | 'Scotch'
  | 'Mezcal'
  | 'Brandy'
  | 'Champagne'
  | 'Wine'
  | 'Beer'
  | 'Absinthe'
  | 'Amaretto'
  | 'Kahlúa'
  | 'Baileys'
  | 'Aperol'
  | 'Campari'
  | 'Vermouth'
  | 'Pisco'
  | 'Sake'
  | 'Cachaça'
  | 'Non-Alcoholic'
  | 'Other';

export type TasteProfile =
  | 'Sweet'
  | 'Sour'
  | 'Bitter'
  | 'Floral'
  | 'Earthy'
  | 'Smoky'
  | 'Spicy'
  | 'Fruity'
  | 'Herbal'
  | 'Dry'
  | 'Strong'
  | 'Refreshing';

export type PrepMethod =
  | 'Shaken'
  | 'Stirred'
  | 'Built'
  | 'Blended'
  | 'Layered'
  | 'Pressed';

export type AlcoholStrength = 'Non-Alcoholic' | 'Light' | 'Medium' | 'Strong';

export interface Ingredient {
  name: string;
  measure: string;
}

export interface Cocktail {
  id: string;
  name: string;
  slug: string;
  country: string;
  primarySpirit: Spirit;
  secondarySpirit: Spirit | null;
  prepMethod: PrepMethod;
  tasteTags: TasteProfile[];
  alcoholStrength: AlcoholStrength;
  ingredients: Ingredient[];
  instructions: string;
  glassware: string;
  garnish: string;
  imageUrl: string;
  metaTitle: string;
  metaDescription: string;
  source: 'API' | 'Editorial';
}

export interface FilterState {
  spirits: Spirit[];
  tastes: TasteProfile[];
  methods: PrepMethod[];
  search: string;
}

export const ALL_SPIRITS: Spirit[] = [
  'Vodka', 'Gin', 'Rum', 'Tequila', 'Whiskey', 'Bourbon', 'Scotch', 'Mezcal',
  'Brandy', 'Champagne', 'Wine', 'Beer', 'Absinthe', 'Amaretto', 'Kahlúa',
  'Baileys', 'Aperol', 'Campari', 'Vermouth', 'Pisco', 'Sake', 'Cachaça',
  'Non-Alcoholic', 'Other'
];

export const ALL_TASTES: TasteProfile[] = [
  'Sweet', 'Sour', 'Bitter', 'Floral', 'Earthy', 'Smoky', 'Spicy', 'Fruity',
  'Herbal', 'Dry', 'Strong', 'Refreshing'
];

export const ALL_METHODS: PrepMethod[] = [
  'Shaken', 'Stirred', 'Built', 'Blended', 'Layered', 'Pressed'
];

// URL slug helpers
export const SPIRIT_SLUGS: Record<string, string> = {
  'Vodka': 'vodka',
  'Gin': 'gin',
  'Rum': 'rum',
  'Tequila': 'tequila',
  'Whiskey': 'whiskey',
  'Bourbon': 'bourbon',
  'Scotch': 'scotch',
  'Mezcal': 'mezcal',
  'Brandy': 'brandy',
  'Champagne': 'champagne',
  'Wine': 'wine',
  'Beer': 'beer',
  'Absinthe': 'absinthe',
  'Amaretto': 'amaretto',
  'Kahlúa': 'kahlua',
  'Baileys': 'baileys',
  'Aperol': 'aperol',
  'Campari': 'campari',
  'Vermouth': 'vermouth',
  'Pisco': 'pisco',
  'Sake': 'sake',
  'Cachaça': 'cachaca',
  'Non-Alcoholic': 'non-alcoholic',
  'Other': 'other',
};

export const TASTE_SLUGS: Record<TasteProfile, string> = {
  'Sweet': 'sweet',
  'Sour': 'sour',
  'Bitter': 'bitter',
  'Floral': 'floral',
  'Earthy': 'earthy',
  'Smoky': 'smoky',
  'Spicy': 'spicy',
  'Fruity': 'fruity',
  'Herbal': 'herbal',
  'Dry': 'dry',
  'Strong': 'strong',
  'Refreshing': 'refreshing',
};
