'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Cocktail } from '@/lib/types';

interface Props {
    cocktails: Cocktail[];
}

export default function RandomizerButton({ cocktails }: Props) {
    const router = useRouter();
    const [shaking, setShaking] = useState(false);

    const handleShake = () => {
        if (shaking || cocktails.length === 0) return;

        setShaking(true);

        setTimeout(() => {
            const random = cocktails[Math.floor(Math.random() * cocktails.length)];
            router.push(`/cocktails/${random.slug}`);
            setShaking(false);
        }, 650);
    };

    return (
        <button
            className={`shake-btn${shaking ? ' shaking' : ''}`}
            onClick={handleShake}
            disabled={shaking}
        >
            🎲 {shaking ? 'Shaking...' : 'Shake My Night'}
        </button>
    );
}
