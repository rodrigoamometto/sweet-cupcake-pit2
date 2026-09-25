import { useEffect, useState } from 'react';
import { ClipboardList, Package, ChevronDown, ChevronUp, Calendar, Truck } from 'lucide-react';
import { supabase, type Order, type OrderItem } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { AppView } from '@/types';

type Props = {
  navigate: (v: AppView) => void;
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pendente: { label: 'Pendente', color: 'text-amber-700', bg: 'bg-amber-100' },
  pago: { label: 'Pago', color: 'text-blue-700', bg: 'bg-blue-100' },
  preparando: { label: 'Preparando', color: 'text-purple-700', bg: 'bg-purple-100' },
  entregue: { label: 'Entregue', color: 'text-green-700', bg: 'bg-green-100' },
  cancelado: { label: 'Cancelado', color: 'text-red-700', bg: 'bg-red-100' },
};

export function OrdersPage({ navigate }: Props) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [itemsMap, setItemsMap] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const orderList = orderData as Order[] ?? [];
      setOrders(orderList);

      if (orderList.length > 0) {
        const { data: itemData } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', orderList.map((o) => o.id));

        const map: Record<string, OrderItem[]> = {};
        (itemData as OrderItem[] ?? []).forEach((item) => {
          if (!map[item.order_id]) map[item.order_id] = [];
          map[item.order_id].push(item);
        });
        setItemsMap(map);
      }
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ClipboardList className="w-12 h-12 text-rose-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nenhum pedido ainda</h1>
        <p className="text-gray-500 mb-8">Faça seu primeiro pedido e ele aparecerá aqui.</p>
        <button onClick={() => navigate('catalog')} className="btn-primary">Explorar Catálogo</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Pedidos</h1>
      <p className="text-gray-500 mb-8">{orders.length} pedido{orders.length !== 1 ? 's' : ''} realizado{orders.length !== 1 ? 's' : ''}</p>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusConfig[order.status] ?? statusConfig.pendente;
          const items = itemsMap[order.id] ?? [];
          const isExpanded = expanded === order.id;

          return (
            <div key={order.id} className="card overflow-hidden animate-fade-in">
              <button
                onClick={() => setExpanded(isExpanded ? null : order.id)}
                className="w-full p-5 flex items-center gap-4 text-left hover:bg-rose-50/30 transition-colors"
              >
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-rose-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-900">Pedido #{order.id.slice(0, 8)}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                    <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-lg font-bold text-rose-600">R$ {Number(order.total).toFixed(2).replace('.', ',')}</span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400 ml-2 inline" /> : <ChevronDown className="w-5 h-5 text-gray-400 ml-2 inline" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 p-5 animate-fade-in">
                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.quantity}x {item.product_name}</span>
                        <span className="text-gray-900 font-medium">R$ {(Number(item.unit_price) * item.quantity).toFixed(2).replace('.', ',')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1 flex items-center gap-1"><Truck className="w-4 h-4" /> Entrega</p>
                      <p className="text-gray-700">{order.delivery_address}</p>
                      {order.notes && <p className="text-gray-500 mt-1 italic">Obs: {order.notes}</p>}
                    </div>
                    <div className="sm:text-right">
                      <p className="text-gray-400 mb-1">Total</p>
                      <p className="text-xl font-bold text-rose-600">R$ {Number(order.total).toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
