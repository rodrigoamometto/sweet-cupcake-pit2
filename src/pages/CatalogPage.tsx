import { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import type { AppView } from '@/types';

type Props = {
  navigate: (v: AppView) => void;
};

export function CatalogPage({ navigate }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts(data as Product[] ?? []);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ['Todas', ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    let result = products;
    if (category !== 'Todas') {
      result = result.filter((p) => p.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, category, search, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Cupcakes</h1>
        <p className="text-gray-500">Encontre o sabor perfeito para você</p>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
            placeholder="Buscar cupcakes por nome ou descrição..."
          />
        </div>
        <div className="flex gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field md:w-48"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="recent">Mais Recentes</option>
            <option value="price-low">Menor Preço</option>
            <option value="price-high">Maior Preço</option>
            <option value="name">Nome (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <SlidersHorizontal className="w-4 h-4" />
        <span>{filtered.length} produto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-56 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-8 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🧁</p>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum cupcake encontrado</h3>
          <p className="text-gray-500">Tente ajustar sua busca ou filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-12 text-center">
          <button onClick={() => navigate('cart')} className="btn-primary">
            Ver Carrinho
          </button>
        </div>
      )}
    </div>
  );
}
