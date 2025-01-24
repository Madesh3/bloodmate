import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { DonorsProvider } from './context/DonorsContext';

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

const app = (
  <DonorsProvider>
    <App />
  </DonorsProvider>
);

createRoot(root).render(app);