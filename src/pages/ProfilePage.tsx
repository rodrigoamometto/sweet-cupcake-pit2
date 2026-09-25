import { useState } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { AppView } from '@/types';

type Props = {
  navigate: (v: AppView) => void;
};

export function ProfilePage({ navigate }: Props) {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [address, setAddress] = useState(profile?.address ?? '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase
      .from('profiles')
      .update({ full_name: fullName, phone, address })
      .eq('id', user!.id);
    await refreshProfile();
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
      <p className="text-gray-500 mb-8">Gerencie suas informações pessoais</p>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{profile?.full_name ?? 'Usuário'}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${profile?.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
              {profile?.role === 'admin' ? 'Administrador' : 'Cliente'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome Completo</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field pl-11" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" value={user?.email ?? ''} disabled className="input-field pl-11 bg-gray-50 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field pl-11" placeholder="(11) 99999-9999" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Endereço</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="input-field pl-11" placeholder="Rua, número, bairro, cidade" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {saved ? <><CheckCircle className="w-5 h-5" /> Salvo!</> : <><Save className="w-5 h-5" /> {loading ? 'Salvando...' : 'Salvar Alterações'}</>}
          </button>
          <button type="button" onClick={() => navigate('orders')} className="btn-secondary">Meus Pedidos</button>
        </div>
      </form>
    </div>
  );
}
