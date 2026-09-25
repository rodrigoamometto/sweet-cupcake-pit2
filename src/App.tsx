import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import type { AppView } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { RecoveryPage } from '@/pages/RecoveryPage';
import { CatalogPage } from '@/pages/CatalogPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { AdminPage } from '@/pages/AdminPage';
import { ProfilePage } from '@/pages/ProfilePage';

function AppContent() {
  const [view, setView] = useState<AppView>('home');
  const { user, loading } = useAuth();

  const navigate = useCallback((v: AppView) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!loading && !user && (view === 'orders' || view === 'admin' || view === 'checkout' || view === 'profile')) {
      navigate('login');
    }
    if (!loading && user && view === 'admin') {
      // admin access checked in AdminPage
    }
  }, [loading, user, view, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50/30">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
          <p className="text-rose-600 font-medium">Carregando Sweet Cupcake...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-rose-50/30">
      <Navbar view={view} navigate={navigate} />
      <main className="flex-1">
        {view === 'home' && <HomePage navigate={navigate} />}
        {view === 'login' && <LoginPage navigate={navigate} />}
        {view === 'register' && <RegisterPage navigate={navigate} />}
        {view === 'recovery' && <RecoveryPage navigate={navigate} />}
        {view === 'catalog' && <CatalogPage navigate={navigate} />}
        {view === 'cart' && <CartPage navigate={navigate} />}
        {view === 'checkout' && <CheckoutPage navigate={navigate} />}
        {view === 'orders' && <OrdersPage navigate={navigate} />}
        {view === 'admin' && <AdminPage navigate={navigate} />}
        {view === 'profile' && <ProfilePage navigate={navigate} />}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
