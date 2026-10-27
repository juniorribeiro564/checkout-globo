# Checkout Nexo

Checkout em Angular com três telas — **pagamento**, **sucesso** e **erro** — feito para o desafio frontend. O fluxo é a assinatura do plano Nexo Pro (R$ 79,90) com cartão de crédito, cartão de débito ou Pix. O processamento é simulado: não existe gateway real.

**Layout:** Tailwind CSS 4 + SCSS (detalhes em [Estilos](#estilos-tailwind--scss)).

## Stack

| | |
|---|---|
| Framework | Angular 22.2 (standalone, zoneless, `OnPush` por padrão) |
| Linguagem | TypeScript 6 (strict) + RxJS 7.8 |
| Estilos | Tailwind CSS 4 + SCSS |
| Formulários | Reactive Forms tipados |
| Testes | Vitest (runner padrão do Angular 22) |

## Como instalar e rodar

Pré-requisito: **Node.js `^22.22.3`, `^24.15.0` ou `>=26`**, as versões aceitas pelo Angular 22 (o 22.14, por exemplo, não funciona). A versão usada no desenvolvimento está no `.nvmrc`.

```bash
git clone <url-do-repositorio>
cd checkout
nvm install   # ou nvm use, se a versão já estiver instalada
npm install
npm start
```

Abra `http://localhost:4200`. A rota inicial redireciona para `/payment`.

Outros comandos:

```bash
npm test                     # testes em modo watch
npx ng test --watch=false    # roda os testes uma vez
npm run build                # build de produção em dist/checkout
```

## Como testar o fluxo

O resultado do pagamento depende do cartão usado, para que cada cenário possa ser reproduzido:

| Número do cartão | Resultado |
|---|---|
| `4242 4242 4242 4242` | Aprovado |
| `5555 5555 5555 4444` | Aprovado (Mastercard) |
| `4000 0000 0000 0002` | Erro: cartão não autorizado |
| `4000 0000 0000 9995` | Erro: saldo insuficiente |
| Pix → "Concluir pagamento" | Aprovado |

Nos demais campos: qualquer nome com 3 letras ou mais, validade futura (ex.: `12/28`) e CVV com 3 ou 4 dígitos. Qualquer outro número que passe na validação também é aprovado. O processamento leva 2 segundos.

Cenários para conferir:

1. **Validação:** clique em "Pagar" com o formulário vazio, ou digite `4242 4242 4242 4241` (falha no Luhn).
2. **Erro:** use o cartão `…0002`. Na tela de erro, "Tentar novamente" reprocessa o mesmo pagamento ali mesmo e "Escolher outro meio" volta ao formulário.
3. **Sucesso:** use o cartão `4242…` ou o Pix.
4. **Acesso sem dados:** atualize a página em `/success` (volta para `/payment`) ou em `/error` (mostra um estado vazio).

## Estrutura de pastas

```
src/
├── tailwind.css              # entrada do Tailwind + tokens de cor (@theme)
├── styles.scss               # estilos globais: campos, botões, cards de resultado
├── styles/_breakpoints.scss  # $breakpoint-mobile / -tablet / -desktop
└── app/
    ├── app.routes.ts         # rotas com lazy loading e guard
    ├── core/                 # o que é usado por mais de uma tela
    │   ├── guards/           # paymentSuccessGuard
    │   ├── mocks/            # produto, pedido e código Pix simulados
    │   ├── models/           # Product, Order, PaymentState, PaymentRequest...
    │   ├── services/         # PaymentService (estado), PaymentGatewayService (simulação),
    │   │                     # CheckoutDataService (dados do BFF), ViewportService
    │   └── utils/            # formatação de cartão e descrição do meio de pagamento
    ├── features/             # uma pasta por tela, cada uma carregada sob demanda
    │   ├── payment/          # tela de pagamento
    │   │   ├── components/   # payment-method-selector, card-form, pix-payment, order-summary
    │   │   ├── validators/   # cardNumberValidator (Luhn), expirationDateValidator
    │   │   ├── models/
    │   │   └── utils/        # QR Code simulado
    │   ├── success/
    │   └── error/
    └── shared/components/    # header, footer, checkout-steps, icon, result-card,
                              # order-details, product-item, payment-processing
```

Os testes (`*.spec.ts`) ficam ao lado do arquivo que testam.

## Decisões

### Estado do pagamento em memória, num serviço

O `PaymentService` guarda o estado num `BehaviorSubject<PaymentState>`, compartilhado pelas três telas. O estado é uma união tipada — `idle`, `processing`, `success` e `error` — então cada tela só acessa os dados que existem naquela situação (por exemplo, `failure` só existe em `error`).

- As telas recebem um `PaymentAttempt`, que contém só o que pode ser exibido (ex.: "Crédito · Visa •••• 4242"). **Os dados do cartão nunca entram no estado.**
- Para o "Tentar novamente", a última requisição fica num campo privado do serviço, só em memória. Ela é apagada quando o pagamento é aprovado ou o checkout recomeça.
- Um segundo envio enquanto o primeiro está processando é ignorado.

**Por que só memória:** guardar em `sessionStorage` ou `localStorage` faria o estado sobreviver ao F5, mas deixaria dados de pagamento no navegador. Num produto real, eu deixaria o estado da compra com o **BFF**: a URL de sucesso/erro levaria o identificador do pedido e a tela consultaria o status no servidor. Se precisasse de sessão, ela viria de um cookie `httpOnly` definido pelo BFF. Sem backend neste desafio, a memória é a opção mais segura, e o desafio aceita tratar o acesso sem dados.

Signals cuidam do estado local de cada componente (meio selecionado, "código copiado"). RxJS cuida do estado compartilhado e do fluxo assíncrono, consumido nos templates com `async`.

### Acesso sem dados: guard no sucesso, estado vazio no erro

- **`/success`** tem o `paymentSuccessGuard`. Sem um pagamento aprovado, ele redireciona para `/payment`. Ao sair da tela, o estado é limpo, então a confirmação aparece uma única vez.
- **`/error`** não redireciona: mostra "Nenhum pagamento para revisar" com um botão para voltar ao pagamento. Aqui a pessoa pode ter chegado por um link ou um F5 depois de uma falha; explicar o que houve é mais claro do que trocar de tela sem aviso.
- **`/payment`** reinicia o estado ao abrir (a não ser que haja um pagamento em processamento). Assim, voltar pelo navegador a partir da tela de erro começa uma tentativa nova.

### Estilos: Tailwind + SCSS

- **Tailwind 4** define os tokens do design (`@theme` em `src/tailwind.css`: `primary`, `muted`, `danger`...) e fornece os utilitários de tipografia e espaçamento usados nos templates.
- **SCSS** cuida do layout e dos estilos de cada componente. O responsivo usa `@media (min-width: …)`, partindo do mobile, com três breakpoints:

| Variável | Largura | Layout |
|---|---|---|
| `$breakpoint-mobile` | 320px | coluna única, resumo do pedido acima do formulário |
| `$breakpoint-tablet` | 750px | coluna única centralizada (até 680px) |
| `$breakpoint-desktop` | 1024px | formulário à esquerda, resumo numa coluna de 320px à direita |

- O Tailwind fica num arquivo `.css` separado porque o Sass não processa `@import "tailwindcss"`.
- Os mesmos breakpoints existem em TypeScript no `ViewportService`, que expõe `deviceType$` e `isMobile$` (BehaviorSubject atualizado no `resize`, com `debounceTime`). A tela de pagamento usa isso para esconder no mobile a lista de benefícios e o aviso de segurança, como no Figma. Para regras de layout, o CSS basta; o serviço serve quando o que muda é o conteúdo renderizado.

### Outras decisões

- **Lazy loading:** cada tela é um componente standalone carregado com `loadComponent`, e o build gera um chunk por tela.
- **Validação do cartão:** número com algoritmo de Luhn (13 a 19 dígitos), validade no formato MM/AA e não vencida, CVV com 3 ou 4 dígitos, nome com no mínimo 3 caracteres. Os erros aparecem ao sair do campo ou ao tentar pagar. Os campos têm máscara e a bandeira é detectada pelo número.
- **Reactive Forms em vez de Signal Forms:** o Angular 22 já tem Signal Forms estáveis, mas Reactive Forms é a API que funciona do Angular 14 ao 22 e a mais comum em aplicações grandes.
- **Débito e crédito** usam o mesmo formulário e as mesmas validações; muda só o título.
- **Acessibilidade:** os campos têm `label`, `aria-invalid` e `aria-describedby` apontando para a mensagem de erro; as mensagens usam `role="alert"`/`role="status"`; o foco é visível; a seleção do meio de pagamento usa `input type="radio"` nativo; o spinner respeita `prefers-reduced-motion`.
- **Testes (41):** validadores, breakpoints e resize do `ViewportService`, transições de estado do `PaymentService`, cenários do gateway (com fake timers), guard, e as três telas (validação, troca de meio de pagamento, envio, retry e estado vazio).

## O que ficou de fora e por quê

| Item | Motivo |
|---|---|
| Gateway real e tokenização do cartão | O desafio pede processamento simulado. Num caso real, os dados do cartão iriam direto para o SDK do gateway, que devolve um token; o frontend nunca enviaria o número para o próprio backend. |
| Persistência do estado no F5 | Decisão de não guardar dados de pagamento no navegador (ver [Decisões](#estado-do-pagamento-em-memória-num-serviço)). |
| `HttpClient`, interceptors e autenticação OIDC | Não há backend. O `CheckoutDataService` devolve os mocks com `of()` e é o ponto onde entraria o `HttpClient`, com um interceptor para o token OIDC. |
| Confirmação real do Pix | No mundo real, a confirmação chegaria do servidor (por exemplo via SSE/`EventSource`). Aqui o botão "Concluir pagamento" simula essa confirmação, e o Pix sempre é aprovado. |
| QR Code escaneável | O QR Code é desenhado a partir do código Pix simulado, mas não é válido. Não justificava adicionar uma biblioteca só para isso. |
| "Acessar meu espaço" e "Fale com a gente" | Não existe área logada nem canal de atendimento; os links são `#`. "Ver recibo" abre a impressão do navegador. |
| Testes end-to-end | O Angular CLI não traz um framework de E2E. O fluxo foi coberto com testes de componente no Vitest e conferido manualmente no navegador. |
| Google Analytics / GTM | Fora do escopo do desafio. Os pontos naturais de evento seriam a escolha do meio de pagamento, o envio, o sucesso e o erro (no `PaymentService`). |
| Internacionalização | A interface é só em português (`LOCALE_ID` `pt-BR`, moeda BRL). |
