import { useState } from 'react';
import { Cake, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { AppView } from '@/types';

type Props = {
  navigate: (v: AppView) => void;
};

export function LoginPage({ navigate }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'E-mail ou senha incorretos.'
        : error.message);
      setLoading(false);
    } else {
      navigate('home');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-rose-100/50 to-pink-50/50">
      <div className="w-full max-w-md animate-slide-up">
        <button onClick={() => navigate('home')} className="btn-ghost text-sm mb-6 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Voltar ao início
        </button>

        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Cake className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h1>
            <p className="text-gray-500 mt-1">Entre na sua conta para continuar</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11 pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={() => navigate('recovery')} className="text-sm text-rose-600 hover:text-rose-700 font-medium">
                Esqueceu a senha?
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Não tem uma conta?{' '}
            <button onClick={() => navigate('register')} className="text-rose-600 hover:text-rose-700 font-medium">
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
