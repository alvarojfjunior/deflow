# 🌀 DeFlow — Plataforma SaaS de Automação de Estratégias On‑chain e em DEXs

## **Visão Geral**
- Plataforma SaaS para criação e execução de automations de estratégias em múltiplas blockchains e DEXs.
- Usuário autentica, configura parâmetros, conecta carteira criptografada e ativa loops contínuos executados com segurança no servidor.
- Foco inicial: automação de gestão de pools de liquidez na Solana (DEX Orca).

---

## **Regras de Negócio (Core)**
- Estratégias são executadas como “automations” independentes, cada uma com:
  - `status`: `active | paused | error`.
  - `interval`: frequência mínima entre execuções por automation.
  - `lastHeartbeatAt`: controle de saúde e frequência de execução.
- Primeira estratégia: “Pool Automation”
  - Objetivo: abrir, manter, reequilibrar e encerrar posições de liquidez conforme regras.
  - Parâmetros (tipos atuais em `worker/src/types/automation.ts`):
    - `blockchain`: `"solana"`.
    - `walletId`: referência à carteira do usuário.
    - `allocationMode`: `"APR" | "TVL" | "APR/TVL" | string` (define como priorizar pools).
    - Limites e gatilhos:
      - `maxActivePools`: máximo de pools simultâneas.
      - `impermanentLossTolerancePer`: tolerância de IL (%).
      - `stopWinPer`: alvo de ganho (%).
      - `exitOnTVLDropPer`, `exitOnAPRDropPer`: saída por queda de TVL/APR (%).
      - `maxTimeOutOfRange`: tempo máximo fora do range antes de encerrar ou reequilibrar.
  - Regra operacional:
    - Seleção de pools via conector da DEX (Orca).
    - Decisão e execução de entrada/saída/rebalanceamento conforme parâmetros.
    - Logs e heartbeat para observabilidade.

- Dry-run (Simulação)
  - Modo de execução sem transações reais, útil para otimização de estratégia.
  - Regras de negócio consideram dry-run como “sem side effects on-chain”, porém com coleta de métricas.

- Carteiras e Segurança
  - Carteiras do usuário (Solana) são armazenadas com segredo criptografado.
  - Criptografia: AES-256-GCM (Envelope Encryption).
  - Descriptografia acontece sob demanda e apenas em processos isolados (workers).
  - Formatos de segredo suportados (lido do plaintext após decriptação):
    - JSON array de bytes (`[12,34,...]`), `base64`, `base58` (padrão Solana), `hex` ou UTF‑8 fallback.
  - Derivação de `Keypair` Solana:
    - 64 bytes → `Keypair.fromSecretKey`.
    - 32 bytes → `Keypair.fromSeed`.

---

## **Arquitetura do Monorepo**
- `app/` — Frontend (Next.js + shadcn/ui)
  - Autenticação com Clerk.
  - UI moderna: dashboard, gráficos, formulários, componentes Radix.
  - Scripts:
    - `dev`, `build`, `start`, `lint`, `format`.
    - Workers scripts locais (`workers:dev`, `workers:start`) para ambiente do app (utilitário).
  - Dockerfile.dev expõe `3000` com `next dev`.

- `worker/` — Backend de execução (Node.js/TypeScript)
  - Scheduler (`worker/src/scheduler.ts`)
    - Conecta ao Mongo (`MONGO_URI`) e varre automations com `status: "active"`.
    - Respeita `interval` por automation e um `POOLING_INTERVAL` global.
    - Controla ciclo de vida de processos usando `worker_threads` (isola execução).
    - Publica mensagem `run` para cada worker e atualiza `lastHeartbeatAt`.
    - Encerra workers desativados e trata erros/saída com logs.
  - Workers
    - `workers/poolAutomation`: recebe `automation` via `workerData`, conecta no DB e executa `strategy.ts`.
    - Planejamento de workers dedicados: entrada, saída, rebalanceamento, healthcheck.
  - Conectores
    - Blockchain (`lib/connectors/blockchain`):
      - `solana`: saldo, token balances (WIP), public key, assinatura/envio de transações (WIP), status de transação (WIP).
      - `utils/keypair.ts`: decripta e forma Keypair com múltiplos formatos de segredo.
    - DEX (`lib/connectors/dex`):
      - `solana/orca`: `getPools`, `getPoolById`, `getUserPositions`, `addLiquidity`, `removeLiquidity` (interfaces presentes, implementação evolutiva).
  - Criptografia (`lib/crypto.ts`)
    - AES-GCM com `iv`, `tag` e `ciphertext`.
    - `WALLET_ENCRYPTION_KEY` pode ser `base64`, `hex` ou texto (hash SHA-256).
    - Funções auxiliares para parsing de segredo e base58.
  - DB (`lib/db.ts`)
    - Conexão com MongoDB e utilitários de open/close.
  - Tipos (`src/types`)
    - `Automation`: metadados, estratégia, status, heartbeat, interval.
    - `WalletDoc`: `blockchain: 'solana'`, `secret: EncryptedSecret`, carimbo de data.
    - `UserDoc`: `authId`, `email`, carimbos.

