import Link from 'next/link';
import type { Cocktail } from '@/lib/types';

interface Props {
    cocktail: Cocktail;
    index?: number;
}

export default function CocktailCard({ cocktail, index = 0 }: Props) {
    return (
        <Link href={`/cocktails/${cocktail.slug}`}>
            <article
                className="cocktail-card animate-in"
                style={{ animationDelay: `${index * 0.05}s` }}
            >
                <div className="cocktail-card-image">
                    {cocktail.imageUrl ? (
                        <img
                            src={cocktail.imageUrl}
                            alt={cocktail.name}
                            loading="lazy"
                            width={400}
                            height={300}
                        />
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'var(--bg-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                        }}>
                            🍸
                        </div>
                    )}
                </div>

                <div className="cocktail-card-body">
                    <h3 className="cocktail-card-title">{cocktail.name}</h3>

                    <div className="cocktail-card-meta">
                        <span className="spirit">{cocktail.primarySpirit}</span>
                    </div>

                    <div className="cocktail-card-tags">
                        <span className="tag tag-method">{cocktail.prepMethod}</span>
                        {cocktail.tasteTags.slice(0, 2).map(taste => (
                            <span key={taste} className="tag tag-taste">{taste}</span>
                        ))}
                    </div>
                </div>
            </article>
        </Link>
    );
}
