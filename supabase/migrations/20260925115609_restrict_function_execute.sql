/*
# Restringir execução de funções SECURITY DEFINER

As funções is_admin() e handle_new_user() são SECURITY DEFINER e estavam
acessíveis via API REST por qualquer role. Como is_admin() só é usada
internamente em policies RLS e handle_new_user() só é usada como trigger,
revoke EXECUTE de anon e authenticated para ambas.

1. Segurança
- REVOKE EXECUTE on is_admin() FROM anon, authenticated
- REVOKE EXECUTE on handle_new_user() FROM anon, authenticated
*/

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;