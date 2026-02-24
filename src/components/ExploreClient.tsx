'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Cocktail, FilterState, Spirit, TasteProfile, PrepMethod } from '@/lib/types';
import { ALL_SPIRITS, ALL_TASTES, ALL_METHODS } from '@/lib/types';
import CocktailCard from '@/components/CocktailCard';

interface Props {
    cocktails: Cocktail[];
}

export default function ExploreClient({ cocktails }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<FilterState>({
        spirits: [],
        tastes: [],
        methods: [],
        search: '',
    });

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Handle random redirect
    useEffect(() => {
        if (searchParams.get('random') === 'true' && cocktails.length > 0) {
            const random = cocktails[Math.floor(Math.random() * cocktails.length)];
            router.replace(`/cocktails/${random.slug}`);
        }
    }, [searchParams, cocktails, router]);

    // Apply filters
    const filteredCocktails = useMemo(() => {
        let result = cocktails;

        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.ingredients.some(i => i.name.toLowerCase().includes(q))
            );
        }

        if (filters.spirits.length > 0) {
            result = result.filter(c =>
                filters.spirits.includes(c.primarySpirit) ||
                (c.secondarySpirit && filters.spirits.includes(c.secondarySpirit))
            );
        }

        if (filters.tastes.length > 0) {
            result = result.filter(c =>
                c.tasteTags.some(t => filters.tastes.includes(t))
            );
        }

        if (filters.methods.length > 0) {
            result = result.filter(c => filters.methods.includes(c.prepMethod));
        }

        return result;
    }, [cocktails, filters]);

    const toggleFilter = <T extends string>(
        category: keyof FilterState,
        value: T
    ) => {
        setFilters(prev => {
            const arr = prev[category] as T[];
            const newArr = arr.includes(value)
                ? arr.filter(v => v !== value)
                : [...arr, value];
            return { ...prev, [category]: newArr };
        });
    };

    const clearAll = () => {
        setFilters({ spirits: [], tastes: [], methods: [], search: '' });
    };

    const hasFilters = filters.spirits.length || filters.tastes.length || filters.methods.length || filters.search;

    // Count cocktails per filter option
    const getCount = (category: string, value: string) => {
        return cocktails.filter(c => {
            if (category === 'spirit') return c.primarySpirit === value || c.secondarySpirit === value;
            if (category === 'taste') return c.tasteTags.includes(value as TasteProfile);
            if (category === 'method') return c.prepMethod === value;
            return false;
        }).length;
    };

    return (
        <>
            {/* Search + Active Filters */}
            <div style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="search-bar" style={{ marginBottom: 'var(--space-lg)', maxWidth: '100%' }}>
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search cocktails, ingredients, spirits..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                </div>

                {hasFilters ? (
                    <div className="active-filters">
                        {filters.spirits.map(s => (
                            <button key={s} className="active-filter-chip" onClick={() => toggleFilter('spirits', s)}>
                                {s} <span className="remove">×</span>
                            </button>
                        ))}
                        {filters.tastes.map(t => (
                            <button key={t} className="active-filter-chip" onClick={() => toggleFilter('tastes', t)}>
                                {t} <span className="remove">×</span>
                            </button>
                        ))}
                        {filters.methods.map(m => (
                            <button key={m} className="active-filter-chip" onClick={() => toggleFilter('methods', m)}>
                                {m} <span className="remove">×</span>
                            </button>
                        ))}
                        <button className="clear-all-btn" onClick={clearAll}>
                            Clear all
                        </button>
                    </div>
                ) : null}
            </div>

            {/* Mobile filter toggle */}
            <button
                className="btn btn-secondary"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                style={{
                    display: 'none',
                    marginBottom: 'var(--space-lg)',
                    width: '100%',
                }}
                id="mobile-filter-toggle"
            >
                🎛️ {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
            </button>

            <style>{`
        @media (max-width: 768px) {
          #mobile-filter-toggle { display: flex !important; justify-content: center; }
          .filter-panel { display: ${mobileFiltersOpen ? 'block' : 'none'} !important; }
        }
      `}</style>

            <div className="explore-layout">
                {/* Filter Panel */}
                <aside className="filter-panel">
                    <FilterGroup
                        title="Spirit"
                        options={ALL_SPIRITS.filter(s => getCount('spirit', s) > 0)}
                        selected={filters.spirits}
                        category="spirit"
                        onToggle={(v) => toggleFilter('spirits', v as Spirit)}
                        getCount={getCount}
                    />
                    <FilterGroup
                        title="Taste"
                        options={ALL_TASTES}
                        selected={filters.tastes}
                        category="taste"
                        onToggle={(v) => toggleFilter('tastes', v as TasteProfile)}
                        getCount={getCount}
                    />
                    <FilterGroup
                        title="Method"
                        options={ALL_METHODS}
                        selected={filters.methods}
                        category="method"
                        onToggle={(v) => toggleFilter('methods', v as PrepMethod)}
                        getCount={getCount}
                    />
                </aside>

                {/* Results */}
                <div>
                    <p className="result-count">
                        Showing <strong>{filteredCocktails.length}</strong> cocktail{filteredCocktails.length !== 1 ? 's' : ''}
                    </p>

                    {filteredCocktails.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🍹</div>
                            <h3>No Cocktails Match</h3>
                            <p>Try adjusting your filters or search terms to find more cocktails.</p>
                            <button className="btn btn-secondary" onClick={clearAll} style={{ marginTop: 'var(--space-lg)' }}>
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="cocktail-grid">
                            {filteredCocktails.map((cocktail, i) => (
                                <CocktailCard key={cocktail.id} cocktail={cocktail} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// Filter Group component
function FilterGroup({
    title,
    options,
    selected,
    category,
    onToggle,
    getCount,
}: {
    title: string;
    options: string[];
    selected: string[];
    category: string;
    onToggle: (value: string) => void;
    getCount: (category: string, value: string) => number;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="filter-group">
            <button
                type="button"
                className="filter-group-title"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: 'inherit',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    margin: 0,
                    marginBottom: isOpen ? 'var(--space-md)' : 0
                }}
            >
                {title}
                <span style={{ fontSize: '0.8em', opacity: 0.6 }}>{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
                    {options.map(option => {
                        const count = getCount(category, option);
                        return (
                            <label key={option} className="filter-option">
                                <input
                                    type="checkbox"
                                    className="filter-checkbox"
                                    checked={selected.includes(option)}
                                    onChange={() => onToggle(option)}
                                />
                                <span className="filter-label">{option}</span>
                                <span className="filter-count">{count}</span>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
