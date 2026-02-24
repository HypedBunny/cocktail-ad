import type { Metadata } from 'next';
import { getAllCocktails } from '@/lib/data';
import ExploreClient from '@/components/ExploreClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Explore Cocktails | Filter by Region, Spirit, Taste & Method',
    description:
        'Browse and filter 400+ cocktail recipes by region, spirit, taste profile, and preparation method. Find your perfect drink.',
};

export default function ExplorePage() {
    const cocktails = getAllCocktails();

    return (
        <>
            <section className="landing-hero">
                <div className="container">
                    <span className="section-label">Explore</span>
                    <h1>Find Your Perfect Cocktail</h1>
                    <p>
                        Browse our collection of {cocktails.length} cocktails. Use the filters
                        to narrow down by region, spirit, taste, or preparation method.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <Suspense fallback={<div>Loading...</div>}>
                        <ExploreClient cocktails={cocktails} />
                    </Suspense>
                </div>
            </section>
        </>
    );
}
