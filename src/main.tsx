import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { Provider } from "@/components/ui/provider";
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <BrowserRouter basename="/SUKOON/">  {/* Specify base path for React Router */}
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);


