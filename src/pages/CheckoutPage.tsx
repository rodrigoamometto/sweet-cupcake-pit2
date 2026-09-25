import { useState } from 'react';
import { CreditCard, MapPin, User as UserIcon, Phone, CheckCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { AppView } from '@/types';

type Props = {
  navigate: (v: AppView) => void;
};

export function CheckoutPage({ navigate }: Props) {
  const { items, totalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [customerName, setCustomerName] = useState(profile?.full_name ?? '');
  const [customerPhone, setCustomerPhone] = useState(profile?.phone ?? '');
  const [deliveryAddress, setDeliveryAddress] = useState(profile?.address ?? '');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      setError('Você precisa estar logado para finalizar a compra.');
      setLoading(false);
      return;
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total: totalPrice,
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        notes,
        status: 'pendente',
      })
      .select()
      .single();

    if (orderError) {
      setError('Erro ao criar pedido: ' + orderError.message);
      setLoading(false);
      return;
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      setError('Erro ao salvar itens do pedido: ' + itemsError.message);
      setLoading(false);
      return;
    }

    clearCart();
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Pedido Realizado!</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Seu pedido foi recebido com sucesso e está sendo processado. Em breve você receberá a confirmação por e-mail.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('orders')} className="btn-primary">
            Ver Meus Pedidos
          </button>
          <button onClick={() => navigate('catalog')} className="btn-secondary">
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-rose-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Carrinho vazio</h1>
        <p className="text-gray-500 mb-8">Adicione produtos ao carrinho antes de finalizar a compra.</p>
        <button onClick={() => navigate('catalog')} className="btn-primary">Explorar Catálogo</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery info */}
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-600" /> Dados de Entrega
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="input-field pl-11" placeholder="Seu nome" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="tel" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="input-field pl-11" placeholder="(11) 99999-9999" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Endereço de Entrega</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" required value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="input-field pl-11" placeholder="Rua, número, bairro, cidade" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Observações (opcional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field" rows={3} placeholder="Alguma instrução especial para a entrega?" />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-rose-600" /> Forma de Pagamento
            </h2>
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-sm text-gray-600">
              <p className="font-medium text-gray-700 mb-1">Pagamento na Entrega</p>
              <p>Pague em dinheiro ou cartão no momento da entrega. Frete grátis para todo São Paulo.</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="text-lg font-bold mb-4">Seu Pedido</h2>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 flex-1 truncate pr-2">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="text-gray-900 font-medium whitespace-nowrap">
                    R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Entrega</span>
                <span className="text-green-600 font-medium">Grátis</span>
              </div>
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-rose-600">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