- `shared/`
  - Utilitários compartilhados e seeds (ponto único para futuras funções comuns entre `app` e `worker`).

---

## **Fluxos Operacionais**
- Onboarding
  - Usuário autentica via Clerk.
  - Persistência de usuário no Mongo: verificação/criação pós-autenticação (conforme README do app).
- Wallet
  - Usuário cria/edita carteiras; segredo é criptografado no backend e armazenado como `EncryptedSecret`.
- Configuração de Automation
  - Usuário escolhe estratégia (ex.: Pool Automation Solana/Orca) e define parâmetros.
- Execução
  - Scheduler identifica automations `active`, respeita `interval` e aciona worker.
  - Worker executa `strategy.ts`, consulta pools (DEX), saldos (Blockchain), decide ações.
  - Logs e heartbeat atualizados; erros sinalizam `status` e diagnósticos.
- Observabilidade
  - Logs via `parentPort.message` no worker.
  - Planejado: bull-board (já em dependências do worker) para monitorar filas quando integradas.

---

## **Segurança**
- Chave privada do usuário:
  - Criptografada com AES-256-GCM (envelope encryption).
  - IV e TAG armazenados separados do ciphertext.
- Descriptografia sob demanda:
  - Somente dentro de processos isolados (`worker_threads`) durante a execução.
- Segredos nunca persistem em memória compartilhada fora do worker.
- Conexões RPC da Solana:
  - Selecionadas por `NET` (`testnet`, `mainnet`, etc.) via constantes.

---

## **Ambiente e Configuração**
- Variáveis de ambiente principais:
  - `MONGO_URI`: URI do MongoDB.
  - `WALLET_ENCRYPTION_KEY`: chave usada para AES-GCM (base64/hex/texto).
  - `NET`: rede Solana (`testnet`, `mainnet`, etc.) para RPC.
  - `POOLING_INTERVAL`: intervalo global de polling do scheduler (ms).
- Execução local
  - App:
    - `npm run dev` (porta `3000`).
  - Worker:
    - `npm run build && npm start` ou `npm run dev:watch` (watch sobre build/start).
- Docker
  - `Dockerfile.dev` presente no `app/`.
  - `docker-compose-dev.yml` orquestra serviços em desenvolvimento (se configurado).

---

## **Tecnologias**
- Frontend: Next.js, shadcn/ui, Radix, Clerk, Tailwind.
- Backend: Node.js, TypeScript.
- Banco: MongoDB.
- Fila/Jobs: BullMQ (integrável; dependências presentes), `worker_threads` para isolamento de execução e ciclo de vida.
- Segurança: AES‑256‑GCM, processos isolados.
- Blockchain: Solana (`@solana/web3.js`).
- DEX: Orca (conector inicial).

---

## **Extensibilidade**
- Conectores tipados (Blockchain/DEX) facilitam expansão multichain.
- Novas estratégias podem reutilizar:
  - Scheduler + Worker Isolation.
  - Conectores existentes ou novos.
  - Padrões de logs/heartbeat e parâmetros configuráveis.

---

## **Licença**
- MIT — contribuições bem‑vindas para evolução do ecossistema DeFlow.

---

**DeFlow — Automação inteligente e segura para o futuro do DeFi.**