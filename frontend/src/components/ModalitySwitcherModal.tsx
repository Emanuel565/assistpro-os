import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  ClipboardList, 
  Wrench, 
  Smartphone, 
  Check, 
  X, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ModalitySwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModalityOption {
  cargo: string;
  login: string;
  title: string;
  tag: string;
  desc: string;
  route: string;
  icon: React.ElementType;
  gradient: string;
  badgeBg: string;
}

const MODALITIES: ModalityOption[] = [
  {
    cargo: 'ADMIN',
    login: 'admin',
    title: 'Administrador Geral',
    tag: 'Diretoria & Finanças',
    desc: 'Visão executiva total, relatórios de faturamento, controle de colaboradores e configurações da empresa.',
    route: '/gerente',
    icon: ShieldCheck,
    gradient: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  },
  {
    cargo: 'GERENTE',
    login: 'gerente',
    title: 'Gerente de Oficina',
    tag: 'Triagem & Operação',
    desc: 'Quadro Kanban interativo, monitoramento de prazos e SLA crítico, e distribuição de serviços aos técnicos.',
    route: '/gerente',
    icon: LayoutDashboard,
    gradient: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  },
  {
    cargo: 'ATENDENTE',
    login: 'atendente',
    title: 'Atendente de Balcão',
    tag: 'Recepção & Vendas',
    desc: 'Abertura rápida de OS com checklist e fotos, frente de caixa (PDV), comprovantes térmicos e WhatsApp.',
    route: '/atendente',
    icon: ClipboardList,
    gradient: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  {
    cargo: 'TECNICO',
    login: 'tecnico',
    title: 'Técnico em Hardware',
    tag: 'Bancada Computadores',
    desc: 'Bancada técnica dedicada para reparos de notebooks, PCs, placas-mãe, diagnósticos e cronômetro.',
    route: '/tecnico',
    icon: Wrench,
    gradient: 'from-cyan-500 to-blue-600',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
  },
  {
    cargo: 'TECNICO_CELULAR',
    login: 'tecnico_celular',
    title: 'Especialista Mobile',
    tag: 'Bancada Smartphones',
    desc: 'Bancada para reparo avançado de iPhones, celulares Android, tablets, troca de telas e micro-solda.',
    route: '/celular-hibrido',
    icon: Smartphone,
    gradient: 'from-purple-500 to-pink-600',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  }
];

export const ModalitySwitcherModal: React.FC<ModalitySwitcherModalProps> = ({ isOpen, onClose }) => {
  const { user, switchDemo } = useAuth();
  const navigate = useNavigate();
  const [switching, setSwitching] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = async (modality: ModalityOption) => {
    setSwitching(modality.cargo);
    try {
      await switchDemo(undefined, modality.cargo as any);
      onClose();
      navigate(modality.route);
    } catch (e) {
      console.error('Falha ao alternar perfil:', e);
    } finally {
      setSwitching(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-[#121214] border border-black/10 dark:border-white/10 rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.3)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.8)] p-6 sm:p-8 space-y-6 animate-slide-up text-left transition-colors">
        
        {/* Header Apple Style */}
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Perfis Genéricos por Modalidade
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Alternar Estação de Trabalho
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Explore a experiência de cada função da assistência técnica com 1 clique.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Modalidades Estilo Apple */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {MODALITIES.map((mod) => {
            const isCurrent = user?.cargo === mod.cargo;
            const Icon = mod.icon;
            const isTarget = switching === mod.cargo;

            return (
              <div
                key={mod.cargo}
                onClick={() => !isCurrent && handleSelect(mod)}
                className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer select-none group ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-blue-600/15 border-blue-300 dark:border-blue-500/40 shadow-inner cursor-default'
                    : 'bg-black/[0.02] dark:bg-[#18181b]/70 hover:bg-black/[0.05] dark:hover:bg-[#202024] border-black/5 dark:border-white/[0.06] hover:border-black/15 dark:hover:border-white/[0.16]'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${mod.gradient} p-0.5 shadow-md shrink-0 flex items-center justify-center`}>
                    <div className="w-full h-full bg-white dark:bg-black/60 rounded-[14px] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-zinc-900 dark:text-white" />
                    </div>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                        {mod.title}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${mod.badgeBg}`}>
                        {mod.tag}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                        @{mod.login}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                      {mod.desc}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-500/40 text-xs font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ativo</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={isTarget}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/[0.08] hover:bg-blue-600 hover:text-white text-zinc-700 dark:text-zinc-200 border border-black/10 dark:border-white/10 hover:border-blue-500 text-xs font-semibold transition-all shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 cursor-pointer"
                    >
                      <span>{isTarget ? 'Alternando...' : 'Alternar'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé Apple */}
        <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 border-t border-black/10 dark:border-white/[0.06]">
          <span>Todas as modalidades usam credenciais padrão unificadas.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-zinc-800 dark:text-white font-medium transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
