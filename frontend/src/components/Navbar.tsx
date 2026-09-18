import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { ModalitySwitcherModal } from './ModalitySwitcherModal';
import { ThemeToggle } from './ThemeToggle';
import { 
  Wrench, 
  Bell, 
  LogOut, 
  Users, 
  LayoutDashboard, 
  Smartphone, 
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  Copy,
  Check,
  Monitor,
  BarChart3,
  Package,
  X,
  MessageSquare,
  ChevronDown,
  Sparkles,
  Settings
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface NavbarProps {
  onOpenChat?: () => void;
  unreadChatCount?: number;
}

const MODALITY_SHORT_TITLES: Record<string, { title: string; color: string; dot: string }> = {
  ADMIN: { title: 'Administrador', color: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  GERENTE: { title: 'Gerente Oficina', color: 'text-amber-800 dark:text-amber-400', dot: 'bg-amber-500' },
  ATENDENTE: { title: 'Atendente Balcão', color: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  TECNICO: { title: 'Técnico Hardware', color: 'text-cyan-700 dark:text-cyan-400', dot: 'bg-cyan-500' },
  TECNICO_CELULAR: { title: 'Especialista Mobile', color: 'text-purple-700 dark:text-purple-400', dot: 'bg-purple-500' }
};

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat, unreadChatCount }) => {
  const { user, logout } = useAuth();
  const { isConnected, notifications, unreadCount, markNotificationsAsRead } = useSocket();
  const location = useLocation();

  const [showModalityModal, setShowModalityModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/network-info')
      .then(res => res.json())
      .then(data => setNetworkInfo(data))
      .catch(() => {});
  }, [user]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getInitials = (name: string) => {
    if (!name) return 'AP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (!user) return null;

  const currentModalityMeta = MODALITY_SHORT_TITLES[user.cargo] || {
    title: user.cargo,
    color: 'text-zinc-300',
    dot: 'bg-zinc-400'
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-header border-b px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Logo & Seletor de Modalidade Apple Style */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 border border-black/10 dark:border-white/20 flex items-center justify-center shadow-sm group-hover:scale-105 transition-all">
              <Wrench className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold tracking-tight text-zinc-900 dark:text-white text-sm">
                AssistPro
              </span>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 border border-black/10 dark:border-white/10">
                OS
              </span>
              <span 
                className={`w-2 h-2 rounded-full ml-1 ${isConnected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-rose-500 animate-ping'}`} 
                title={isConnected ? 'Servidor Conectado em Tempo Real' : 'Desconectado'} 
              />
            </div>
          </Link>

          {/* Botão de Troca Rápida de Modalidade Apple Pill */}
          <button
            onClick={() => setShowModalityModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/10 dark:border-white/[0.1] hover:border-black/20 dark:hover:border-white/20 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer shadow-sm"
            title="Clique para alternar entre as 5 modalidades do sistema"
          >
            <span className={`w-2 h-2 rounded-full ${currentModalityMeta.dot}`} />
            <span className="hidden sm:inline font-semibold">{currentModalityMeta.title}</span>
            <span className="sm:hidden font-semibold">{user.cargo}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500 dark:text-zinc-400 ml-0.5" />
          </button>
        </div>

        {/* Navegação Central por Cargo com Abas Apple Pill */}
        <nav className="hidden xl:flex items-center gap-1 bg-black/[0.04] dark:bg-[#121214]/90 p-1 rounded-full border border-black/10 dark:border-white/[0.08]">
          {(user.cargo === 'ADMIN' || user.cargo === 'GERENTE' || user.cargo === 'TECNICO_CELULAR') && (
            <Link
              to="/gerente"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                location.pathname === '/gerente' 
                  ? 'bg-white dark:bg-white/15 text-zinc-900 dark:text-white shadow-sm font-semibold' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Triagem Kanban</span>
            </Link>
          )}

          {(user.cargo === 'ADMIN' || user.cargo === 'ATENDENTE' || user.cargo === 'GERENTE' || user.cargo === 'TECNICO_CELULAR') && (
            <Link
              to="/atendente"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                location.pathname === '/atendente' 
                  ? 'bg-white dark:bg-white/15 text-zinc-900 dark:text-white shadow-sm font-semibold' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Recepção & Balcão</span>
            </Link>
          )}

          {/* Venda Balcão / PDV */}
          <Link
            to="/pdv"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              location.pathname === '/pdv' 
                ? 'bg-emerald-600 text-white shadow-sm font-semibold' 
                : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>Venda Balcão (PDV)</span>
          </Link>

          {(user.cargo === 'ADMIN' || user.cargo === 'TECNICO' || user.cargo === 'GERENTE' || user.cargo === 'TECNICO_CELULAR') && (
            <Link
              to="/tecnico"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                location.pathname === '/tecnico' 
                  ? 'bg-white dark:bg-white/15 text-zinc-900 dark:text-white shadow-sm font-semibold' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Minha Bancada</span>
            </Link>
          )}

          {(user.cargo === 'ADMIN' || user.cargo === 'TECNICO_CELULAR' || user.cargo === 'GERENTE') && (
            <Link
              to="/celular-hibrido"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                location.pathname === '/celular-hibrido' 
                  ? 'bg-white dark:bg-white/15 text-zinc-900 dark:text-white shadow-sm font-semibold' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Módulo Mobile</span>
            </Link>
          )}

          {(user.cargo === 'ADMIN' || user.cargo === 'GERENTE') && (
            <Link
              to="/admin/estoque"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                location.pathname === '/admin/estoque' 
                  ? 'bg-white dark:bg-white/15 text-zinc-900 dark:text-white shadow-sm font-semibold' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Estoque & Peças</span>
            </Link>
          )}

          {user.cargo === 'ADMIN' && (
            <Link
              to="/admin/relatorios"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                location.pathname === '/admin/relatorios' 
                  ? 'bg-white dark:bg-white/15 text-zinc-900 dark:text-white shadow-sm font-semibold' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Relatórios</span>
            </Link>
          )}

          {user.cargo === 'ADMIN' && (
            <Link
              to="/admin/usuarios"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                location.pathname === '/admin/usuarios' 
                  ? 'bg-white dark:bg-white/15 text-zinc-900 dark:text-white shadow-sm font-semibold' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Equipe & Loja</span>
            </Link>
          )}
        </nav>

        {/* Ações Rápidas & Usuário */}
        <div className="flex items-center gap-2">
          
          {/* Alternador de Tema Apple Claro/Escuro */}
          <ThemeToggle />

          {/* Botão de Chat da Equipe */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/10 dark:border-white/[0.08] rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm cursor-pointer relative"
            title="Abrir Chat Interno e Interfone da Equipe"
          >
            <MessageSquare className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span className="hidden md:inline">Chat</span>
            {unreadChatCount && unreadChatCount > 0 ? (
              <span className="w-4 h-4 bg-blue-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse shadow-sm">
                {unreadChatCount}
              </span>
            ) : null}
          </button>

          {/* Botão de Rede Local */}
          <button
            onClick={() => setShowNetworkModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/10 dark:border-white/[0.08] rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm cursor-pointer"
            title="Ver link de acesso para outros computadores da rede"
          >
            <Wifi className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="hidden md:inline">Rede</span>
          </button>

          {/* Central de Notificações */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markNotificationsAsRead();
              }}
              className="p-2 rounded-full bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/10 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white relative transition-colors cursor-pointer"
              title="Notificações"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#121214] border border-black/10 dark:border-white/15 rounded-3xl shadow-2xl p-4 z-50 animate-slide-up text-left">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/10 dark:border-white/[0.08]">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                    Central de Avisos em Tempo Real
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{notifications.length} avisos</span>
                </div>
                
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-zinc-500 text-xs">
                      Nenhum alerta recente no momento.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-2xl border text-xs transition-colors ${
                          n.tipo === 'ALERTA' 
                            ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-200' 
                            : n.tipo === 'ATRIBUICAO' 
                            ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-500/30 text-blue-800 dark:text-blue-200' 
                            : 'bg-black/[0.02] dark:bg-white/[0.04] border-black/5 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {n.tipo === 'ALERTA' ? (
                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-xs text-zinc-900 dark:text-white">{n.titulo}</p>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-0.5">{n.mensagem}</p>
                            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 block">{formatDate(n.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Perfil & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-black/10 dark:border-white/10">
            <button
              onClick={() => setShowModalityModal(true)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/10 dark:border-white/[0.08] transition-all cursor-pointer"
              title="Clique para alternar perfil"
            >
              <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-black/10 dark:border-white/20 font-semibold text-[11px] text-zinc-800 dark:text-white flex items-center justify-center shadow-sm shrink-0">
                {getInitials(user.nome)}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-zinc-900 dark:text-white leading-none">{user.nome.split(' ')[0]}</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-none mt-1">@{user.login}</p>
              </div>
            </button>

            <button
              onClick={logout}
              className="p-2 rounded-full bg-black/[0.04] dark:bg-white/[0.04] hover:bg-rose-500/15 border border-black/10 dark:border-white/[0.08] text-zinc-500 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer"
              title="Sair do Sistema"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Modal de Rede Local Apple Style */}
      {showNetworkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-lg shadow-[0_24px_64px_rgba(0,0,0,0.8)] p-6 animate-slide-up space-y-4 text-left">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Conectar outros Computadores na Rede</h3>
                  <p className="text-[11px] text-zinc-400">Compartilhe o sistema na mesma rede Wi-Fi ou Cabo</p>
                </div>
              </div>
              <button
                onClick={() => setShowNetworkModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-zinc-300">
                O AssistPro OS opera como <strong>Servidor Central</strong>. Qualquer computador ou tablet na sua rede local pode abrir o sistema:
              </p>

              {networkInfo && (
                <div className="space-y-2">
                  <label className="font-semibold text-zinc-400 text-[11px] uppercase tracking-wider block">
                    Endereço de Acesso na Rede Local:
                  </label>
                  
                  <div className="p-3 bg-black/80 rounded-2xl border border-white/10 flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-bold text-emerald-400 truncate">
                      {networkInfo.serverUrl || `http://${window.location.hostname}:3001`}
                    </span>
                    <button
                      onClick={() => copyToClipboard(networkInfo.serverUrl || `http://${window.location.hostname}:3001`)}
                      className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-sm cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="p-4 bg-black/40 rounded-2xl border border-white/[0.06] space-y-2 text-zinc-300 text-[11px]">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-blue-400" />
                  Instruções para outros computadores da bancada e balcão:
                </h4>
                <ol className="list-decimal list-inside space-y-1 pl-1 text-zinc-400">
                  <li>Abra o navegador no computador secundário.</li>
                  <li>Cole o endereço copiado acima e aperte Enter.</li>
                  <li>Selecione a estação de trabalho correspondente.</li>
                </ol>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowNetworkModal(false)}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Concluído
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal de Troca de Modalidade */}
      <ModalitySwitcherModal
        isOpen={showModalityModal}
        onClose={() => setShowModalityModal(false)}
      />

    </header>
  );
};