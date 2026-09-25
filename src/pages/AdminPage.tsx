import { useEffect, useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Plus, Pencil, Trash2, X, DollarSign, Clock } from 'lucide-react';
import { supabase, type Product, type Order } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { AppView } from '@/types';

type Props = {
  navigate: (v: AppView) => void;
};

const statusOptions = ['pendente', 'pago', 'preparando', 'entregue', 'cancelado'];
const statusLabels: Record<string, string> = {
  pendente: 'Pendente',
  pago: 'Pago',
  preparando: 'Preparando',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};
const statusColors: Record<string, string> = {
  pendente: 'bg-amber-100 text-amber-700',
  pago: 'bg-blue-100 text-blue-700',
  preparando: 'bg-purple-100 text-purple-700',
  entregue: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
};

export function AdminPage({ navigate }: Props) {
  const { isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<'products' | 'orders' | 'stats'>('stats');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', image_url: '', category: 'Clássico', available: true });

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin]);

  async function loadData() {
    setDataLoading(true);
    const [{ data: p }, { data: o }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ]);
    setProducts(p as Product[] ?? []);
    setOrders(o as Order[] ?? []);
    setDataLoading(false);
  }

  function openModal(product?: Product) {
    if (product) {
      setEditingProduct(product);
      setForm({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image_url: product.image_url,
        category: product.category,
        available: product.available,
      });
    } else {
      setEditingProduct(null);
      setForm({ name: '', description: '', price: '', image_url: '', category: 'Clássico', available: true });
    }
    setShowModal(true);
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price) || 0,
      image_url: form.image_url,
      category: form.category,
      available: form.available,
    };

    if (editingProduct) {
      await supabase.from('products').update(payload).eq('id', editingProduct.id);
    } else {
      await supabase.from('products').insert(payload);
    }
    setShowModal(false);
    loadData();
  }

  async function deleteProduct(id: string) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    await supabase.from('products').delete().eq('id', id);
    loadData();
  }

  async function updateOrderStatus(orderId: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center"><div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <LayoutDashboard className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h1>
        <p className="text-gray-500 mb-8">Esta área é exclusiva para administradores.</p>
        <button onClick={() => navigate('home')} className="btn-primary">Voltar ao Início</button>
      </div>
    );
  }

  const totalRevenue = orders.filter((o) => o.status !== 'cancelado').reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pendente').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Painel Administrativo</h1>
        <p className="text-gray-500">Gerencie produtos e pedidos da Sweet Cupcake</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-100 w-fit">
        <button onClick={() => setTab('stats')} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'stats' ? 'bg-rose-600 text-white' : 'text-gray-600 hover:bg-rose-50'}`}>Estatísticas</button>
        <button onClick={() => setTab('products')} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'products' ? 'bg-rose-600 text-white' : 'text-gray-600 hover:bg-rose-50'}`}>Produtos</button>
        <button onClick={() => setTab('orders')} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'orders' ? 'bg-rose-600 text-white' : 'text-gray-600 hover:bg-rose-50'}`}>Pedidos</button>
      </div>

      {dataLoading ? (
        <div className="py-20 text-center"><div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto" /></div>
      ) : (
        <>
          {/* Stats */}
          {tab === 'stats' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { icon: DollarSign, label: 'Receita Total', value: `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`, color: 'text-green-600', bg: 'bg-green-100' },
                  { icon: ShoppingBag, label: 'Total de Pedidos', value: orders.length, color: 'text-blue-600', bg: 'bg-blue-100' },
                  { icon: Clock, label: 'Pedidos Pendentes', value: pendingOrders, color: 'text-amber-600', bg: 'bg-amber-100' },
                  { icon: Package, label: 'Produtos Ativos', value: products.filter((p) => p.available).length, color: 'text-rose-600', bg: 'bg-rose-100' },
                ].map((stat, i) => (
                  <div key={i} className="card p-6">
                    <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-bold mb-4">Pedidos Recentes</h2>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-medium text-sm text-gray-900">#{order.id.slice(0, 8)} - {order.customer_name}</p>
                        <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
                        <span className="font-semibold text-rose-600">R$ {Number(order.total).toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-gray-400 text-sm py-4">Nenhum pedido ainda.</p>}
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          {tab === 'products' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Gerenciar Produtos</h2>
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" /> Novo Produto
                </button>
              </div>
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium">Produto</th>
                      <th className="px-4 py-3 font-medium">Categoria</th>
                      <th className="px-4 py-3 font-medium">Preço</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-rose-50/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-rose-100 flex-shrink-0">
                              {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">🧁</div>}
                            </div>
                            <span className="font-medium text-gray-900">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{p.category}</td>
                        <td className="px-4 py-3 font-medium text-rose-600">R$ {Number(p.price).toFixed(2).replace('.', ',')}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${p.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {p.available ? 'Disponível' : 'Esgotado'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openModal(p)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteProduct(p.id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders */}
          {tab === 'orders' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold mb-4">Gerenciar Pedidos</h2>
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium">Pedido</th>
                      <th className="px-4 py-3 font-medium">Cliente</th>
                      <th className="px-4 py-3 font-medium">Data</th>
                      <th className="px-4 py-3 font-medium">Total</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-rose-50/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">#{order.id.slice(0, 8)}</td>
                        <td className="px-4 py-3">
                          <p className="text-gray-900">{order.customer_name}</p>
                          <p className="text-xs text-gray-400">{order.customer_phone}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{new Date(order.created_at).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 font-medium text-rose-600">R$ {Number(order.total).toFixed(2).replace('.', ',')}</td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border-0 cursor-pointer ${statusColors[order.status]}`}
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>{statusLabels[s]}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && <p className="text-gray-400 text-sm py-8 text-center">Nenhum pedido ainda.</p>}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Nome do cupcake" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} placeholder="Descrição do produto" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preço (R$)</label>
                  <input type="number" step="0.01" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria</label>
                  <input type="text" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" placeholder="Ex: Chocolate" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">URL da Imagem</label>
                <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" placeholder="https://..." />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="w-5 h-5 rounded text-rose-600 focus:ring-rose-400" />
                <span className="text-sm font-medium text-gray-700">Disponível para venda</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" className="btn-primary flex-1">{editingProduct ? 'Salvar' : 'Criar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
