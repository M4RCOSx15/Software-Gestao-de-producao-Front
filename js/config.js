/**
 * Configuração global do front-end ProdManager.
 *
 * IMPORTANTE: ajuste API_BASE_URL para o endereço/porta onde o back-end
 * Spring Boot está rodando (por padrão, uma aplicação Spring Boot sobe em
 * http://localhost:8080).
 *
 * O bug do "erro 405 + tela branca" ao registrar/logar acontecia porque os
 * formulários faziam <form action="/auth/register" method="POST">, o que
 * faz o PRÓPRIO NAVEGADOR enviar a requisição para o servidor que está
 * servindo o HTML (ex: Live Server em http://127.0.0.1:5500), e não para o
 * back-end. Como esse servidor estático não tem rota POST /auth/register,
 * ele responde 405 (Method Not Allowed) e o navegador navega para essa
 * resposta em branco. A partir de agora todas as chamadas usam fetch()
 * apontando explicitamente para API_BASE_URL.
 */
const API_BASE_URL = 'https://software-gestao-de-producao.onrender.com';
