import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import AppRoutes from './routes/AppRoutes.jsx';

/**
 * Root component. AuthProvider wraps CartProvider (the cart depends on auth).
 * ErrorBoundary keeps a render error in one page from blanking the whole app.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
