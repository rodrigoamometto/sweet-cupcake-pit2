import { Plus, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/supabase';
import { useState } from 'react';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image_url: product.image_url });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="card group hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="relative h-56 overflow-hidden bg-rose-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-rose-300 text-4xl">🧁</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-rose-600">
          {product.category}
        </span>
        {!product.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm">Esgotado</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-xs text-gray-400 ml-1">(5.0)</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-rose-600">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          <button
            onClick={handleAdd}
            disabled={!product.available || added}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-rose-600 text-white hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
            }`}
            aria-label="Adicionar ao carrinho"
          >
            {added ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
