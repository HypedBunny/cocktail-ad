import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllCocktails, getCocktailBySlug, getRelatedCocktails } from '@/lib/data';
import { SPIRIT_SLUGS } from '@/lib/types';
import CocktailGrid from '@/components/CocktailGrid';
import RecipeSchema from '@/components/RecipeSchema';
import IngredientList from '@/components/IngredientList';
import AdUnit from '@/components/AdUnit';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getAllCocktails().map((cocktail) => ({
        slug: cocktail.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const cocktail = getCocktailBySlug(slug);
    if (!cocktail) return { title: 'Cocktail Not Found' };

    return {
        title: cocktail.metaTitle,
        description: cocktail.metaDescription,
        openGraph: {
            title: cocktail.metaTitle,
            description: cocktail.metaDescription,
            images: cocktail.imageUrl ? [cocktail.imageUrl] : [],
        },
    };
}

export default async function CocktailPage({ params }: Props) {
    const { slug } = await params;
    const cocktail = getCocktailBySlug(slug);

    if (!cocktail) {
        notFound();
    }

    const related = getRelatedCocktails(cocktail, 3);

    return (
        <>
            <RecipeSchema cocktail={cocktail} />

            {/* Hero */}
            <section className="recipe-hero">
                {cocktail.imageUrl && (
                    <div
                        className="recipe-hero-bg"
                        style={{ backgroundImage: `url(${cocktail.imageUrl})` }}
                    />
                )}
                <div className="recipe-hero-overlay" />

                <div className="container">
                    <div className="recipe-hero-content">
                        <div className="recipe-image">
                            {cocktail.imageUrl ? (
                                <img
                                    src={cocktail.imageUrl}
                                    alt={cocktail.name}
                                    width={350}
                                    height={350}
                                />
                            ) : (
                                <div style={{
                                    width: 350,
                                    height: 350,
                                    background: 'var(--bg-tertiary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '5rem',
                                }}>
                                    🍸
                                </div>
                            )}
                        </div>

                        <div className="recipe-info">
                            <h1>{cocktail.name}</h1>

                            <div className="recipe-meta-row">
                                <Link href={`/spirit/${SPIRIT_SLUGS[cocktail.primarySpirit]}`}>
                                    <span className="tag">{cocktail.primarySpirit}</span>
                                </Link>
                                <span className="tag tag-method">{cocktail.prepMethod}</span>
                                {cocktail.tasteTags.map((taste) => (
                                    <span key={taste} className="tag tag-taste">{taste}</span>
                                ))}
                            </div>

                            <div className="recipe-details-grid">
                                <div className="recipe-detail-card">
                                    <div className="recipe-detail-label">Glassware</div>
                                    <div className="recipe-detail-value">{cocktail.glassware || 'Any'}</div>
                                </div>
                                <div className="recipe-detail-card">
                                    <div className="recipe-detail-label">Method</div>
                                    <div className="recipe-detail-value">{cocktail.prepMethod}</div>
                                </div>
                                <div className="recipe-detail-card">
                                    <div className="recipe-detail-label">Strength</div>
                                    <div className="recipe-detail-value">{cocktail.alcoholStrength}</div>
                                </div>
                                <div className="recipe-detail-card">
                                    <div className="recipe-detail-label">Spirit</div>
                                    <div className="recipe-detail-value">{cocktail.primarySpirit}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recipe Body */}
            <section className="recipe-body">
                <div className="container">
                    <div className="recipe-grid">
                        {/* Ingredients */}
                        <div>
                            <h2 className="recipe-section-title">
                                🧪 Ingredients
                            </h2>
                            <IngredientList ingredients={cocktail.ingredients} />
                        </div>

                        {/* Instructions */}
                        <div>
                            <h2 className="recipe-section-title">
                                📋 Instructions
                            </h2>
                            <p className="instructions-text">{cocktail.instructions}</p>

                            {cocktail.garnish && (
                                <div style={{ marginTop: 'var(--space-2xl)' }}>
                                    <h3 className="recipe-section-title" style={{ fontSize: 'var(--fs-lg)' }}>
                                        🍋 Garnish
                                    </h3>
                                    <p className="instructions-text">{cocktail.garnish}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Ad */}
            <section className="section" style={{ paddingTop: 0, paddingBottom: 'var(--space-xl)' }}>
                <div className="container">
                    <AdUnit
                        slot="3778473495"
                        format="auto"
                        style={{
                            minHeight: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden'
                        }}
                    />
                </div>
            </section>

            {/* Related Cocktails */}
            {related.length > 0 && (
                <section className="related-section">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-label">You might also like</span>
                            <h2 className="section-title">Related Cocktails</h2>
                        </div>
                        <CocktailGrid cocktails={related} />
                    </div>
                </section>
            )}
        </>
    );
}
