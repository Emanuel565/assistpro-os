import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  ClipboardList, 
  Wrench, 
  Smartphone, 
  ArrowRight, 
  KeyRound, 
  Check, 
  Search,
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';

interface PublicUser {
  id: number;
  nome: string;
  login: string;
  cargo: string;
}

interface ModalityInfo {
  cargo: string;
  login: string;
  tag: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  gradient: string;
  badgeBg: string;
}

const MODALITIES: Record<string, ModalityInfo> = {
  ADMIN: {
    cargo: 'ADMIN',
    login: 'admin',
    tag: 'Diretoria & Finanças',
    title: 'Administrador Geral',
    desc: 'Controle financeiro total, DRE, comissões, relatórios executivos e configurações completas.',
    icon: ShieldCheck,
    gradient: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  },
  GERENTE: {
    cargo: 'GERENTE',
    login: 'gerente',
    tag: 'Triagem & Operação',
    title: 'Gerente de Oficina',
    desc: 'Quadro Kanban em tempo real, monitoramento de SLA, distribuição de técnicos e controle de prazos.',
    icon: LayoutDashboard,
    gradient: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  },
  ATENDENTE: {
    cargo: 'ATENDENTE',
    login: 'atendente',
    tag: 'Recepção & Vendas',
    title: 'Atendente de Balcão',
    desc: 'Abertura rápida de OS com checklist e fotos, frente de caixa (PDV), recibos e aviso ao cliente.',
    icon: ClipboardList,
    gradient: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  TECNICO: {
    cargo: 'TECNICO',
    login: 'tecnico',
    tag: 'Bancada Computadores',
    title: 'Técnico em Hardware',
    desc: 'Bancada de reparo para notebooks, PCs gamer, placas-mãe, diagnósticos e cronômetro de bancada.',
    icon: Wrench,
    gradient: 'from-cyan-500 to-blue-600',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
  },
  TECNICO_CELULAR: {
    cargo: 'TECNICO_CELULAR',
    login: 'tecnico_celular',
    tag: 'Bancada Smartphones',
    title: 'Especialista Mobile',
    desc: 'Reparo avançado de iPhones, Android, tablets, troca de telas, micro-solda e baterias.',
    icon: Smartphone,
    gradient: 'from-purple-500 to-pink-600',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  }
};

import { MOCK_DEMO_USERS } from '../utils/mockData';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, user } = useAuth();
  
  const [publicUsers, setPublicUsers] = useState<PublicUser[]>(MOCK_DEMO_USERS);
  const [selectedUser, setSelectedUser] = useState<PublicUser | null>(MOCK_DEMO_USERS[0]);
  const [senhaInput, setSenhaInput] = useState('123456');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/auth/public-users')
      .then(res => res.json())
      .then(data => {
        if (data.users && data.users.length > 0) {
          setPublicUsers(data.users);
          const adminUser = data.users.find((u: PublicUser) => u.login === 'admin') || data.users[0];
          setSelectedUser(adminUser);
        }
      })
      .catch(() => {});
  }, []);

  // Redireciona automaticamente se já estiver autenticado
  if (isAuthenticated && user) {
    if (user.cargo === 'GERENTE' || user.cargo === 'ADMIN' || user.cargo === 'TECNICO_CELULAR') {
      return <Navigate to="/gerente" replace />;
    }
    if (user.cargo === 'ATENDENTE') {
      return <Navigate to="/atendente" replace />;
    }
    if (user.cargo === 'TECNICO') {
      return <Navigate to="/tecnico" replace />;
    }
    return <Navigate to="/" replace />;
  }

  const handleSelectModality = (u: PublicUser) => {
    setSelectedUser(u);
    setError(null);
    setSenhaInput('123456');
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 50);
  };

  const handleQuickLogin = async (targetUser: PublicUser) => {
    setError(null);
    setSubmitting(true);
    try {
      await login(targetUser.login, '123456');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setError(null);

    if (!senhaInput) {
      setError('Por favor, informe a senha de acesso.');
      return;
    }

    setSubmitting(true);
    try {
      await login(selectedUser.login, senhaInput);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Senha incorreta. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans antialiased relative transition-colors duration-300">
      
      {/* Barra de Navegação Apple Style */}
      <header className="sticky top-0 z-50 w-full border-b border-black/10 dark:border-white/[0.08] bg-white/75 dark:bg-black/70 backdrop-blur-2xl px-6 py-3.5 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 border border-black/10 dark:border-white/20 flex items-center justify-center shadow-sm">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold tracking-tight text-zinc-900 dark:text-white text-sm">AssistPro</span>
              <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 border border-black/10 dark:border-white/10">
                OS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link 
              to="/consulta" 
              className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/10 dark:border-white/[0.06]"
            >
              <Search className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>Consulta Pública da OS</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center space-y-12 text-left">
        
        {/* Headline Apple */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Sistema de Gestão para Assistência Técnica
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white">
            Simplicidade na forma.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-500 dark:from-zinc-200 dark:via-zinc-400 dark:to-zinc-600">
              Poder absoluto na bancada.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed pt-1">
            Selecione uma das estações de trabalho abaixo para entrar com o perfil correspondente.
          </p>
        </div>

        {/* Grade de Perfis por Modalidade (Cards Estilo Apple Hardware) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {publicUsers.map((u) => {
            const meta = MODALITIES[u.cargo] || {
              cargo: u.cargo,
              login: u.login,
              tag: 'Estação de Trabalho',
              title: u.nome,
              desc: 'Operação do sistema na assistência técnica.',
              icon: Wrench,
              gradient: 'from-zinc-500 to-zinc-700',
              badgeBg: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
            };

            const Icon = meta.icon;
            const isSelected = selectedUser?.id === u.id;

            return (
              <div
                key={u.id}
                onClick={() => handleSelectModality(u)}
                className={`relative rounded-3xl p-5 border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer group select-none ${
                  isSelected 
                    ? 'bg-white dark:bg-[#161617] border-blue-500/40 dark:border-white/30 shadow-[0_12px_36px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.8)] scale-[1.02] ring-1 ring-blue-500/30 dark:ring-white/20' 
                    : 'bg-white/80 dark:bg-[#111113]/80 hover:bg-white dark:hover:bg-[#161617] border-black/5 dark:border-white/[0.08] hover:border-black/15 dark:hover:border-white/[0.18] shadow-sm'
                }`}
              >
                {/* Header do Card */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${meta.gradient} p-0.5 shadow-md flex items-center justify-center`}>
                      <div className="w-full h-full bg-white dark:bg-black/60 rounded-[14px] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-zinc-900 dark:text-white" />
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.badgeBg}`}>
                      {meta.tag}
                    </span>
                    <h2 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight mt-2.5">
                      {meta.title}
                    </h2>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed line-clamp-3">
                      {meta.desc}
                    </p>
                  </div>
                </div>

                {/* Ação do Card */}
                <div className="pt-5 mt-4 border-t border-black/5 dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">@{u.login}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickLogin(u);
                    }}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                        : 'bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <span>Acessar</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Caixa de Entrada de Senha Estilo Apple Dialog */}
        {selectedUser && (
          <div className="max-w-md w-full mx-auto bg-white dark:bg-[#161617] rounded-3xl p-6 border border-black/10 dark:border-white/[0.12] shadow-2xl space-y-4 text-center animate-slide-up transition-colors">
            
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/10 dark:border-white/10 text-zinc-800 dark:text-white flex items-center justify-center mx-auto mb-2">
                <Lock className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
                Entrar como {selectedUser.nome}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Estação de trabalho: <span className="font-medium text-zinc-800 dark:text-zinc-200">{selectedUser.cargo}</span> • Login: <span className="font-mono text-zinc-800 dark:text-zinc-200">@{selectedUser.login}</span>
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="relative">
                <input
                  ref={passwordInputRef}
                  type="password"
                  required
                  placeholder="Digite a senha..."
                  value={senhaInput}
                  onChange={(e) => setSenhaInput(e.target.value)}
                  className="w-full px-5 py-3 rounded-full bg-black/[0.03] dark:bg-black/60 border border-black/10 dark:border-white/15 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-sm focus:border-blue-500 focus:outline-none tracking-wider text-center transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={submitting || isLoading}
                  className="flex-1 py-3 apple-button-primary text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <span>{submitting ? 'Verificando...' : 'Entrar no Sistema'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Senha padrão: <strong className="text-zinc-700 dark:text-zinc-400 font-mono">123456</strong></span>
              <button 
                type="button"
                onClick={() => setSenhaInput('123456')}
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
              >
                Preencher 123456
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Rodapé Apple */}
      <footer className="border-t border-black/10 dark:border-white/[0.08] py-6 px-6 bg-white/60 dark:bg-black text-center text-xs text-zinc-500 space-y-1 transition-colors">
        <p>AssistPro OS • Plataforma de Gestão Profissional para Assistência Técnica</p>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-600">Projetado para desempenho em bancada, alta velocidade e facilidade de uso.</p>
      </footer>

    </div>
  );
};