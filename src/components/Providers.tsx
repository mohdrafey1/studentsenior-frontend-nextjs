'use client';

import IdentifyBridge from '@/analytics/IdentifyBridge';
import { useState } from 'react';
import { store, persistor } from '@/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { UserInitProvider } from './AuthCheck';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [authReady, setAuthReady] = useState(false);
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <UserInitProvider onReady={setAuthReady} />
                {authReady && <IdentifyBridge />}
                {children}
            </PersistGate>
        </Provider>
    );
}
