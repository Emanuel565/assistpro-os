import { MOCK_DEMO_USERS, MOCK_DEMO_OS, MOCK_DEMO_ESTOQUE, MOCK_DEMO_STATS, MOCK_EMPRESA_CONFIG } from './mockData';
import { OrdemServico, ItemEstoque, User } from '../types';

const STORAGE_OS = 'assistpro_mock_os_v1';
const STORAGE_ESTOQUE = 'assistpro_mock_estoque_v1';
const STORAGE_USER = 'assistpro_demo_user';

function getStoredOS(): OrdemServico[] {
  try {
    const raw = localStorage.getItem(STORAGE_OS);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(STORAGE_OS, JSON.stringify(MOCK_DEMO_OS));
  return MOCK_DEMO_OS;
}

function saveStoredOS(list: OrdemServico[]) {
  try {
    localStorage.setItem(STORAGE_OS, JSON.stringify(list));
  } catch {}
}

function getStoredEstoque(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_ESTOQUE);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(STORAGE_ESTOQUE, JSON.stringify(MOCK_DEMO_ESTOQUE));
  return MOCK_DEMO_ESTOQUE;
}

function saveStoredEstoque(list: any[]) {
  try {
    localStorage.setItem(STORAGE_ESTOQUE, JSON.stringify(list));
  } catch {}
}

function getCurrentUser(): User {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    if (raw) return JSON.parse(raw);
  } catch {}
  return MOCK_DEMO_USERS[0];
}

export function setupMockApiInterceptor() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;
    const isApiCall = urlStr.startsWith('/api/') || urlStr.includes('/api/');
    const isGitHubPages = window.location.hostname.includes('github.io');

    if (!isApiCall) {
      return originalFetch(input, init);
    }

    // Se NÃO estivermos no GitHub Pages, tenta o backend real primeiro.
    // Se falhar com erro de rede ou 404, recorre ao mock transparente.
    if (!isGitHubPages) {
      try {
        const response = await originalFetch(input, init);
        if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 404)) {
          return response;
        }
      } catch (err) {
        // Falha de rede (servidor backend desligado) - cai no mock
      }
    }

    // Handler Mock Completo
    return handleMockRequest(urlStr, init);
  };
}

