import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { OrdemServico } from '../types';
import { getAuthToken } from '../utils/auth';
import { OSCard } from '../components/OSCard';
import { NewOSModal } from '../components/NewOSModal';
import { OSDetailsModal } from '../components/OSDetailsModal';
import { PrintTicketModal } from '../components/PrintTicketModal';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  Laptop, 
  AlertCircle,
  PackageCheck,
  Wrench
} from 'lucide-react';

export const AtendenteDashboard: React.FC = () => {
  const { user } = useAuth();
  const { refreshTrigger } = useSocket();

  const [osList, setOsList] = useState<OrdemServico[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('TODOS');
  const [selectedTipo, setSelectedTipo] = useState('TODOS');
  const [selectedTecnico, setSelectedTecnico] = useState<string>('TODOS'); // TODOS, SEM_TECNICO, ou ID do técnico

  // Modais
  const [showNewOSModal, setShowNewOSModal] = useState(false);
  const [selectedOSDetails, setSelectedOSDetails] = useState<OrdemServico | null>(null);
  const [selectedOSPrint, setSelectedOSPrint] = useState<OrdemServico | null>(null);

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/chat/membros', {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      const data = await res.json();
      if (res.ok) setTeamMembers(data.usuarios || []);
    } catch {}
  };

  const fetchOS = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedStatus !== 'TODOS') params.append('status', selectedStatus);
      if (selectedTipo !== 'TODOS') params.append('tipo_equipamento', selectedTipo);
      if (selectedTecnico !== 'TODOS' && selectedTecnico !== 'SEM_TECNICO') {
        params.append('tecnico_id', selectedTecnico);
      }

      const res = await fetch(`/api/os?${params.toString()}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      const data = await res.json();
      if (data.os) {
        let list = data.os;
        if (selectedTecnico === 'SEM_TECNICO') {
          list = list.filter((o: OrdemServico) => !o.tecnico_id);
        }
        setOsList(list);
      }
    } catch (e) {
      console.error('Erro ao buscar OS:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  useEffect(() => {
    fetchOS();
  }, [refreshTrigger, search, selectedStatus, selectedTipo, selectedTecnico]);

  const handleDeliver = async (os: OrdemServico) => {
    if (!window.confirm(`Confirmar entrega da OS ${os.codigo_os} para o cliente ${os.cliente_nome}?`)) return;

    try {
      const res = await fetch(`/api/os/${os.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          status: 'ENTREGUE',
          observacao: 'Aparelho entregue ao cliente e finalizado no balcão de atendimento.'
        })
      });

      if (res.ok) {
        fetchOS();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Métricas rápidas
  const totalTriagem = osList.filter(o => o.status === 'TRIAGEM').length;
  const totalEmAndamento = osList.filter(o => ['EM_ANDAMENTO', 'AGUARDANDO_PECA', 'TESTES'].includes(o.status)).length;
  const totalProntasEntrega = osList.filter(o => o.status === 'CONCLUIDO').length;

  return (
    <div className="space-y-6 text-left">
      
      {/* Header do Balcão Apple Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Estação de Atendimento
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            Recepção & Abertura de OS
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Atendimento ao cliente, abertura de chamados técnicos e entrega de aparelhos.
          </p>
        </div>

        <button
          onClick={() => setShowNewOSModal(true)}
          className="apple-button-primary px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg hover:shadow-blue-500/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nova Ordem de Serviço</span>
        </button>
      </div>

      {/* Cards de Métricas do Balcão Estilo Apple */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white dark:bg-[#121214] rounded-3xl p-5 border border-black/10 dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 transition-all flex items-center gap-4 shadow-sm dark:shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Aguardando Triagem</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-0.5">
              {totalTriagem} <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">aparelhos</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121214] rounded-3xl p-5 border border-black/10 dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 transition-all flex items-center gap-4 shadow-sm dark:shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 text-[#0071e3] flex items-center justify-center shrink-0">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Em Manutenção / Bancada</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-0.5">
              {totalEmAndamento} <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">em reparo</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121214] rounded-3xl p-5 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex items-center gap-4 shadow-sm dark:shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Pronto para Retirada</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-0.5">
              {totalProntasEntrega} <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">aguardando cliente</span>
            </p>
          </div>
        </div>
      </div>

      {/* Seletor Rápido de Filas de Trabalho por Técnico em Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedTecnico('TODOS')}
          className={`px-4 py-2 rounded-full font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm ${
            selectedTecnico === 'TODOS' 
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-black' 
              : 'bg-white dark:bg-[#121214] hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 border border-black/10 dark:border-white/[0.08]'
          }`}
        >
          <span>🏢 Toda a Oficina</span>
        </button>

        {teamMembers.filter(m => ['TECNICO', 'TECNICO_CELULAR', 'TRAINEE', 'ADMIN', 'GERENTE'].includes(m.cargo)).map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTecnico(String(t.id))}
            className={`px-4 py-2 rounded-full font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm ${
              selectedTecnico === String(t.id) 
                ? 'bg-[#0071e3] text-white' 
                : 'bg-white dark:bg-[#121214] hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 border border-black/10 dark:border-white/[0.08]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-zinc-400" />
            <span>Fila de {t.nome.split(' ')[0]}</span>
          </button>
        ))}

        <button
          onClick={() => setSelectedTecnico('SEM_TECNICO')}
          className={`px-4 py-2 rounded-full font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm ${
            selectedTecnico === 'SEM_TECNICO' 
              ? 'bg-amber-500 text-white' 
              : 'bg-white dark:bg-[#121214] hover:bg-black/5 dark:hover:bg-white/10 text-amber-600 dark:text-amber-300 border border-amber-500/20'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>⏳ Sem Técnico</span>
        </button>
      </div>

      {/* Barra de Filtros & Busca Apple Pill */}
      <div className="bg-white dark:bg-[#121214] rounded-full p-2 px-4 border border-black/10 dark:border-white/[0.08] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, telefone, OS ou modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 rounded-full bg-black/[0.03] dark:bg-black/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-xs focus:border-[#0071e3] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-slate-950 border border-black/10 dark:border-white/10 text-zinc-800 dark:text-white text-xs focus:outline-none focus:border-[#0071e3]"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="TRIAGEM">Triagem</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="AGUARDANDO_PECA">Aguardando Peça</option>
            <option value="TESTES">Em Testes</option>
            <option value="CONCLUIDO">Concluído (Pronto)</option>
            <option value="ENTREGUE">Entregue</option>
          </select>

          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-slate-950 border border-black/10 dark:border-white/10 text-zinc-800 dark:text-white text-xs focus:outline-none focus:border-[#0071e3]"
          >
            <option value="TODOS">Todos os Equipamentos</option>
            <option value="NOTEBOOK">Notebook</option>
            <option value="SMARTPHONE">Smartphone / Celular</option>
            <option value="PC_DESKTOP">PC Desktop</option>
            <option value="CONSOLE">Console</option>
          </select>
        </div>
      </div>

      {/* Grid de Cards de OS */}
      {loading ? (
        <div className="py-16 text-center text-zinc-400 text-xs">Carregando ordens de serviço...</div>
      ) : osList.length === 0 ? (
        <div className="glass-panel rounded-3xl py-16 px-4 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Nenhuma Ordem de Serviço Encontrada</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            Não há atendimentos correspondentes aos filtros aplicados. Clique no botão abaixo para abrir uma nova OS.
          </p>
          <button
            onClick={() => setShowNewOSModal(true)}
            className="apple-button-primary px-4 py-2 rounded-xl text-white font-semibold text-xs inline-flex items-center gap-2 mt-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Nova OS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {osList.map((os) => (
            <OSCard
              key={os.id}
              os={os}
              currentUserRole={user?.cargo || 'ATENDENTE'}
              onViewDetails={(selected) => setSelectedOSDetails(selected)}
              onDeliver={(selected) => handleDeliver(selected)}
            />
          ))}
        </div>
      )}

      {/* Modais */}
      <NewOSModal
        isOpen={showNewOSModal}
        onClose={() => setShowNewOSModal(false)}
        onSuccess={() => fetchOS()}
      />

      <OSDetailsModal
        os={selectedOSDetails}
        onClose={() => setSelectedOSDetails(null)}
        onOpenPrint={(osToPrint) => {
          setSelectedOSDetails(null);
          setSelectedOSPrint(osToPrint);
        }}
      />

      <PrintTicketModal
        os={selectedOSPrint}
        onClose={() => setSelectedOSPrint(null)}
      />

    </div>
  );
};