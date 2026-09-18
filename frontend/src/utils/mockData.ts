import { OrdemServico, User } from '../types';

export const MOCK_DEMO_USERS: User[] = [
  { id: 1, nome: 'Administrador Geral', login: 'admin', cargo: 'ADMIN', status: 'ONLINE', especialidades: ['NOTEBOOK', 'SMARTPHONE', 'PC_DESKTOP'] },
  { id: 2, nome: 'Gerente de Oficina', login: 'gerente', cargo: 'GERENTE', status: 'ONLINE', especialidades: ['NOTEBOOK', 'CONSOLE'] },
  { id: 3, nome: 'Atendente de Balcão', login: 'atendente', cargo: 'ATENDENTE', status: 'ONLINE' },
  { id: 4, nome: 'Técnico em Hardware', login: 'tecnico', cargo: 'TECNICO', status: 'ONLINE', especialidades: ['NOTEBOOK', 'PC_DESKTOP', 'IMPRESSORA'] },
  { id: 5, nome: 'Especialista Mobile', login: 'tecnico_celular', cargo: 'TECNICO_CELULAR', status: 'ONLINE', especialidades: ['SMARTPHONE', 'TABLET'] }
];

export const MOCK_DEMO_OS: OrdemServico[] = [
  {
    id: 1,
    codigo_os: 'OS-2026-0001',
    cliente_nome: 'Mariana Duarte',
    cliente_telefone: '(11) 98888-1111',
    cliente_whatsapp: '(11) 98888-1111',
    marca_modelo: 'MacBook Pro M2 14"',
    tipo_equipamento: 'NOTEBOOK',
    defeito_relatado: 'Tela não acende após queda leve. Cooler dispara ao conectar na tomada.',
    status: 'TRIAGEM',
    prioridade: 'URGENTE',
    prazo_entrega: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    criado_por_id: 1,
    tempo_bancada_segundos: 0,
    orcamento_valor: 0,
    valor_final: 0
  },
  {
    id: 2,
    codigo_os: 'OS-2026-0002',
    cliente_nome: 'Rodrigo Fernandes',
    cliente_telefone: '(11) 97777-2222',
    cliente_whatsapp: '(11) 97777-2222',
    marca_modelo: 'iPhone 15 Pro Max 256GB',
    tipo_equipamento: 'SMARTPHONE',
    defeito_relatado: 'Troca de display OLED original e bateria com saúde em 74%.',
    status: 'EM_ANDAMENTO',
    prioridade: 'ALTA',
    prazo_entrega: new Date(Date.now() + 172800000).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    criado_por_id: 1,
    tecnico_id: 5,
    tecnico: MOCK_DEMO_USERS[4],
    tempo_bancada_segundos: 1420,
    orcamento_valor: 850,
    valor_final: 850
  },
  {
    id: 3,
    codigo_os: 'OS-2026-0003',
    cliente_nome: 'Beatriz Silveira',
    cliente_telefone: '(11) 96666-3333',
    cliente_whatsapp: '(11) 96666-3333',
    marca_modelo: 'Dell XPS 15 9520',
    tipo_equipamento: 'NOTEBOOK',
    defeito_relatado: 'Desliga sozinho ao renderizar vídeo. Superaquecimento na placa mãe.',
    laudo_tecnico: 'Necessário reballing no circuito PWM de alimentação e substituição da pasta térmica por metal líquido.',
    status: 'AGUARDANDO_APROVACAO',
    prioridade: 'MEDIA',
    prazo_entrega: new Date(Date.now() + 259200000).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
    criado_por_id: 1,
    tecnico_id: 4,
    tecnico: MOCK_DEMO_USERS[3],
    tempo_bancada_segundos: 2100,
    orcamento_valor: 480,
    valor_final: 480
  },
  {
    id: 4,
    codigo_os: 'OS-2026-0004',
    cliente_nome: 'Felipe Campos',
    cliente_telefone: '(11) 95555-4444',
    cliente_whatsapp: '(11) 95555-4444',
    marca_modelo: 'PlayStation 5 Disc Edition',
    tipo_equipamento: 'CONSOLE',
    defeito_relatado: 'Erro de leitura de disco e aquecimento excessivo na fonte interna.',
    status: 'TESTES',
    prioridade: 'MEDIA',
    prazo_entrega: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date().toISOString(),
    criado_por_id: 1,
    tecnico_id: 4,
    tecnico: MOCK_DEMO_USERS[3],
    tempo_bancada_segundos: 3600,
    orcamento_valor: 350,
    valor_final: 350
  },
  {
    id: 5,
    codigo_os: 'OS-2026-0005',
    cliente_nome: 'Camila Alencar',
    cliente_telefone: '(11) 94444-5555',
    cliente_whatsapp: '(11) 94444-5555',
    marca_modelo: 'Samsung Galaxy S24 Ultra',
    tipo_equipamento: 'SMARTPHONE',
    defeito_relatado: 'Conector de carga USB-C oxidado após contato acidental com água salgada.',
    status: 'CONCLUIDO',
    prioridade: 'ALTA',
    prazo_entrega: new Date().toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date().toISOString(),
    criado_por_id: 1,
    tecnico_id: 5,
    tecnico: MOCK_DEMO_USERS[4],
    tempo_bancada_segundos: 1800,
    orcamento_valor: 280,
    valor_final: 280
  }
];

