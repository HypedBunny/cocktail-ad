import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getCocktailsBySpirit, getSpiritBySlug } from '@/lib/data';
import { ALL_SPIRITS, SPIRIT_SLUGS } from '@/lib/types';
import CocktailGrid from '@/components/CocktailGrid';

interface Props {
    params: Promise<{ slug: string }>;
}

const SPIRIT_DESCRIPTIONS: Record<string, string> = {
    'Vodka': 'Clean, versatile, and endlessly mixable. Vodka is the chameleon of spirits, forming the base of countless classic and modern cocktails.',
    'Gin': 'Botanical, complex, and refreshing. Gin brings a world of herbal and floral flavors to some of the most beloved cocktails ever created.',
    'Rum': 'Sweet, tropical, and full of character. From light Cuban rums to dark Jamaican varieties, rum is the soul of Caribbean cocktail culture.',
    'Tequila': 'Bold, earthy, and distinctly Mexican. Tequila and mezcal bring agave-forward complexity to margaritas, palomas, and beyond.',
    'Whiskey': 'Rich, warming, and deeply flavorful. Whiskey cocktails range from the elegant Old Fashioned to the refreshing Whiskey Sour.',
    'Bourbon': 'Sweet, smooth, and distinctly American. Bourbon\'s caramel and vanilla notes make it perfect for classic Southern cocktails.',
    'Scotch': 'Smoky, complex, and sophisticated. Scotch whisky brings a distinctive character to both classic and contemporary cocktails.',
    'Brandy': 'Fruity, warming, and elegant. Brandy-based cocktails like the Sidecar showcase the spirit\'s smooth, refined character.',
    'Mezcal': 'Smoky, artisanal, and deeply complex. Mezcal adds a distinctive smokiness that transforms any cocktail it touches.',
};

export async function generateStaticParams() {
    return ALL_SPIRITS.map(spirit => ({
        slug: SPIRIT_SLUGS[spirit],
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const spirit = getSpiritBySlug(slug);
    if (!spirit) return { title: 'Spirit Not Found' };

    return {
        title: `${spirit} Cocktails | Best ${spirit} Drink Recipes | Cocktails Worldwide`,
        description: SPIRIT_DESCRIPTIONS[spirit] || `Discover the best ${spirit} cocktail recipes from around the world.`,
    };
}

export default async function SpiritPage({ params }: Props) {
    const { slug } = await params;
    const spirit = getSpiritBySlug(slug);

    if (!spirit) {
        notFound();
    }

    const cocktails = getCocktailsBySpirit(spirit);



    return (
        <>
            <section className="landing-hero">
                <div className="container">
                    <span className="section-label">Spirit</span>
                    <h1>{spirit} Cocktails</h1>
                    <p>{SPIRIT_DESCRIPTIONS[spirit] || `Explore our collection of ${spirit.toLowerCase()} cocktail recipes.`}</p>
                    <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <p className="result-count">
                        <strong>{cocktails.length}</strong> {spirit.toLowerCase()} cocktails
                    </p>
                    <CocktailGrid cocktails={cocktails} />
                </div>
            </section>

            {/* Cross-link to other spirits */}
            <section className="section" style={{ background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Explore More</span>
                        <h2 className="section-title">Other Spirits</h2>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {ALL_SPIRITS.filter(s => s !== spirit && getCocktailsBySpirit(s).length > 0).slice(0, 8).map(s => (
                            <Link
                                key={s}
                                href={`/spirit/${SPIRIT_SLUGS[s]}`}
                                className="btn btn-secondary"
                            >
                                {s}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
