# 🛠️ AssistPro OS — Gestão Inteligente para Assistência Técnica

> **SaaS Híbrido (100% Offline & Nuvem)** para empresas e assistências técnicas de Informática, Smartphones, Videogames, Eletrônica e Eletrodomésticos.

---

## ✨ Principais Características

- **📦 Instalador Padrão Windows (`Setup.exe`)**:
  - Instalação no estilo tradicional (*Avançar > Avançar > Concluir*).
  - Cria atalhos automáticos na Área de Trabalho e Menu Iniciar.
  - Zero necessidade de arquivos `.bat`, terminais pretos ou comandos de prompt para o usuário final.
- **⚡ Modo Híbrido (Offline & Nuvem)**:
  - **100% Offline Local**: Opera com banco de dados SQLite embutido de alta velocidade. Não exige Docker, PostgreSQL externo ou conexão com a internet para a rotina diária da bancada e do balcão.
  - **SaaS Online / Nuvem**: Suporte a PostgreSQL gerenciado em nuvem (Supabase, Neon, AWS RDS, Railway) para redes com filiais ou acesso remoto.
- **🏢 Identidade Neutra & Personalizável (White-Label)**:
  - Qualquer assistência técnica pode configurar seu Nome Fantasia, CNPJ/CPF, Telefone, WhatsApp, Endereço, Logo, Chave PIX e Termos de Garantia.
- **📋 Gestão Completa de Ordens de Serviço (OS)**:
  - Kanban de Triagem em tempo real (Triagem, Bancada, Aguardando Peça, Testes de Qualidade, Pronto, Entregue).
  - Cronômetro de tempo de bancada por técnico.
  - Checklist de entrada e fotos de evidência do aparelho.
  - Impressão térmica de cupom e comprovante em folha A4 com 2 vias automáticas (via do cliente e via da bancada com QR Code de consulta).
  - Notificações automáticas pré-formatadas para WhatsApp com um clique.
- **📦 Controle de Estoque & Peças**:
  - Peças novas, insumos e aparelhos usados/seminovos com rastreio de IMEI/Serial.
  - Importação e exportação em planilhas Excel.
- **🛒 PDV & Frente de Caixa**:
  - Vendas balcão, cálculo automático de troco, formas de pagamento (Dinheiro, PIX, Cartões) e impressão de recibo não fiscal.
- **💬 Chat & Interfone Interno**:
  - Comunicação instantânea entre recepcionistas/atendentes e técnicos da bancada, com envio de áudio e texto.
- **📊 DRE & Relatórios Gerenciais**:
  - Faturamento bruto, custo real de peças, lucro líquido real, ticket médio e produtividade por técnico e atendente.

---

## 🚀 Acesso e Inicialização em Desenvolvimento

Para rodar o sistema localmente em modo desenvolvimento:

```bash
npm.cmd run dev
```

- **Frontend (Interface Web)**: [http://localhost:5173](http://localhost:5173)
- **Backend (API REST & WebSockets)**: [http://localhost:3001](http://localhost:3001)

### 👥 Usuários Padrão para Demonstração (Senha padrão: `123456`):
- **👑 Administrador Geral**: `admin` (acesso total às configurações, relatórios, usuários e estoque)
- **👑 Técnico Especialista**: `emanuel` (acesso à bancada, kanban e estoque)
- **📋 Atendente Balcão**: `atendente` (acesso à triagem, entrada de OS e vendas balcão)

---

## 📦 Gerar o Instalador Executável Windows (`AssistPro-Setup.exe`)

Para compilar e gerar o instalador do programa:

```bash
npm.cmd run build:installer
```

O instalador será gerado na pasta `desktop/dist-installer/AssistPro-Setup-1.0.0.exe`.

---

## 📂 Organização do Repositório

```
sass/
├── backend/          # API Node.js, Express, Prisma (SQLite/PostgreSQL) e Socket.io
├── frontend/         # Interface React + TypeScript + Vite + Tailwind CSS
├── desktop/          # Empacotador desktop Electron e instalador NSIS (.exe)
├── docs/             # Manuais de usuário e guias técnicos organizados
├── scripts/          # Utilitários e scripts legados
└── package.json      # Scripts de orquestração do projeto
```
