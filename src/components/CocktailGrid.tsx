import type { Cocktail } from '@/lib/types';
import CocktailCard from './CocktailCard';

interface Props {
    cocktails: Cocktail[];
    emptyMessage?: string;
}

export default function CocktailGrid({ cocktails, emptyMessage = 'No cocktails found' }: Props) {
    if (cocktails.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">🍹</div>
                <h3>No Cocktails Found</h3>
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="cocktail-grid">
            {cocktails.map((cocktail, i) => (
                <CocktailCard key={cocktail.id} cocktail={cocktail} index={i} />
            ))}
        </div>
    );
}
