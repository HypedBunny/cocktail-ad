import { Fragment } from 'react';
import Link from 'next/link';
import { getAllCocktails, getSpiritData } from '@/lib/data';
import CocktailCard from '@/components/CocktailCard';
import AdUnit from '@/components/AdUnit';
import RandomizerButton from '@/components/RandomizerButton';
import SpiritGrid from '@/components/SpiritGrid';



export default function HomePage() {
  const allCocktails = getAllCocktails();
  const spirits = getSpiritData();

  // Featured cocktails - pick diverse ones
  const featured = allCocktails
    .filter(c => c.imageUrl)
    .sort(() => 0.5 - Math.random())
    .slice(0, 6);

  // Top spirits by count
  const topSpirits = spirits
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            🌍 Over {allCocktails.length} Cocktails to Discover
          </div>
          <h1>
            Discover <span className="highlight">Cocktails</span> From
            Around the World
          </h1>
          <p>
            Explore an extraordinary collection of cocktail recipes from every
            corner of the globe. Find your next favorite drink by spirit
            or taste.
          </p>
          <div className="hero-actions">
            <Link href="/explore" className="btn btn-primary">
              Explore All Cocktails
            </Link>
            <RandomizerButton cocktails={allCocktails} />
          </div>
        </div>
      </section>



      {/* Featured Cocktails Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Handpicked for You</span>
            <h2 className="section-title">Featured Cocktails</h2>
            <p className="section-subtitle">
              A curated selection of our finest cocktails. Classic recipes
              reimagined for the modern palate.
            </p>
          </div>

          <div className="cocktail-grid">
            {featured.map((cocktail, i) => (
              <Fragment key={cocktail.id}>
                {i === 2 && (
                  <AdUnit
                    key="featured-ad"
                    slot="5287500865"
                    format="auto"
                    className="cocktail-card animate-in"
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      overflow: 'hidden',
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--bg-tertiary)',
                      minHeight: '300px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  />
                )}
                <CocktailCard cocktail={cocktail} index={i > 1 ? i + 1 : i} />
              </Fragment>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
            <Link href="/explore" className="btn btn-secondary">
              View All {allCocktails.length} Cocktails →
            </Link>
          </div>
        </div>
      </section>

      {/* Spirits Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Browse by Spirit</span>
            <h2 className="section-title">Choose Your Spirit</h2>
            <p className="section-subtitle">
              From smooth vodka to bold whiskey — find cocktails crafted around
              your favorite spirit.
            </p>
          </div>

          <SpiritGrid spirits={topSpirits} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: 'var(--gradient-hero)', textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: 'var(--space-md)' }}>
            Can&apos;t Decide?
          </h2>
          <p className="section-subtitle" style={{ marginBottom: 'var(--space-2xl)' }}>
            Let fate choose your next cocktail. Click the button and discover
            something new tonight.
          </p>
          <RandomizerButton cocktails={allCocktails} />
        </div>
      </section>
    </>
  );
}
