export type CartItem = {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
  quantity: number;
};

export type AppView =
  | 'home'
  | 'login'
  | 'register'
  | 'recovery'
  | 'catalog'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'admin'
  | 'profile';
