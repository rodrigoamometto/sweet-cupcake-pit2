import { Cake, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import type { AppView } from '@/types';

type Props = {
  navigate: (v: AppView) => void;
};

export function Footer({ navigate }: Props) {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-600 rounded-xl flex items-center justify-center">
                <Cake className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Sweet Cupcake</h3>
                <p className="text-xs text-rose-400">Confeitaria Artesanal</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Cupcakes artesanais feitos com ingredientes selecionados e muito amor. Satisfação em cada mordida.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('home')} className="hover:text-rose-400 transition-colors">Início</button></li>
              <li><button onClick={() => navigate('catalog')} className="hover:text-rose-400 transition-colors">Catálogo</button></li>
              <li><button onClick={() => navigate('cart')} className="hover:text-rose-400 transition-colors">Carrinho</button></li>
              <li><button onClick={() => navigate('orders')} className="hover:text-rose-400 transition-colors">Meus Pedidos</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-rose-400" /> (11) 4002-8922</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-rose-400" /> contato@sweetcupcake.com.br</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-400" /> Rua das Flores, 123 - São Paulo</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Siga-nos</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Sweet Cupcake. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
