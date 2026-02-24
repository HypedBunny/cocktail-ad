import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getCocktailsByTaste, getTasteBySlug } from '@/lib/data';
import { ALL_TASTES, TASTE_SLUGS, SPIRIT_SLUGS } from '@/lib/types';
import CocktailGrid from '@/components/CocktailGrid';

interface Props {
    params: Promise<{ slug: string }>;
}

const TASTE_DESCRIPTIONS: Record<string, string> = {
    'Sweet': 'Smooth, indulgent, and crowd-pleasing. Sweet cocktails range from creamy dessert drinks to fruity tropical delights.',
    'Sour': 'Tangy, citrus-forward, and refreshingly balanced. Sour cocktails awaken the palate with bright, zesty flavors.',
    'Bitter': 'Bold, complex, and impossibly sophisticated. Bitter cocktails are the hallmark of discerning palates and classic bartending.',
    'Floral': 'Delicate, aromatic, and elegant. Floral cocktails showcase botanical ingredients like elderflower, lavender, and rose.',
    'Earthy': 'Grounded, warm, and deeply satisfying. Earthy cocktails feature ingredients like coffee, cacao, and herbal liqueurs.',
    'Smoky': 'Intense, mysterious, and utterly captivating. Smoky cocktails bring campfire warmth and depth to every sip.',
    'Spicy': 'Fiery, exciting, and adventurous. Spicy cocktails deliver a thrilling kick from ginger, chili, and aromatic spices.',
    'Fruity': 'Vibrant, juicy, and irresistible. Fruity cocktails burst with the flavors of fresh fruits from around the world.',
    'Herbal': 'Fresh, aromatic, and nuanced. Herbal cocktails celebrate the botanical world with mint, basil, and complex liqueurs.',
    'Dry': 'Crisp, clean, and elegantly restrained. Dry cocktails favor subtlety over sweetness for a refined drinking experience.',
    'Strong': 'Potent, bold, and not for the faint of heart. Strong cocktails deliver maximum spirit character with minimal dilution.',
    'Refreshing': 'Cool, invigorating, and perfect for any occasion. Refreshing cocktails are the ultimate thirst-quenchers.',
};

export async function generateStaticParams() {
    return ALL_TASTES.map(taste => ({
        slug: TASTE_SLUGS[taste],
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const taste = getTasteBySlug(slug);
    if (!taste) return { title: 'Taste Not Found' };

    return {
        title: `${taste} Cocktails | ${taste} Drink Recipes | Cocktails Worldwide`,
        description: TASTE_DESCRIPTIONS[taste] || `Discover ${taste.toLowerCase()} cocktail recipes from around the world.`,
    };
}

export default async function TastePage({ params }: Props) {
    const { slug } = await params;
    const taste = getTasteBySlug(slug);

    if (!taste) {
        notFound();
    }

    const cocktails = getCocktailsByTaste(taste);

    // Get top spirits
    const spirits = [...new Set(cocktails.map(c => c.primarySpirit))].slice(0, 6);

    return (
        <>
            <section className="landing-hero">
                <div className="container">
                    <span className="section-label">Taste Profile</span>
                    <h1>{taste} Cocktails</h1>
                    <p>{TASTE_DESCRIPTIONS[taste]}</p>
                    <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                        {spirits.map(spirit => (
                            <Link key={spirit} href={`/spirit/${SPIRIT_SLUGS[spirit]}`}>
                                <span className="tag">{spirit}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Other taste profiles */}
            <section className="section" style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md) 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {ALL_TASTES.filter(t => t !== taste).map(t => (
                            <Link
                                key={t}
                                href={`/taste/${TASTE_SLUGS[t]}`}
                                className="btn btn-secondary"
                            >
                                {t}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <p className="result-count">
                        <strong>{cocktails.length}</strong> {taste.toLowerCase()} cocktails
                    </p>
                    <CocktailGrid cocktails={cocktails} />
                </div>
            </section>


        </>
    );
}
