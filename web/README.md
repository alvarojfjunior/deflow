# 🌀 DeFlow — Plataforma SaaS de Automação de Estratégias

## 📘 Visão Geral
O **DeFlow** é uma plataforma SaaS de automação generalista voltada para a execução de **estratégias personalizadas** em múltiplas **blockchains** e **DEXs (exchanges descentralizadas)**.

O usuário pode:
- Fazer login e gerenciar seus bots;
- Selecionar uma estratégia existente;
- Configurar parâmetros de execução;
- Conectar sua carteira (chave privada criptografada);
- Ativar loops contínuos que rodam com segurança no servidor.

---

## ⚙️ Primeira Estratégia: Automação de Pools de Liquidez

A primeira estratégia tem como foco **automatizar a gestão de pools de liquidez**.

Ela permite ao usuário criar **loops personalizados** que monitoram, abrem e fecham posições de liquidez de forma automática, com base em critérios definidos por ele.

### 🔑 Principais Recursos
- **Parâmetros configuráveis:** valor de entrada, número máximo de pools simultâneas, TVL mínimo, APR mínimo e limiar de volatilidade.  
- **Regras dinâmicas de entrada e saída:** fechamento automático de posições com base em tempo fora do range, queda de TVL, IL (impermanent loss) elevada ou condições personalizadas de stop.  
- **Arquitetura multichain:** suporte inicial para **Solana** e **DEX Orca**, com expansão planejada para outras redes e DEXs.  
- **Modo simulação (Dry-run):** permite testar e otimizar estratégias sem realizar transações reais.

---

## 🧩 Arquitetura e Princípios de Design

### 🔹 Arquitetura Desacoplada
Cada estratégia roda isoladamente com contratos bem definidos:
- `IStrategyLoop` — controla a lógica de execução e repetição da estratégia;
- `IBlockchainConnector` — gerencia carteira, saldos, preços e interações on-chain;
- `IDexConnector` — lida com dados das pools, operações de liquidez e taxas.

### 🔹 Modularidade Baseada em Conectores
- **Conectores de Blockchain:** responsáveis por carteiras, saldos e interações on-chain.  
- **Conectores de DEX:** responsáveis por dados de pools, taxas e operações de entrada e saída.  

### 🔹 Execução Escalável de Jobs
O **BullMQ** é utilizado para gerenciar jobs de forma independente, com workers isolados dedicados a:
- Entrada de liquidez;
- Saída de liquidez;
- Rebalanceamento;
- Healthcheck.

Essa abordagem garante **alto desempenho**, **escalabilidade** e **tolerância a falhas**.

### 🔹 Segurança
- Chaves privadas do usuário são criptografadas com **AES-GCM (envelope encryption)**.  
- A descriptografia ocorre sob demanda apenas em **processos isolados**, garantindo máxima proteção.

### 🔹 Interface Moderna
Frontend desenvolvido em **Next.js**, utilizando o template  
[`next-shadcn-dashboard-starter`](https://github.com/Kiranism/next-shadcn-dashboard-starter),  
garantindo uma experiência **limpa**, **modular** e **responsiva**.

### 🔹 Persistência de Usuário
- Usuários autenticados via **Clerk** são automaticamente persistidos no banco de dados MongoDB.
- A persistência ocorre sem a necessidade de webhooks, utilizando um componente React que verifica e salva o usuário após autenticação.
- Implementação baseada em um endpoint de API (`/api/users/ensure`) que verifica a existência do usuário e o cria caso necessário.

---

## 🌐 Tecnologias Principais

| Categoria | Tecnologia |
|------------|-------------|
| Frontend | Next.js + shadcn/ui |
| Backend | Node.js / TypeScript |
| Banco de Dados | MongoDB |
| Autenticação | Clerk |
| Infraestrutura | Docker + Docker Compose |
| Segurança | AES-GCM Encryption |
| Blockchain Inicial | Solana |
| DEX Inicial | Orca |

---

## 🚀 Visão de Futuro
O **DeFlow** busca se tornar uma **camada unificada de automação para o DeFi**, permitindo que usuários criem **bots inteligentes** capazes de:

- Executar estratégias de yield;
- Rebalancear ativos automaticamente;
- Gerenciar posições de liquidez;
- Operar em múltiplas redes e protocolos.

Tudo isso com **segurança**, **escalabilidade** e **extensibilidade** como pilares fundamentais.

---

## 🧠 Conceitos-Chave
- **Loops contínuos:** execução recorrente das estratégias de forma autônoma;  
- **Dry-run:** simulação sem transações reais;  
- **Desacoplamento:** cada módulo (estratégia, blockchain, DEX) é independente;  
- **Isolamento de processos:** segurança reforçada para manipulação de chaves;  
- **Multichain:** preparado para operar em diferentes blockchains.

---

## 🧰 Estrutura Base do Projeto

```

src/
├─ modules/
│  ├─ strategies/
│  │  ├─ liquidity-pool/
│  │  ├─ ...
│  ├─ connectors/
│  │  ├─ blockchain/
│  │  ├─ dex/
├─ workers/
│  ├─ strategy-loop.ts
│  ├─ entry-worker.ts
│  ├─ exit-worker.ts
│  ├─ rebalance-worker.ts
│  ├─ healthcheck-worker.ts
├─ utils/
│  ├─ encryption/

```

---

## 🧱 Template Base
O projeto utiliza o template [`next-shadcn-dashboard-starter`](https://github.com/Kiranism/next-shadcn-dashboard-starter),  
que oferece uma base sólida em Next.js, com estrutura modular, UI moderna e suporte a autenticação.

---

## 📄 Licença
Este projeto está sob a licença **MIT**.  
Sinta-se à vontade para contribuir, melhorar e expandir o ecossistema DeFlow.

---

**DeFlow — Automação inteligente e segura para o futuro do DeFi.**