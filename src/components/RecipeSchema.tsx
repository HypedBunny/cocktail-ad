import type { Cocktail } from '@/lib/types';

interface Props {
    cocktail: Cocktail;
}

export default function RecipeSchema({ cocktail }: Props) {
    const schema = {
        '@context': 'https://schema.org/',
        '@type': 'Recipe',
        name: cocktail.name,
        image: cocktail.imageUrl,
        description: cocktail.metaDescription,
        recipeCategory: 'Cocktail',
        recipeCuisine: cocktail.country || 'Global',
        recipeIngredient: cocktail.ingredients.map(
            (i) => `${i.measure} ${i.name}`.trim()
        ),
        recipeInstructions: [
            {
                '@type': 'HowToStep',
                text: cocktail.instructions,
            },
        ],
        keywords: [
            cocktail.primarySpirit,

            cocktail.prepMethod,
            ...cocktail.tasteTags,
        ].join(', '),
        ...(cocktail.glassware && {
            tool: {
                '@type': 'HowToTool',
                name: cocktail.glassware,
            },
        }),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
