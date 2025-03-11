import React from 'react';
import ReactDOM from 'react-dom/client';
import './output.css';
import './index.css'
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
);
