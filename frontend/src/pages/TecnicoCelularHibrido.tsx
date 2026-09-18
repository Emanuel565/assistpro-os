import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { OrdemServico } from '../types';
import { getAuthToken } from '../utils/auth';
import { OSCard } from '../components/OSCard';
import { NewOSModal } from '../components/NewOSModal';
import { TechnicianBenchModal } from '../components/TechnicianBenchModal';
import { OSDetailsModal } from '../components/OSDetailsModal';
import { PrintTicketModal } from '../components/PrintTicketModal';
import { 
  Smartphone, 
  PlusCircle, 
  Gamepad2, 
  Tablet, 
  Wrench, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

export const TecnicoCelularHibrido: React.FC = () => {
  const { user } = useAuth();
  const { refreshTrigger } = useSocket();

  const [tipoFiltro, setTipoFiltro] = useState<string>('TODOS_HIBRIDOS');
  const [statusFiltro, setStatusFiltro] = useState<string>('ATIVOS');
  const [search, setSearch] = useState<string>('');
  const [osList, setOsList] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);

  // Modais
  const [showNewOSModal, setShowNewOSModal] = useState(false);
  const [benchOS, setBenchOS] = useState<OrdemServico | null>(null);
  const [selectedOSDetails, setSelectedOSDetails] = useState<OrdemServico | null>(null);
  const [selectedOSPrint, setSelectedOSPrint] = useState<OrdemServico | null>(null);

  const fetchOS = async () => {
    setLoading(true);
    try {
      let tipoQuery = 'SMARTPHONE,TABLET,CONSOLE';
      if (tipoFiltro === 'SMARTPHONE') tipoQuery = 'SMARTPHONE';
      else if (tipoFiltro === 'TABLET') tipoQuery = 'TABLET';
      else if (tipoFiltro === 'CONSOLE') tipoQuery = 'CONSOLE';

      let url = `/api/os?tipo_equipamento=${tipoQuery}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      const data = await res.json();
      if (data.os) {
        setOsList(data.os);
      }
    } catch (e) {
      console.error('Erro ao buscar ordens:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOS();
  }, [tipoFiltro, refreshTrigger]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOS();
  };

  // Filtro por status em memória
  const filteredOS = osList.filter(o => {
    if (statusFiltro === 'ATIVOS') {
      return ['TRIAGEM', 'EM_ANDAMENTO', 'AGUARDANDO_PECA', 'TESTES', 'AGUARDANDO_APROVACAO'].includes(o.status);
    }
    if (statusFiltro === 'ESPERA') {
      return o.status === 'AGUARDANDO_APROVACAO' || o.status === 'AGUARDANDO_PECA';
    }
    if (statusFiltro === 'CONCLUIDOS') {
      return o.status === 'CONCLUIDO' || o.status === 'ENTREGUE';
    }
    return true; // TODOS
  });

  const ativasCount = osList.filter(o => ['EM_ANDAMENTO', 'AGUARDANDO_PECA', 'TESTES', 'AGUARDANDO_APROVACAO'].includes(o.status)).length;
  const esperaCount = osList.filter(o => o.status === 'AGUARDANDO_APROVACAO').length;
  const celularesCount = osList.filter(o => o.tipo_equipamento === 'SMARTPHONE').length;
  const gamesCount = osList.filter(o => o.tipo_equipamento === 'CONSOLE').length;
  const tabletsCount = osList.filter(o => o.tipo_equipamento === 'TABLET').length;

  const handleUpdateStatus = async (os: OrdemServico, novoStatus: string, obs?: string) => {
    try {
      const res = await fetch(`/api/os/${os.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          status: novoStatus,
          observacao: obs || `Status alterado na bancada híbrida para ${novoStatus}.`
        })
      });
      if (res.ok) fetchOS();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
            {/* Header Apple Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-emerald-500" />
              Bancada Mobile: Celulares, Tablets & Consoles
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold uppercase tracking-wider">
              Fluxo Híbrido
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Acesso focado exclusivamente em smartphones, tablets e consoles com auto-atribuição direta.
          </p>
        </div>

        <button
          onClick={() => setShowNewOSModal(true)}
          className="apple-button-primary px-5 py-2.5 rounded-full text-white font-semibold text-xs shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 self-start sm:self-auto transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Abertura Rápida Balcão Híbrido</span>
        </button>
      </div>

      {/* 3 Cards de Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        
        {/* Card 1: Em Bancada / Espera */}
        <div className="bg-white dark:bg-[#121214] border border-black/10 dark:border-white/[0.08] shadow-sm dark:shadow-md rounded-3xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Aparelhos Ativos em Bancada</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-0.5">
                {ativasCount} <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">em reparo</span>
                {esperaCount > 0 && <span className="text-xs font-semibold text-amber-500 dark:text-amber-400 ml-1">({esperaCount} em espera)</span>}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/30">
            Auto-Atribuição
          </span>
        </div>

        {/* Card 2: Celulares & Tablets */}
        <div className="bg-white dark:bg-[#121214] border border-black/10 dark:border-white/[0.08] shadow-sm dark:shadow-md rounded-3xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Smartphones & Tablets</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-0.5">
                {celularesCount + tabletsCount} <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">aparelhos</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Consoles & Games */}
        <div className="bg-white dark:bg-[#121214] border border-black/10 dark:border-white/[0.08] shadow-sm dark:shadow-md rounded-3xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Consoles & Videogames</p>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-300 tracking-tight mt-0.5">
                {gamesCount} <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">games</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Barra de Filtros por Categoria & Busca */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between text-left">
        
        {/* Categorias Especializadas em Pílula */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { id: 'TODOS_HIBRIDOS', label: 'Todos os Meus Aparelhos', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'SMARTPHONE', label: 'Smartphones & Celulares', icon: <Smartphone className="w-3.5 h-3.5" /> },
            { id: 'TABLET', label: 'Tablets & iPads', icon: <Tablet className="w-3.5 h-3.5" /> },
            { id: 'CONSOLE', label: 'Consoles & Games', icon: <Gamepad2 className="w-3.5 h-3.5" /> }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setTipoFiltro(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                tipoFiltro === cat.id
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                  : 'bg-white dark:bg-[#121214] text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/[0.08]'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Status e Busca */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-slate-950 border border-black/10 dark:border-white/10 text-zinc-800 dark:text-white text-xs focus:outline-none focus:border-[#0071e3] cursor-pointer"
          >
            <option value="ATIVOS">Em Andamento / Ativos</option>
            <option value="ESPERA">Aguardando Aprovação / Peça</option>
            <option value="CONCLUIDOS">Concluídos / Entregues</option>
            <option value="TODOS">Todos os Status</option>
          </select>

          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-60">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente, modelo, OS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-full bg-black/[0.03] dark:bg-black/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-xs focus:border-[#0071e3] focus:outline-none"
            />
          </form>
        </div>

      </div>

      {/* Grid de Cards Especializados */}
      {loading ? (
        <div className="py-16 text-center text-zinc-400 text-xs">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-3" />
          Carregando bancada especializada...
        </div>
      ) : filteredOS.length === 0 ? (
        <div className="bg-white dark:bg-[#121214] border border-black/10 dark:border-white/[0.08] rounded-3xl py-16 px-4 text-center space-y-3 shadow-sm">
          <Smartphone className="w-12 h-12 text-emerald-500 mx-auto opacity-70" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Nenhum Aparelho Encontrado</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            Nenhuma OS de celular, tablet ou console encontrada com os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOS.map((os) => (
            <OSCard
              key={os.id}
              os={os}
              currentUserRole="TECNICO_CELULAR"
              onViewDetails={(selected) => setSelectedOSDetails(selected)}
              onBenchAction={(selected) => setBenchOS(selected)}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}

      {/* Modais */}
      <NewOSModal
        isOpen={showNewOSModal}
        onClose={() => setShowNewOSModal(false)}
        onSuccess={() => fetchOS()}
        defaultEquipmentType={tipoFiltro === 'CONSOLE' ? 'CONSOLE' : tipoFiltro === 'TABLET' ? 'TABLET' : 'SMARTPHONE'}
        autoAssignDirectly={true}
      />

      <TechnicianBenchModal
        os={benchOS}
        onClose={() => setBenchOS(null)}
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