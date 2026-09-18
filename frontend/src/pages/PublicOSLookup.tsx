import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formatCurrency, formatDate, getEquipmentLabel } from '../utils/formatters';
import { ThemeToggle } from '../components/ThemeToggle';
import { 
  Wrench, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PhoneCall, 
  Send, 
  Laptop, 
  Smartphone, 
  Printer, 
  Monitor, 
  Gamepad2, 
  HelpCircle,
  ShieldCheck,
  Check,
  Camera,
  Eye,
  X
} from 'lucide-react';

export const PublicOSLookup: React.FC = () => {
  const { codigo } = useParams<{ codigo?: string }>();
  const [searchInput, setSearchInput] = useState<string>(codigo || '');
  const [osData, setOsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFoto, setSelectedFoto] = useState<string | null>(null);
  const [empresa, setEmpresa] = useState<any>({
    nome_empresa: 'AssistPro Assistência Técnica',
    whatsapp: '(11) 98888-8888',
    telefone: '(11) 3000-0000'
  });

  useEffect(() => {
    fetch('/api/empresa/public')
      .then(res => res.json())
      .then(data => {
        if (data && data.nome_empresa) setEmpresa(data);
      })
      .catch(() => {});
  }, []);

  const fetchOS = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/public/os/${encodeURIComponent(codeToSearch.trim().toUpperCase())}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Ordem de serviço não encontrada.');
      }
      setOsData(json.os);
    } catch (err: any) {
      setError(err.message || 'Falha ao buscar a Ordem de Serviço.');
      setOsData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (codigo) {
      fetchOS(codigo);
    }
  }, [codigo]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOS(searchInput);
  };

  const getEquipmentIcon = (tipo: string) => {
    switch (tipo) {
      case 'NOTEBOOK': return <Laptop className="w-5 h-5 text-sky-500" />;
      case 'SMARTPHONE': return <Smartphone className="w-5 h-5 text-emerald-500" />;
      case 'IMPRESSORA': return <Printer className="w-5 h-5 text-amber-500" />;
      case 'PC_DESKTOP': return <Monitor className="w-5 h-5 text-indigo-500" />;
      case 'CONSOLE': return <Gamepad2 className="w-5 h-5 text-purple-500" />;
      default: return <HelpCircle className="w-5 h-5 text-zinc-400" />;
    }
  };

  const steps = [
    { id: 'TRIAGEM', label: 'Triagem & Entrada', desc: 'Aparelho recebido e aguardando bancada' },
    { id: 'EM_ANDAMENTO', label: 'Em Análise / Manutenção', desc: 'Técnico trabalhando no equipamento' },
    { id: 'TESTES', label: 'Testes de Qualidade', desc: 'Verificação de todos os componentes' },
    { id: 'CONCLUIDO', label: 'Pronto p/ Retirada', desc: 'Reparo finalizado com sucesso!' },
    { id: 'ENTREGUE', label: 'Entregue ao Cliente', desc: 'Retirado com garantia legal' }
  ];

  const getStepStatus = (stepId: string, currentStatus: string) => {
    const order = ['TRIAGEM', 'EM_ANDAMENTO', 'TESTES', 'CONCLUIDO', 'ENTREGUE'];
    const currentIndex = order.indexOf(currentStatus === 'AGUARDANDO_PECA' || currentStatus === 'AGUARDANDO_APROVACAO' ? 'EM_ANDAMENTO' : currentStatus);
    const stepIndex = order.indexOf(stepId);

    if (currentStatus === 'CANCELADO') return 'cancelado';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const cleanWhatsapp = (empresa.whatsapp || '').replace(/\D/g, '') || '5511988888888';
  const mensagemWhatsApp = osData ? encodeURIComponent(
    `Olá, ${empresa.nome_empresa}! Gostaria de informações sobre o meu aparelho *${osData.marca_modelo}* (OS: *${osData.codigo_os}*).`
  ) : '';

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col justify-between transition-colors duration-300 selection:bg-[#0071e3] selection:text-white">
      
      {/* Topo Público Apple Style */}
      <header className="glass-header px-4 py-3 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5">
                {empresa.nome_empresa?.split(' ')[0] || 'AssistPro'} <span className="text-[#0071e3] text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20">OS</span>
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[180px] sm:max-w-none">{empresa.nome_empresa || 'Consulta Online de Conserto'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${mensagemWhatsApp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all"
              title={`Falar no WhatsApp de ${empresa.nome_empresa}`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{empresa.whatsapp || empresa.telefone}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-3xl w-full mx-auto px-4 py-8 space-y-6 flex-1 text-left">
        
        {/* Formulário de Busca por Código Apple Pill */}
        <div className="bg-white dark:bg-[#121214] border border-black/10 dark:border-white/[0.08] shadow-sm dark:shadow-md rounded-3xl p-6 sm:p-8 space-y-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Acompanhe o Status do seu Aparelho
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Digite o código da sua Ordem de Serviço impresso no comprovante (ex: <strong className="text-[#0071e3] font-semibold">OS-2026-0001</strong>) para ver o andamento em tempo real.
          </p>

          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-1">
            <div className="relative w-full flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Código da OS (ex: OS-2026-0001)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-black/[0.03] dark:bg-black/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-xs focus:border-[#0071e3] focus:outline-none uppercase font-mono shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto apple-button-primary px-6 py-2.5 rounded-full text-white font-semibold text-xs shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Consultar'}
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs flex items-center justify-center gap-2 max-w-md mx-auto animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Detalhes da OS Consultada */}
        {osData && (
          <div className="space-y-6 animate-slide-up">
            
            {/* Aviso de Pronto para Retirada */}
            {osData.status === 'CONCLUIDO' && (
              <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-500 shadow-sm dark:shadow-md text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 dark:text-white">🎉 SEU APARELHO ESTÁ PRONTO!</h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-200 max-w-md mx-auto">
                  O conserto foi finalizado com sucesso e os testes foram aprovados. Você já pode retirar o seu equipamento na nossa loja!
                </p>
                {osData.valor_final > 0 && (
                  <p className="text-sm font-extrabold text-zinc-900 dark:text-white pt-1">
                    Valor Total a Pagar na Retirada: <span className="text-emerald-600 dark:text-emerald-400 text-base">{formatCurrency(osData.valor_final)}</span>
                  </p>
                )}
              </div>
            )}

            {/* Aviso de Aguardando Aprovação */}
            {osData.status === 'AGUARDANDO_APROVACAO' && (
              <div className="p-6 rounded-3xl bg-amber-50 dark:bg-orange-950/70 border-2 border-amber-400 dark:border-orange-500/60 text-center space-y-2">
                <h3 className="text-base font-bold text-amber-800 dark:text-orange-300 uppercase tracking-wide">
                  ⏳ Diagnóstico Concluído - Aguardando sua Aprovação
                </h3>
                <p className="text-xs text-zinc-700 dark:text-slate-200 max-w-md mx-auto">
                  Nossa equipe técnica realizou o diagnóstico e o orçamento está pronto. Entre em contato pelo WhatsApp para aprovar o início do reparo.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-semibold text-zinc-600 dark:text-slate-300">Valor do Orçamento: </span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(osData.valor_final || osData.orcamento_valor)}</span>
                </div>
              </div>
            )}

            {/* Card com Resumo do Equipamento */}
            <div className="bg-white dark:bg-[#121214] border border-black/10 dark:border-white/[0.08] shadow-sm dark:shadow-md rounded-3xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 dark:border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-black/[0.04] dark:bg-white/5 border border-black/5 dark:border-white/10">
                    {getEquipmentIcon(osData.tipo_equipamento)}
                  </div>
                  <div>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider block">
                      {getEquipmentLabel(osData.tipo_equipamento)}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{osData.marca_modelo}</h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-sm px-3 py-1 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20 text-[#0071e3]">
                    {osData.codigo_os}
                  </span>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Entrada em {formatDate(osData.createdAt)}</p>
                </div>
              </div>

              {/* Linha do Tempo de Andamento */}
              <div className="py-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-6 text-center">
                  Linha do Tempo do Conserto
                </h4>

                <div className="space-y-4">
                  {steps.map((step, idx) => {
                    const statusState = getStepStatus(step.id, osData.status);
                    const isCompleted = statusState === 'completed';
                    const isCurrent = statusState === 'current';

                    return (
                      <div key={step.id} className="flex items-start gap-4 relative">
                        {/* Linha conectora */}
                        {idx < steps.length - 1 && (
                          <div 
                            className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-px transition-colors ${isCompleted ? 'bg-emerald-500' : 'bg-black/10 dark:bg-white/10'}`} 
                          />
                        )}

                        {/* Ícone do Nó */}
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all z-10 ${
                            isCompleted 
                              ? 'bg-emerald-500 text-white shadow-sm' 
                              : isCurrent 
                              ? 'bg-[#0071e3] text-white shadow-md ring-4 ring-[#0071e3]/20' 
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-black/10 dark:border-white/10'
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                        </div>

                        {/* Texto da Etapa */}
                        <div className="pt-1 flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-bold ${isCurrent ? 'text-[#0071e3] text-sm' : isCompleted ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-500'}`}>
                              {step.label}
                            </p>
                            {isCurrent && (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20 text-[10px] font-semibold">
                                Status Atual
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Informações Complementares */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-black/5 dark:border-white/5 text-xs">
                <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-black/40 border border-black/5 dark:border-white/5">
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px] block font-medium">Defeito Registrado:</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">{osData.defeito_relatado}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-black/40 border border-black/5 dark:border-white/5 flex flex-col justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px] block font-medium">Garantia Legal:</span>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> 90 dias sobre peças e serviços
                  </p>
                </div>
              </div>

              {/* Galeria de Fotos e Evidências do Equipamento */}
              {(() => {
                let fotosList: string[] = [];
                try {
                  fotosList = typeof osData.fotos_equipamento === 'string' ? JSON.parse(osData.fotos_equipamento || '[]') : osData.fotos_equipamento || [];
                } catch {
                  fotosList = [];
                }

                if (fotosList.length === 0) return null;

                return (
                  <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-black/40 border border-black/5 dark:border-white/10 space-y-3">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#0071e3]" />
                      <h4 className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">
                        Fotos & Evidências do Equipamento ({fotosList.length})
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {fotosList.map((f, i) => (
                        <div 
                          key={i} 
                          onClick={() => setSelectedFoto(f)}
                          className="relative group rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 aspect-square bg-black/5 dark:bg-black/40 cursor-pointer"
                        >
                          <img src={f} alt={`Evidência ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="p-1.5 px-2.5 rounded-full bg-black/70 text-white text-[10px] font-semibold flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" /> Ampliar
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Botão de Contato Direto */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${mensagemWhatsApp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Dúvidas? Fale conosco no WhatsApp da Loja ({empresa.whatsapp || empresa.telefone})</span>
                </a>
              </div>

            </div>

          </div>
        )}

        {/* Modal Lightbox de Foto Ampliada */}
        {selectedFoto && (
          <div 
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedFoto(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
              <img 
                src={selectedFoto} 
                alt="Foto do Equipamento Ampliada" 
                className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/20 shadow-2xl" 
              />
              <button
                type="button"
                onClick={() => setSelectedFoto(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Rodapé */}
      <footer className="border-t border-black/5 dark:border-white/5 py-4 text-center text-xs text-zinc-500 dark:text-zinc-500">
        <p className="font-semibold uppercase tracking-wider">{empresa.nome_empresa} • WhatsApp: {empresa.whatsapp || empresa.telefone}</p>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-0.5">Tecnologia AssistPro OS • Acompanhamento em Tempo Real</p>
      </footer>

    </div>
  );
};