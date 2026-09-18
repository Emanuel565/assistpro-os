import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { OrdemServico } from '../types';
import { getAuthToken } from '../utils/auth';
import { OSCard } from '../components/OSCard';
import { TechnicianBenchModal } from '../components/TechnicianBenchModal';
import { OSDetailsModal } from '../components/OSDetailsModal';
import { PrintTicketModal } from '../components/PrintTicketModal';
import { AssignTechnicianModal } from '../components/AssignTechnicianModal';
import { Wrench, Clock, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export const TecnicoBancada: React.FC = () => {
  const { user } = useAuth();
  const { refreshTrigger } = useSocket();

  const [osList, setOsList] = useState<OrdemServico[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [selectedTecnicoFilter, setSelectedTecnicoFilter] = useState<string>('MEU'); // MEU, TODOS, ou ID
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('ATIVAS');

  // Modais
  const [benchOS, setBenchOS] = useState<OrdemServico | null>(null);
  const [selectedOSDetails, setSelectedOSDetails] = useState<OrdemServico | null>(null);
  const [selectedOSPrint, setSelectedOSPrint] = useState<OrdemServico | null>(null);
  const [selectedOSAssign, setSelectedOSAssign] = useState<OrdemServico | null>(null);

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
      const res = await fetch('/api/os', {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      const data = await res.json();
      if (data.os) {
        setOsList(data.os);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  useEffect(() => {
    fetchOS();
  }, [refreshTrigger]);

  // Filtragem inteligente da bancada por técnico e status
  const filteredOS = osList.filter(o => {
    // Filtro por técnico
    if (selectedTecnicoFilter === 'MEU' && user?.cargo === 'TECNICO') {
      if (o.tecnico_id !== user.id) return false;
    } else if (selectedTecnicoFilter !== 'TODOS' && selectedTecnicoFilter !== 'MEU') {
      if (o.tecnico_id !== Number(selectedTecnicoFilter)) return false;
    }

    if (selectedFilter === 'ATIVAS') return ['EM_ANDAMENTO', 'AGUARDANDO_PECA', 'TESTES', 'AGUARDANDO_APROVACAO'].includes(o.status);
    if (selectedFilter === 'ESPERA') return o.status === 'AGUARDANDO_APROVACAO';
    if (selectedFilter === 'CONCLUIDAS') return o.status === 'CONCLUIDO' || o.status === 'ENTREGUE';
    if (selectedFilter === 'URGENTES') return o.prioridade === 'URGENTE' && o.status !== 'CONCLUIDO';
    return true;
  });

  const totalAtivas = osList.filter(o => ['EM_ANDAMENTO', 'AGUARDANDO_PECA', 'TESTES', 'AGUARDANDO_APROVACAO'].includes(o.status)).length;
  const totalEspera = osList.filter(o => o.status === 'AGUARDANDO_APROVACAO').length;
  const totalUrgentes = osList.filter(o => o.prioridade === 'URGENTE' && o.status !== 'CONCLUIDO').length;
  const totalConcluidas = osList.filter(o => o.status === 'CONCLUIDO' || o.status === 'ENTREGUE').length;

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
          observacao: obs || `Status alterado na bancada pelo técnico para ${novoStatus}.`
        })
      });
      if (res.ok) fetchOS();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Apple Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              Estação de Bancada
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            {user?.cargo === 'TECNICO' ? 'Minha Bancada de Manutenção' : 'Bancada Técnica de Manutenção'}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Fila de ordens de serviço atribuídas para manutenção, laudos e testes de bancada.
          </p>
        </div>

        {/* Abas Rápidas de Filtro Apple Pill */}
        <div className="flex flex-wrap items-center gap-1 bg-white dark:bg-[#121214] p-1 rounded-full border border-black/10 dark:border-white/[0.08] shadow-sm self-start sm:self-auto text-xs">
          <button
            onClick={() => setSelectedFilter('ATIVAS')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
              selectedFilter === 'ATIVAS' ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Na Bancada ({totalAtivas})
          </button>
          <button
            onClick={() => setSelectedFilter('ESPERA')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'ESPERA' ? 'bg-orange-500 text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400'
            }`}
          >
            <span>Aguardando Cliente</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{totalEspera}</span>
          </button>
          <button
            onClick={() => setSelectedFilter('URGENTES')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
              selectedFilter === 'URGENTES' ? 'bg-rose-500 text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400'
            }`}
          >
            Urgentes ({totalUrgentes})
          </button>
          <button
            onClick={() => setSelectedFilter('CONCLUIDAS')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
              selectedFilter === 'CONCLUIDAS' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Finalizadas ({totalConcluidas})
          </button>
        </div>
      </div>

      {/* Seletor de Bancada para Gestores e Admins em Pills */}
      {(user?.cargo === 'ADMIN' || user?.cargo === 'GERENTE') && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-left">
          <span className="text-zinc-500 dark:text-zinc-400 font-semibold mr-1">Filtrar Bancada:</span>
          <button
            onClick={() => setSelectedTecnicoFilter('TODOS')}
            className={`px-3.5 py-1.5 rounded-full font-semibold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shadow-sm ${
              selectedTecnicoFilter === 'TODOS' ? 'bg-zinc-900 text-white dark:bg-white dark:text-black' : 'bg-white dark:bg-[#121214] hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 border border-black/10 dark:border-white/[0.08]'
            }`}
          >
            <span>🏢 Todas as Bancadas</span>
          </button>
          {teamMembers.filter(m => ['TECNICO', 'TECNICO_CELULAR', 'ADMIN'].includes(m.cargo)).map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTecnicoFilter(String(t.id))}
              className={`px-3.5 py-1.5 rounded-full font-semibold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                selectedTecnicoFilter === String(t.id) ? 'bg-[#0071e3] text-white' : 'bg-white dark:bg-[#121214] hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 border border-black/10 dark:border-white/[0.08]'
              }`}
            >
              <Wrench className="w-3 h-3 text-zinc-400" />
              <span>Bancada de {t.nome.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Grid de OS da Bancada */}
      {loading ? (
        <div className="py-16 text-center text-zinc-400 text-xs">Carregando sua bancada...</div>
      ) : filteredOS.length === 0 ? (
        <div className="bg-white dark:bg-[#121214] border border-black/10 dark:border-white/[0.08] rounded-3xl py-16 px-4 text-center space-y-2 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-zinc-400 mx-auto opacity-60" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Nenhuma OS nesta etapa</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            Você não possui ordens de serviço pendentes neste filtro.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOS.map((os) => (
            <OSCard
              key={os.id}
              os={os}
              currentUserRole="TECNICO"
              onViewDetails={(selected) => setSelectedOSDetails(selected)}
              onAssign={(selected) => setSelectedOSAssign(selected)}
              onBenchAction={(selected) => setBenchOS(selected)}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}

      {/* Modais */}
      <AssignTechnicianModal
        os={selectedOSAssign}
        onClose={() => setSelectedOSAssign(null)}
        onSuccess={() => fetchOS()}
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