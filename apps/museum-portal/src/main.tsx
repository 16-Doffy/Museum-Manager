import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './lib/utils/debug';

createRoot(document.getElementById('root')!).render(<App />);
