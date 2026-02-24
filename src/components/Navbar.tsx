'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        { href: '/explore', label: 'Explore' },
        { href: '/spirit/gin', label: 'Spirits' },
        { href: '/taste/sweet', label: 'Tastes' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link href="/" className="navbar-logo">
                    🍸 Cocktails <span>Worldwide</span>
                </Link>

                <button
                    className="navbar-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    <span />
                    <span />
                    <span />
                </button>

                <ul className={`navbar-links${menuOpen ? ' open' : ''}`}>
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={pathname.startsWith(link.href) ? 'active' : ''}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link href="/explore?random=true" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.75rem' }}>
                            🎲 Shake My Night
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
