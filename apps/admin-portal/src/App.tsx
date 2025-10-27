import { Toaster } from 'sonner';
import { AppProvider } from './providers';
import AppRoutes from './routes';

function App() {
  return (
    <AppProvider>
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </AppProvider>
  );
}

export default App;

