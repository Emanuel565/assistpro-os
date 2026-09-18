# 🛠️ AssistPro OS — Sistema Operacional de Gestão para Assistência Técnica

<div align="center">

![AssistPro OS Banner](https://img.shields.io/badge/AssistPro-OS_v1.0-2563eb?style=for-the-badge&logo=shield&logoColor=white)
[![Demonstração Online](https://img.shields.io/badge/🌐_Acessar_Demonstração-Online_(GitHub_Pages)-10b981?style=for-the-badge&logo=googlechrome&logoColor=white)](https://emanuel565.github.io/assistpro-os/)
[![Criado por Emanuel Carvalho](https://img.shields.io/badge/Criado_por-Emanuel_Carvalho-7c3aed?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Emanuel565)

<br/>

[![React](https://img.shields.io/badge/React_19-20232a?style=flat-square&logo=react&logoColor=61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_6-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3.4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js_20_LTS-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma_ORM-2d3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite WAL](https://img.shields.io/badge/SQLite-WAL_Enterprise-003b57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-4169e1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker_&_Compose-2496ed?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Licença MIT](https://img.shields.io/badge/Licença-MIT-yellow?style=flat-square)](LICENSE)

<p align="center">
  <b>SaaS Híbrido Corporativo (100% Offline Local ou Nuvem de Alta Concorrência)</b><br/>
  Projetado para máxima performance em assistências de <b>Smartphones, Informática, Games, Eletrônica e Eletrodomésticos</b>.
</p>

[**🚀 Testar Agora ao Vivo**](https://emanuel565.github.io/assistpro-os/) • [**✨ Funcionalidades**](#-principais-funcionalidades) • [**⚡ Arquitetura & Escala**](#-arquitetura-de-alta-escala) • [**📦 Instalação**](#-como-executar-o-projeto) • [**👨‍💻 Autor**](#-criador--desenvolvedor)

</div>

---

## 🌟 Visão Geral

O **AssistPro OS** é uma solução completa para controle operacional, técnico e financeiro de oficinas e empresas de assistência técnica. Desenvolvido para resolver o problema clássico de lentidão em sistemas legados, o AssistPro OS combina interface moderna ultra-rápida, arquitetura orientada a dados com indexação profunda e suporte a operação híbrida:

1. **Desktop 100% Offline (Instalador `.exe` Windows)**: Opera com motor SQLite em modo **Enterprise WAL** (*Write-Ahead Logging*). Não requer internet, nem instalação de servidores externos na bancada.
2. **SaaS Nuvem de Alta Concorrência (Docker + PostgreSQL 16 + Redis)**: Suporta centenas de milhares de Ordens de Serviço por ano, filiais conectadas e consultas simultâneas sem travamentos.

> 🔗 **Experimente a versão interativa no seu navegador sem instalar nada:**  
> 👉 **[https://emanuel565.github.io/assistpro-os/](https://emanuel565.github.io/assistpro-os/)**

---

## 🎯 5 Modalidades Especializadas com 1 Clique

O sistema adapta instantaneamente seus checklists técnicos, campos específicos e relatórios conforme o segmento:

| Modalidade | Especialidade | Checklists e Campos Próprios |
| :--- | :--- | :--- |
| 📱 **Smartphones & Tablets** | Celulares Apple, Samsung, Xiaomi, etc. | IMEI, Conta Mi/iCloud, Teste de Câmeras, Biometria, Tela, Bateria |
| 💻 **Informática & PCs** | Notebooks, Desktops, Servidores | Número de Série, Carregador, Memória RAM, Armazenamento, Placa de Vídeo |
| 🎮 **Games & Consoles** | PlayStation, Xbox, Nintendo, Portáteis | Nº Série, Cabos, Controles acompanhantes, Cooler, HDMI, Desbloqueio |
| 🔌 **Eletrônica & Placas** | Módulos, Inversores, TVs, Áudio | Modelo, Tensão de Entrada (110V/220V/Bivolt), Acessórios, Análise SMD |
| 🧺 **Eletrodomésticos** | Lava e Seca, Micro-ondas, AirFryer | Marca, Modelo, Voltagem, Acessórios, Defeito Mecânico/Elétrico |

---

## ✨ Principais Funcionalidades

### 📋 Gestão Inteligente de Ordens de Serviço (OS)
- **Kanban Técnico em Tempo Real**: Fluxo visual completo (*Triagem > Bancada > Aguardando Peça > Testes de Qualidade > Pronto > Entregue*).
- **Sequenciamento Atômico $O(1)$**: Geração instantânea de código anual (`OS-2026-0001`) sem varreduras pesadas de tabela.
- **Cronômetro de Bancada**: Registro exato do tempo trabalhado por cada técnico por OS.
- **Consulta Pública por QR Code**: O cliente escaneia o comprovante ou acessa a página pública e consulta o andamento da sua OS em tempo real sem precisar de login.
- **Impressão Térmica e A4**: Suporte nativo a impressoras térmicas não fiscais (80mm e 58mm) e folha A4 com 2 vias automáticas (Via da Loja com Termo de Entrada e Via do Cliente).
- **Notificação WhatsApp com 1 Clique**: Mensagens automáticas formatadas prontas para envio com o link de acompanhamento.

### 📦 Controle de Estoque & Peças
- Rastreamento por Número de Série e IMEI de peças e aparelhos seminovos.
- Baixa automática de peças e insumos no fechamento da Ordem de Serviço.
- Alerta visual de estoque mínimo e reposição.

### 🛒 Frente de Caixa & PDV Balcão
- Vendas rápidas de balcão integradas ao estoque.
- Suporte a PIX, Cartão de Crédito/Débito e Dinheiro com cálculo automático de troco.
- Emissão de recibo de venda e cupom de garantia.

### 💬 Chat Interno & Interfone de Áudio
- Comunicação instantânea via WebSockets entre o balcão de atendimento e os técnicos na bancada.
- Gravação e reprodução de áudio diretamente pelo navegador para recados rápidos.

### 📊 Painel Financeiro & DRE em Tempo Real
- Métricas instantâneas de Faturamento Bruto, Custo de Peças, Lucro Líquido Real e Ticket Médio.
- Desempenho e produtividade individual por técnico e atendente.

---

## ⚡ Arquitetura de Alta Escala

Para garantir que o sistema continue veloz mesmo com **anos de uso contínuo e centenas de milhares de ordens de serviço acumuladas**, foram implementadas as seguintes camadas de engenharia:

```
┌─────────────────────────────────────────────────────────────┐
│                 Interface React 19 + Vite                   │
│          (Apple Studio Light Ergonomic / Dark Mode)         │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / WebSockets
┌──────────────────────────────▼──────────────────────────────┐
│                  Backend Node.js + Express                  │
│       • Sequenciamento O(1) com Indexação Anual             │
│       • Paginação Segura (take, skip, totalPages)           │
│       • Filtro de Ordens Ativas (apenas_ativas=true)        │
└──────────────┬──────────────────────────────┬───────────────┘
               │ Local                        │ Nuvem / Docker
┌──────────────▼──────────────┐┌──────────────▼───────────────┐
│     SQLite Enterprise       ││    PostgreSQL 16 + Redis     │
│  • PRAGMA journal_mode=WAL  ││  • Particionamento nativo    │
│  • PRAGMA synchronous=NORMAL││  • Cache Redis em memória    │
│  • PRAGMA cache_size=-64000 ││  • Multi-Stage Dockerfile    │
│  • 1.000 OS em lote: 76ms   ││  • docker-compose pronto     │
└─────────────────────────────┘└──────────────────────────────┘
```

### 📊 Resultados do Benchmark Sintético de Carga
- **Criação em lote de 1.000 OS completas**: **76 milissegundos**.
- **Busca paginada em lote com filtros e índices**: **1 milissegundo**.
- **Consumo de memória em repouso**: **~38 MB**.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Git

### 1. Clonar o Repositório
```bash
git clone https://github.com/Emanuel565/assistpro-os.git
cd assistpro-os
```

### 2. Instalar as Dependências
```bash
# Instala as dependências da raiz, backend e frontend
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3. Configurar e Inicializar o Banco de Dados
```bash
cd backend
npx prisma generate
npx prisma db push
npx prisma db seed
cd ..
```

### 4. Iniciar em Modo de Desenvolvimento
```bash
npm run dev
```

- **Frontend (Interface)**: [http://localhost:5173](http://localhost:5173)
- **Backend (API REST & WebSockets)**: [http://localhost:3001](http://localhost:3001)

---

## 🐳 Executando com Docker (Alta Concorrência)

Para rodar a pilha completa corporativa (PostgreSQL 16 + Redis 7 + Backend + Frontend):

```bash
docker compose up -d --build
```

---

## 🔑 Acessos Padrão para Testes

| Perfil | Usuário | Senha | Nível de Acesso |
| :--- | :--- | :--- | :--- |
| 👑 **Administrador Geral** | `admin` | `123456` | Acesso Irrestrito (DRE, Configurações, Usuários, Balcão e Bancada) |
| 🔧 **Técnico Especialista** | `emanuel` | `123456` | Acesso à Bancada Técnica, Kanban de OS, Estoque e Chat |
| 📋 **Atendente Balcão** | `atendente` | `123456` | Acesso à Triagem, Abertura de OS, Frente de Caixa (PDV) e Clientes |

---

## 📦 Gerando o Instalador Windows (`Setup.exe`)

O projeto inclui empacotamento desktop integrado com Electron e NSIS:

```bash
npm run build:installer
```
O executável final para distribuição será gerado na pasta `desktop/dist-installer/`.

---

## 👨‍💻 Criador & Desenvolvedor

<div align="center">

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Emanuel565">
        <img src="https://avatars.githubusercontent.com/u/56859811?v=4" width="130px;" alt="Emanuel Carvalho"/><br />
        <sub><b>Emanuel Carvalho</b></sub>
      </a>
      <br />
      <sub>Full Stack Software Engineer & SaaS Architect</sub>
      <br /><br />
      <a href="https://github.com/Emanuel565">
        <img src="https://img.shields.io/badge/GitHub-Emanuel565-181717?style=flat-square&logo=github" alt="GitHub"/>
      </a>
      <a href="https://www.linkedin.com/in/emanuel-carvalho-390232182/">
        <img src="https://img.shields.io/badge/LinkedIn-Emanuel_Carvalho-0077b5?style=flat-square&logo=linkedin" alt="LinkedIn"/>
      </a>
      <a href="https://wa.me/5561983403282?text=Ol%C3%A1+Emanuel+Carvalho">
        <img src="https://img.shields.io/badge/WhatsApp-Conversar-25d366?style=flat-square&logo=whatsapp" alt="WhatsApp"/>
      </a>
    </td>
  </tr>
</table>

Desenvolvido com foco em excelência de engenharia de software, alta performance e usabilidade premium.

</div>

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE) — sinta-se livre para usar, estudar e evoluir a solução.
