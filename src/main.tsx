import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { I18nProvider } from './lib/i18n';
import { FirebaseProvider } from './components/FirebaseProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
    </I18nProvider>
  </StrictMode>,
);
