import Link from 'next/link';
import { ALL_SPIRITS, SPIRIT_SLUGS } from '@/lib/types';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <div className="footer-brand">
                            🍸 Cocktails <span>Worldwide</span>
                        </div>
                        <p className="footer-text">
                            Discover cocktails by your favorite spirit. From smooth vodka martinis to bold whiskey sours,
                            explore the world one sip at a time.
                        </p>
                    </div>

                    <div>
                        <h4 className="footer-heading">Top Spirits</h4>
                        <ul className="footer-links">
                            {ALL_SPIRITS.slice(0, 7).map(spirit => (
                                <li key={spirit}>
                                    <Link href={`/spirit/${SPIRIT_SLUGS[spirit]}`}>{spirit}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer-heading">Discover</h4>
                        <ul className="footer-links">
                            <li><Link href="/explore">Explore All</Link></li>
                            <li><Link href="/taste/sweet">Sweet Cocktails</Link></li>
                            <li><Link href="/taste/refreshing">Refreshing</Link></li>
                            <li><Link href="/taste/bitter">Bitter & Bold</Link></li>
                            <li><Link href="/taste/fruity">Fruity</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Cocktails From Around the World. All rights reserved.</p>
                    <p>
                        Data provided by{' '}
                        <a href="https://www.thecocktaildb.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>
                            TheCocktailDB
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
