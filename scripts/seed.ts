#!/usr/bin/env npx tsx
// ============================================
// Cocktail Data Seeding Script
// Fetches from TheCocktailDB API → enriches → writes cocktails.json
// Usage: npx tsx scripts/seed.ts
// ============================================

import { fetchAllCocktails } from '../src/lib/cocktaildb-api';
import {
    classifySpirit,
    classifyTaste,
    classifyMethod,
    classifyStrength,
    generateSlug,
    generateMetaTitle,
    generateMetaDescription,
} from '../src/lib/data-enrichment';
import type { Cocktail } from '../src/lib/types';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

async function main() {
    console.log('🍸 Cocktails From Around the World — Data Seeding');
    console.log('='.repeat(50));
    console.log('');
    console.log('Fetching cocktails from TheCocktailDB API...');

    const rawDrinks = await fetchAllCocktails();

    console.log(`\n✅ Fetched ${rawDrinks.length} cocktails from API`);
    console.log('Enriching data...\n');

    const cocktails: Cocktail[] = rawDrinks.map(drink => {
        const ingredientNames = drink.ingredients.map(i => i.name);
        const { primary, secondary } = classifySpirit(ingredientNames);
        const tasteTags = classifyTaste(ingredientNames);
        const prepMethod = classifyMethod(drink.instructions);
        const strength = classifyStrength(ingredientNames);
        const slug = generateSlug(drink.name);

        return {
            id: drink.id,
            name: drink.name,
            slug,
            country: '',
            primarySpirit: primary,
            secondarySpirit: secondary,
            prepMethod,
            tasteTags,
            alcoholStrength: strength,
            ingredients: drink.ingredients,
            instructions: drink.instructions,
            glassware: drink.glass,
            garnish: '',
            imageUrl: drink.imageUrl,
            metaTitle: generateMetaTitle(drink.name, primary, 'Global'),
            metaDescription: generateMetaDescription(drink.name, primary, 'Global', ingredientNames),
            source: 'API' as const,
        };
    });

    // Sort alphabetically
    cocktails.sort((a, b) => a.name.localeCompare(b.name));

    const outPath = resolve(__dirname, '../src/data/cocktails.json');
    writeFileSync(outPath, JSON.stringify(cocktails, null, 2), 'utf-8');

    console.log(`✅ Wrote ${cocktails.length} enriched cocktails to src/data/cocktails.json`);

    // Print summary stats
    const spiritCounts: Record<string, number> = {};
    cocktails.forEach(c => {
        spiritCounts[c.primarySpirit] = (spiritCounts[c.primarySpirit] || 0) + 1;
    });

    console.log('\n📊 Spirit breakdown:');
    Object.entries(spiritCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([spirit, count]) => console.log(`   ${spirit}: ${count}`));
}

main().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
