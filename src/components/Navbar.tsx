import { Cake, ShoppingCart, User as UserIcon, LogOut, ClipboardList, LayoutDashboard, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import type { AppView } from '@/types';
import { useState } from 'react';

type Props = {
  view: AppView;
  navigate: (v: AppView) => void;
};

export function Navbar({ view, navigate }: Props) {
  const { user, isAdmin, signOut, profile } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (v: AppView) => {
    navigate(v);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Cake className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-gray-900 leading-none">Sweet Cupcake</h1>
              <p className="text-xs text-rose-500 leading-none mt-0.5">Confeitaria Artesanal</p>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <button onClick={() => handleNav('home')} className={`btn-ghost text-sm ${view === 'home' ? 'text-rose-600 bg-rose-50' : ''}`}>Início</button>
            <button onClick={() => handleNav('catalog')} className={`btn-ghost text-sm ${view === 'catalog' ? 'text-rose-600 bg-rose-50' : ''}`}>Catálogo</button>
            {user && (
              <button onClick={() => handleNav('orders')} className={`btn-ghost text-sm ${view === 'orders' ? 'text-rose-600 bg-rose-50' : ''}`}>Meus Pedidos</button>
            )}
            {isAdmin && (
              <button onClick={() => handleNav('admin')} className={`btn-ghost text-sm ${view === 'admin' ? 'text-rose-600 bg-rose-50' : ''}`}>Administração</button>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => handleNav('catalog')} className="btn-ghost hidden sm:flex" aria-label="Buscar">
              <Search className="w-5 h-5" />
            </button>

            <button onClick={() => handleNav('cart')} className="relative btn-ghost" aria-label="Carrinho">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-fade-in">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 btn-ghost"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{profile?.full_name?.split(' ')[0] ?? 'Usuário'}</span>
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
                      <button onClick={() => handleNav('profile')} className="w-full px-4 py-2.5 text-left text-sm hover:bg-rose-50 flex items-center gap-3 text-gray-700">
                        <UserIcon className="w-4 h-4" /> Meu Perfil
                      </button>
                      <button onClick={() => handleNav('orders')} className="w-full px-4 py-2.5 text-left text-sm hover:bg-rose-50 flex items-center gap-3 text-gray-700">
                        <ClipboardList className="w-4 h-4" /> Meus Pedidos
                      </button>
                      {isAdmin && (
                        <button onClick={() => handleNav('admin')} className="w-full px-4 py-2.5 text-left text-sm hover:bg-rose-50 flex items-center gap-3 text-gray-700">
                          <LayoutDashboard className="w-4 h-4" /> Administração
                        </button>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button onClick={() => { signOut(); handleNav('home'); }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-rose-50 flex items-center gap-3 text-rose-600">
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={() => handleNav('login')} className="btn-primary text-sm hidden sm:flex">
                Entrar
              </button>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden btn-ghost">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-rose-100 animate-fade-in">
            <button onClick={() => handleNav('home')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-rose-50 rounded-lg">Início</button>
            <button onClick={() => handleNav('catalog')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-rose-50 rounded-lg">Catálogo</button>
            {user && <button onClick={() => handleNav('orders')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-rose-50 rounded-lg">Meus Pedidos</button>}
            {isAdmin && <button onClick={() => handleNav('admin')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-rose-50 rounded-lg">Administração</button>}
            {!user && <button onClick={() => handleNav('login')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-rose-50 rounded-lg text-rose-600 font-medium">Entrar</button>}
          </div>
        )}
      </div>
    </header>
  );
}
