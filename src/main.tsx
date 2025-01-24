import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DonorsProvider } from './context/DonorsContext.tsx'

createRoot(document.getElementById("root")!).render(
  <DonorsProvider>
    <App />
  </DonorsProvider>
);