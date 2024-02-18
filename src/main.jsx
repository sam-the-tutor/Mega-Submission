import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

const queryClient = new QueryClient();

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       gcTime: 1000 * 60 * 60 * 24, // 24 hours
//     },
//   },
// });

// const asyncStoragePersister = createAsyncStoragePersister({
//   storage: AsyncStorage,
// });

// const sessionStoragePersister = createSyncStoragePersister({ storage: window.sessionStorage })

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* <PersistQueryClientProvider
      client={queryClient}
      // persistOptions={{ persister: asyncStoragePersister }}
    > */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    {/* </PersistQueryClientProvider> */}
  </BrowserRouter>,
);
