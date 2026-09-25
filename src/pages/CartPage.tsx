import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { AppView } from '@/types';

type Props = {
  navigate: (v: AppView) => void;
};

export function CartPage({ navigate }: Props) {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-rose-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h1>
        <p className="text-gray-500 mb-8">Que tal explorar nosso catálogo e adicionar alguns cupcakes deliciosos?</p>
        <button onClick={() => navigate('catalog')} className="btn-primary">
          Explorar Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Carrinho de Compras</h1>
          <p className="text-gray-500">{totalItems} item{totalItems !== 1 ? 's' : ''} no carrinho</p>
        </div>
        <button onClick={clearCart} className="btn-ghost text-sm text-red-500 hover:text-red-600 hover:bg-red-50">
          Limpar carrinho
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="card p-4 flex items-center gap-4 animate-fade-in">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-rose-100 flex-shrink-0">
                {item.product.image_url ? (
                  <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🧁</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
                <p className="text-sm text-rose-600 font-medium">R$ {item.product.price.toFixed(2).replace('.', ',')}</p>
                <p className="text-xs text-gray-400">Subtotal: R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-rose-50 rounded-lg border border-rose-100">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-rose-600 hover:bg-rose-100 rounded-l-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-rose-600 hover:bg-rose-100 rounded-r-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Entrega</span>
                <span className="text-green-600 font-medium">Grátis</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-rose-600">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            <button onClick={() => navigate('checkout')} className="btn-primary w-full flex items-center justify-center gap-2">
              Finalizar Compra <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('catalog')} className="btn-ghost w-full text-center mt-3 text-sm">
              Continuar comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
