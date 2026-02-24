'use client';

import Link from 'next/link';

interface SpiritItem {
    name: string;
    slug: string;
    count: number;
}

interface Props {
    spirits: SpiritItem[];
}

export default function SpiritGrid({ spirits }: Props) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 'var(--space-md)',
        }}>
            {spirits.map((spirit, i) => (
                <Link
                    key={spirit.name}
                    href={`/spirit/${spirit.slug}`}
                    className="animate-in"
                    style={{
                        animationDelay: `${i * 0.06}s`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        padding: 'var(--space-xl)',
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-subtle)',
                        transition: 'all var(--transition-base)',
                        textAlign: 'center',
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                >
                    <span style={{ fontSize: 'var(--fs-lg)', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                        {spirit.name}
                    </span>
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                        {spirit.count} cocktails
                    </span>
                </Link>
            ))}
        </div>
    );
}