async function handleMockRequest(urlStr: string, init?: RequestInit): Promise<Response> {
  const method = (init?.method || 'GET').toUpperCase();
  const parsedUrl = new URL(urlStr, window.location.origin);
  const pathname = parsedUrl.pathname.replace(/^.*\/api\//, '/api/');
  const body = init?.body ? (typeof init.body === 'string' ? JSON.parse(init.body) : {}) : {};

  // Mock response builder
  const jsonResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  // 1. Auth: Usuários públicos
  if (pathname === '/api/auth/public-users') {
    return jsonResponse({ users: MOCK_DEMO_USERS });
  }

  // 2. Auth: Login
  if (pathname === '/api/auth/login') {
    const loginTarget = (body.login || '').toLowerCase();
    const matched = MOCK_DEMO_USERS.find(u => u.login.toLowerCase() === loginTarget) || MOCK_DEMO_USERS[0];
    localStorage.setItem(STORAGE_USER, JSON.stringify(matched));
    return jsonResponse({
      token: 'demo-token-preview',
      user: matched
    });
  }

  // 3. Auth: Switch Demo
  if (pathname === '/api/auth/switch-demo') {
    const { userId, cargo } = body;
    const matched = MOCK_DEMO_USERS.find(u => (cargo && u.cargo === cargo) || (userId && u.id === userId)) || MOCK_DEMO_USERS[0];
    localStorage.setItem(STORAGE_USER, JSON.stringify(matched));
    return jsonResponse({
      token: 'demo-token-preview',
      user: matched
    });
  }

  // 4. Auth: Me
  if (pathname === '/api/auth/me') {
    const user = getCurrentUser();
    return jsonResponse({ user });
  }

  // 5. Dashboard: Estatísticas & SLA
  if (pathname === '/api/dashboard/stats') {
    const osList = getStoredOS();
    const triagem = osList.filter(o => o.status === 'TRIAGEM').length;
    const emAndamento = osList.filter(o => o.status === 'EM_ANDAMENTO').length;
    const aguardandoAprovacao = osList.filter(o => o.status === 'AGUARDANDO_APROVACAO').length;
    const testes = osList.filter(o => o.status === 'TESTES').length;
    const concluido = osList.filter(o => o.status === 'CONCLUIDO').length;
    const entregue = osList.filter(o => o.status === 'ENTREGUE').length;
    const faturamento = osList.reduce((acc, curr) => acc + (curr.valor_final || curr.orcamento_valor || 0), 0);

    return jsonResponse({
      total: osList.length,
      triagem,
      emAndamento,
      aguardandoAprovacao,
      testes,
      concluido,
      entregue,
      sla: {
        noPrazo: Math.max(1, osList.length - 1),
        emAlerta: 1,
        atrasadas: 0,
        tempoMedioResolucaoHoras: 14.8
      },
      faturamentoMes: faturamento
    });
  }

  // 6. OS: Listagem & Criação
  if (pathname === '/api/os') {
    const osList = getStoredOS();

    if (method === 'GET') {
      const search = parsedUrl.searchParams.get('search')?.toLowerCase() || '';
      const apenasAtivas = parsedUrl.searchParams.get('apenas_ativas') === 'true';
      const prioridade = parsedUrl.searchParams.get('prioridade');
      const tipo = parsedUrl.searchParams.get('tipo_equipamento');
      const status = parsedUrl.searchParams.get('status');

      let filtered = [...osList];
      if (apenasAtivas) {
        filtered = filtered.filter(o => ['TRIAGEM', 'EM_ANDAMENTO', 'AGUARDANDO_PECA', 'AGUARDANDO_APROVACAO', 'TESTES', 'CONCLUIDO'].includes(o.status));
      } else if (status && status !== 'TODOS') {
        filtered = filtered.filter(o => o.status === status);
      }
      if (search) {
        filtered = filtered.filter(o => 
          o.codigo_os?.toLowerCase().includes(search) ||
          o.cliente_nome?.toLowerCase().includes(search) ||
          o.marca_modelo?.toLowerCase().includes(search)
        );
      }
      if (prioridade && prioridade !== 'TODAS') {
        filtered = filtered.filter(o => o.prioridade === prioridade);
      }
      if (tipo && tipo !== 'TODOS') {
        filtered = filtered.filter(o => o.tipo_equipamento === tipo);
      }

      return jsonResponse({ os: filtered });
    }

    if (method === 'POST') {
      const newId = Date.now();
      const code = `OS-2026-${String(osList.length + 1).padStart(4, '0')}`;
      const newOS: OrdemServico = {
        id: newId,
        codigo_os: code,
        cliente_nome: body.cliente_nome || 'Cliente Demo',
        cliente_telefone: body.cliente_telefone || '(11) 99999-9999',
        cliente_whatsapp: body.cliente_whatsapp || body.cliente_telefone || '(11) 99999-9999',
        marca_modelo: body.marca_modelo || 'Equipamento em Avaliação',
        tipo_equipamento: body.tipo_equipamento || 'NOTEBOOK',
        defeito_relatado: body.defeito_relatado || 'Defeito informado na recepção.',
        status: 'TRIAGEM',
        prioridade: body.prioridade || 'MEDIA',
        prazo_entrega: body.prazo_entrega || new Date(Date.now() + 86400000 * 2).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        criado_por_id: 1,
        orcamento_valor: body.orcamento_valor || 0,
        valor_final: body.valor_final || 0,
        tempo_bancada_segundos: 0
      };
      const updated = [newOS, ...osList];
      saveStoredOS(updated);
      return jsonResponse({ success: true, os: newOS }, 201);
    }
  }

  // 7. OS: Status, Assumir, Bancada, Detalhes
  const matchOSAction = pathname.match(/^\/api\/os\/(\d+)(?:\/(status|assumir|bancada|orcamento))?$/);
  if (matchOSAction) {
    const osId = parseInt(matchOSAction[1], 10);
    const action = matchOSAction[2];
    const osList = getStoredOS();
    const idx = osList.findIndex(o => o.id === osId);

    if (idx === -1) {
      return jsonResponse({ error: 'Ordem de serviço não encontrada' }, 404);
    }

    const currentOS = { ...osList[idx] };

    if (method === 'GET') {
      return jsonResponse({ os: currentOS });
    }

    if (method === 'PATCH' || method === 'PUT') {
      if (action === 'status') {
        currentOS.status = body.status || currentOS.status;
      } else if (action === 'assumir') {
        const user = getCurrentUser();
        currentOS.tecnico_id = user.id;
        currentOS.tecnico = user;
        currentOS.status = 'EM_ANDAMENTO';
      } else if (action === 'bancada') {
        if (body.tempo_bancada_segundos !== undefined) {
          currentOS.tempo_bancada_segundos = body.tempo_bancada_segundos;
        }
        if (body.laudo_tecnico) currentOS.laudo_tecnico = body.laudo_tecnico;
      } else if (action === 'orcamento') {
        if (body.orcamento_valor !== undefined) currentOS.orcamento_valor = body.orcamento_valor;
        if (body.valor_final !== undefined) currentOS.valor_final = body.valor_final;
      } else {
        Object.assign(currentOS, body);
      }

      currentOS.updatedAt = new Date().toISOString();
      osList[idx] = currentOS;
      saveStoredOS(osList);
      return jsonResponse({ success: true, os: currentOS });
    }
  }

  // 8. Consulta Pública de OS por código
  const matchPublic = pathname.match(/^\/api\/public\/os\/([^/]+)$/);
  if (matchPublic) {
    const searchCode = decodeURIComponent(matchPublic[1]).toUpperCase();
    const osList = getStoredOS();
    const found = osList.find(o => o.codigo_os.toUpperCase() === searchCode) || osList[0];
    return jsonResponse({ os: found });
  }

  // 9. Dados da Empresa
  if (pathname === '/api/empresa/public' || pathname === '/api/empresa/config') {
    return jsonResponse(pathname.includes('public') ? MOCK_EMPRESA_CONFIG : { config: MOCK_EMPRESA_CONFIG });
  }

  // 10. Estoque
  if (pathname.startsWith('/api/estoque')) {
    const estoque = getStoredEstoque();
    if (method === 'GET') {
      return jsonResponse({
        itens: estoque,
        metricas: {
          totalProdutosCadastrados: estoque.length,
          totalUnidadesEstoque: estoque.reduce((a, b) => a + (b.quantidade || 0), 0),
          custoTotalEstoque: estoque.reduce((a, b) => a + ((b.preco_custo || 0) * (b.quantidade || 0)), 0),
          valorTotalVendaEstoque: estoque.reduce((a, b) => a + ((b.preco_venda || 0) * (b.quantidade || 0)), 0),
          lucroPotencialEstoque: estoque.reduce((a, b) => a + (((b.preco_venda || 0) - (b.preco_custo || 0)) * (b.quantidade || 0)), 0),
          itensBaixoEstoque: estoque.filter(b => (b.quantidade || 0) <= (b.estoque_minimo || 2)).length
        }
      });
    }
    if (method === 'POST') {
      const newItem = { id: Date.now(), ...body };
      const updated = [newItem, ...estoque];
      saveStoredEstoque(updated);
      return jsonResponse({ success: true, item: newItem }, 201);
    }
  }

  // 11. Usuários
  if (pathname === '/api/users') {
    return jsonResponse({ users: MOCK_DEMO_USERS });
  }

  // 12. Vendas PDV
  if (pathname === '/api/vendas') {
    if (method === 'GET') {
      return jsonResponse({ vendas: [] });
    }
    return jsonResponse({ success: true, venda: { id: Date.now(), ...body } }, 201);
  }

  // 13. Chat / Mensagens
  if (pathname.startsWith('/api/chat')) {
    return jsonResponse({ mensagens: [] });
  }

  // 14. Relatórios
  if (pathname.startsWith('/api/relatorios')) {
    return jsonResponse({
      faturamento: 4850,
      totalOS: 18,
      ticketMedio: 269.44,
      tempoMedioHoras: 14.8,
      concluidasNoPrazoPercent: 94.2
    });
  }

  // Fallback padrão genérico para endpoints não mapeados
  return jsonResponse({ success: true, message: 'Operação simulada em modo estático/demonstração.' });
}
