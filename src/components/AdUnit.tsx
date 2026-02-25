'use client';

import { useEffect, useRef } from 'react';

interface AdUnitProps {
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
    layout?: string;
    className?: string;
    style?: React.CSSProperties;
}

export default function AdUnit({
    slot,
    format = 'auto',
    layout,
    className,
    style,
}: AdUnitProps) {
    const adRef = useRef<HTMLModElement>(null);
    const pushed = useRef(false);

    useEffect(() => {
        if (pushed.current) return;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            pushed.current = true;
        } catch (e) {
            console.error('AdSense push error:', e);
        }
    }, []);

    return (
        <div className={className} style={style}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: '100%' }}
                data-ad-client="ca-pub-8366980911492709"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
                {...(layout ? { 'data-ad-layout': layout } : {})}
            />
        </div>
    );
}
