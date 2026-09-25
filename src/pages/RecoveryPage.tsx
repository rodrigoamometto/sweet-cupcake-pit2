import { useState } from 'react';
import { Cake, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { AppView } from '@/types';

type Props = {
  navigate: (v: AppView) => void;
};

export function RecoveryPage({ navigate }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-rose-100/50 to-pink-50/50">
      <div className="w-full max-w-md animate-slide-up">
        <button onClick={() => navigate('login')} className="btn-ghost text-sm mb-6 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Voltar ao login
        </button>

        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Cake className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Recuperar Senha</h1>
            <p className="text-gray-500 mt-1">Enviaremos um link para redefinir sua senha</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 animate-fade-in">
              {error}
            </div>
          )}

          {sent ? (
            <div className="text-center py-8 animate-fade-in">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">E-mail enviado!</h3>
              <p className="text-sm text-gray-500 mb-6">
                Verifique sua caixa de entrada em <strong>{email}</strong> e siga as instruções para redefinir sua senha.
              </p>
              <button onClick={() => navigate('login')} className="btn-primary">
                Voltar ao Login
              </button>
            </div>
          ) : (
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

              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            Lembrou a senha?{' '}
            <button onClick={() => navigate('login')} className="text-rose-600 hover:text-rose-700 font-medium">
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
