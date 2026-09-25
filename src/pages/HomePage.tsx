import { Cake, ShoppingCart, Search, Heart, Award, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, type Product } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import type { AppView } from '@/types';

type Props = {
  navigate: (v: AppView) => void;
};

export function HomePage({ navigate }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .limit(8)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts(data as Product[] ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-rose-50">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-rose-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <span className="inline-block bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                Confeitaria Artesanal
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Cupcakes feitos com <span className="text-rose-600">amor</span> em cada mordida
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Delicie-se com nossos cupcakes artesanais, preparados diariamente com ingredientes selecionados e muito carinho. Sabores que derretem na boca.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate('catalog')} className="btn-primary flex items-center gap-2">
                  <Search className="w-5 h-5" /> Ver Catálogo
                </button>
                <button onClick={() => navigate('cart')} className="btn-secondary flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Meu Carrinho
                </button>
              </div>
            </div>
            <div className="relative animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img src="https://images.pexels.com/photos/23221029/pexels-photo-23221029.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Cupcake de chocolate" className="rounded-2xl shadow-lg w-full h-48 object-cover" />
                  <img src="https://images.pexels.com/photos/1055270/pexels-photo-1055270.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Cupcake de morango" className="rounded-2xl shadow-lg w-full h-40 object-cover" />
                </div>
                <div className="space-y-4 pt-8">
                  <img src="https://images.pexels.com/photos/8874015/pexels-photo-8874015.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Red velvet" className="rounded-2xl shadow-lg w-full h-40 object-cover" />
                  <img src="https://images.pexels.com/photos/8874017/pexels-photo-8874017.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Cupcake elegante" className="rounded-2xl shadow-lg w-full h-48 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Heart, title: 'Feito com Amor', desc: 'Cada cupcake é preparado com dedicação e ingredientes de qualidade.' },
            { icon: Award, title: 'Premium', desc: 'Receitas exclusivas e ingredientes selecionados para uma experiência única.' },
            { icon: Truck, title: 'Entrega Rápida', desc: 'Entregamos fresquinho até sua porta em todo São Paulo.' },
          ].map((f, i) => (
            <div key={i} className="card p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Destaques da Casa</h2>
            <p className="text-gray-500 mt-1">Nossos cupcakes mais pedidos</p>
          </div>
          <button onClick={() => navigate('catalog')} className="btn-ghost text-sm flex items-center gap-1">
            Ver todos →
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
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
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Cake className="w-48 h-48" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 relative">Pronto para se deliciar?</h2>
          <p className="mb-6 text-rose-50 relative max-w-xl mx-auto">
            Explore nosso catálogo completo e encontre o cupcake perfeito para cada momento.
          </p>
          <button onClick={() => navigate('catalog')} className="bg-white text-rose-600 px-8 py-3 rounded-xl font-semibold hover:bg-rose-50 transition-all active:scale-95 relative">
            Explorar Catálogo
          </button>
        </div>
      </section>
    </div>
  );
}
