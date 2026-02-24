import { MetadataRoute } from 'next';
import { getAllCocktails } from '@/lib/data';
import { ALL_SPIRITS, ALL_TASTES, SPIRIT_SLUGS, TASTE_SLUGS } from '@/lib/types';

const BASE_URL = 'https://cocktailsworldwide.com';

export default function sitemap(): MetadataRoute.Sitemap {
    const cocktails = getAllCocktails();

    const cocktailPages = cocktails.map(c => ({
        url: `${BASE_URL}/cocktails/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    const spiritPages = ALL_SPIRITS.map(spirit => ({
        url: `${BASE_URL}/spirit/${SPIRIT_SLUGS[spirit]}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    const tastePages = ALL_TASTES.map(taste => ({
        url: `${BASE_URL}/taste/${TASTE_SLUGS[taste]}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/explore`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },

        ...spiritPages,
        ...tastePages,
        ...cocktailPages,
    ];
}
