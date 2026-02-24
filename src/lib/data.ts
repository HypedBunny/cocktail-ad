// ============================================
// Data Access Layer
// Loads cocktails.json and provides query functions
// ============================================

import cocktailsData from '@/data/cocktails.json';
import type { Cocktail, FilterState, Spirit, TasteProfile } from './types';
import { SPIRIT_SLUGS, TASTE_SLUGS } from './types';

const cocktails: Cocktail[] = cocktailsData as Cocktail[];

// ---- Core Queries ----

export function getAllCocktails(): Cocktail[] {
    return cocktails;
}

export function getCocktailBySlug(slug: string): Cocktail | undefined {
    return cocktails.find(c => c.slug === slug);
}

export function getCocktailsBySpirit(spirit: Spirit): Cocktail[] {
    return cocktails.filter(c => c.primarySpirit === spirit || c.secondarySpirit === spirit);
}

export function getCocktailsByTaste(taste: TasteProfile): Cocktail[] {
    return cocktails.filter(c => c.tasteTags.includes(taste));
}

export function getRandomCocktail(): Cocktail {
    return cocktails[Math.floor(Math.random() * cocktails.length)];
}

export function searchCocktails(query: string): Cocktail[] {
    const q = query.toLowerCase();
    return cocktails.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.ingredients.some(i => i.name.toLowerCase().includes(q)) ||
        c.primarySpirit.toLowerCase().includes(q)
    );
}

// ---- Multi-Select Filtering ----

export function filterCocktails(filters: FilterState): Cocktail[] {
    let result = cocktails;

    // Text search
    if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.ingredients.some(i => i.name.toLowerCase().includes(q))
        );
    }

    // Spirit filter (OR within category)
    if (filters.spirits.length > 0) {
        result = result.filter(c =>
            filters.spirits.includes(c.primarySpirit) ||
            (c.secondarySpirit && filters.spirits.includes(c.secondarySpirit))
        );
    }

    // Taste filter (OR within category — cocktail must have at least one matching tag)
    if (filters.tastes.length > 0) {
        result = result.filter(c =>
            c.tasteTags.some(t => filters.tastes.includes(t))
        );
    }

    // Method filter (OR within category)
    if (filters.methods.length > 0) {
        result = result.filter(c => filters.methods.includes(c.prepMethod));
    }

    return result;
}

// ---- Aggregate Data (for landing pages) ----
export function getSpiritData() {
    const spirits = Object.entries(SPIRIT_SLUGS).map(([name, slug]) => {
        const spiritCocktails = getCocktailsBySpirit(name as Spirit);
        return {
            name: name as Spirit,
            slug,
            count: spiritCocktails.length,
            featured: spiritCocktails.slice(0, 3),
        };
    });
    return spirits.filter(s => s.count > 0);
}

export function getTasteData() {
    const tastes = Object.entries(TASTE_SLUGS).map(([name, slug]) => {
        const tasteCocktails = getCocktailsByTaste(name as TasteProfile);
        return {
            name: name as TasteProfile,
            slug,
            count: tasteCocktails.length,
        };
    });
    return tastes.filter(t => t.count > 0);
}

// ---- Related Cocktails ----

export function getRelatedCocktails(cocktail: Cocktail, limit = 6): Cocktail[] {
    const others = cocktails.filter(c => c.id !== cocktail.id);

    // Score by similarity
    const scored = others.map(c => {
        let score = 0;
        if (c.primarySpirit === cocktail.primarySpirit) score += 2;
        if (c.prepMethod === cocktail.prepMethod) score += 1;
        const commonTastes = c.tasteTags.filter(t => cocktail.tasteTags.includes(t));
        score += commonTastes.length;
        return { cocktail: c, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => s.cocktail);
}

// ---- Slug Reverse Lookup ----
export function getSpiritBySlug(slug: string): Spirit | undefined {
    const entry = Object.entries(SPIRIT_SLUGS).find(([, s]) => s === slug);
    return entry ? (entry[0] as Spirit) : undefined;
}

export function getTasteBySlug(slug: string): TasteProfile | undefined {
    const entry = Object.entries(TASTE_SLUGS).find(([, s]) => s === slug);
    return entry ? (entry[0] as TasteProfile) : undefined;
}
