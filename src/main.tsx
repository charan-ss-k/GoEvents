
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Remove StrictMode from here since we've added it to App.tsx
createRoot(document.getElementById("root")!).render(<App />);
