// app/components/MobileOnly.tsx
'use client';

import { useEffect, useState } from 'react';

export default function MobileOnly({ children }) {
    const [isMobile, setIsMobile] = useState(null);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)'); // md breakpoint
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener?.('change', update);
        return () => mq.removeEventListener?.('change', update);
    }, []);

    if (isMobile === null) return null; // avoid SSR flicker

    if (!isMobile) {
        return (
            <main style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: '24px', textAlign: 'center' }}>
                <div>
                    <h1 style={{ marginBottom: 12 }}>Mobile Only</h1>
                    <p>Please open this site on your phone.</p>
                </div>
            </main>
        );
    }

    return <>{children}</>;
}