export const MOCK_DEMO_ESTOQUE = [
  {
    id: 1,
    nome: 'Tela Display iPhone 15 Pro Max OLED',
    categoria: 'PECA',
    subcategoria: 'Display',
    condicao: 'NOVO',
    quantidade: 8,
    estoque_minimo: 2,
    preco_custo: 380.0,
    preco_venda: 750.0,
    codigo_barras: '789123456701',
    localizacao: 'Gaveta A-04'
  },
  {
    id: 2,
    nome: 'SSD NVMe M.2 1TB Kingston NV2 PCIe 4.0',
    categoria: 'PECA',
    subcategoria: 'Armazenamento',
    condicao: 'NOVO',
    quantidade: 14,
    estoque_minimo: 3,
    preco_custo: 240.0,
    preco_venda: 420.0,
    codigo_barras: '789123456702',
    localizacao: 'Prateleira B-01'
  },
  {
    id: 3,
    nome: 'Bateria Original Dell XPS 15 9520 86Wh',
    categoria: 'PECA',
    subcategoria: 'Baterias',
    condicao: 'NOVO',
    quantidade: 4,
    estoque_minimo: 2,
    preco_custo: 210.0,
    preco_venda: 390.0,
    codigo_barras: '789123456703',
    localizacao: 'Gaveta A-08'
  },
  {
    id: 4,
    nome: 'Carregador Turbo USB-C 65W GaN Universal',
    categoria: 'ACESSORIO',
    subcategoria: 'Carregadores',
    condicao: 'NOVO',
    quantidade: 25,
    estoque_minimo: 5,
    preco_custo: 45.0,
    preco_venda: 120.0,
    codigo_barras: '789123456704',
    localizacao: 'Balcão Vendas'
  }
];

export const MOCK_DEMO_STATS = {
  total: 5,
  triagem: 1,
  emAndamento: 1,
  aguardandoAprovacao: 1,
  testes: 1,
  concluido: 1,
  entregue: 0,
  sla: {
    noPrazo: 4,
    emAlerta: 1,
    atrasadas: 0,
    tempoMedioResolucaoHoras: 18.5
  },
  faturamentoMes: 1960.0
};

export const MOCK_EMPRESA_CONFIG = {
  id: 1,
  nome_empresa: 'AssistPro Assistência Especializada',
  cnpj_cpf: '12.345.678/0001-99',
  telefone: '(11) 3456-7890',
  whatsapp: '(11) 98888-1111',
  email: 'contato@assistpro.com.br',
  endereco: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
  mensagem_rodape: 'Garantia de 90 dias conforme artigo 26 do CDC.'
};
