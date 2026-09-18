import React, { useState, useEffect } from 'react';
import { getAuthToken } from '../utils/auth';
import { 
  Building2, 
  Save, 
  Check, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin, 
  QrCode, 
  FileText, 
  MessageSquare 
} from 'lucide-react';

export const AdminEmpresaConfig: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    nome_empresa: '',
    razao_social: '',
    cnpj_cpf: '',
    telefone: '',
    whatsapp: '',
    email: '',
    endereco: '',
    cidade_uf: '',
    chave_pix: '',
    banco_pix: '',
    termo_garantia: '',
    mensagem_pronto: '',
    mensagem_orcamento: ''
  });

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/empresa', {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      const data = await res.json();
      if (res.ok && data) {
        setForm({
          nome_empresa: data.nome_empresa || '',
          razao_social: data.razao_social || '',
          cnpj_cpf: data.cnpj_cpf || '',
          telefone: data.telefone || '',
          whatsapp: data.whatsapp || '',
          email: data.email || '',
          endereco: data.endereco || '',
          cidade_uf: data.cidade_uf || '',
          chave_pix: data.chave_pix || '',
          banco_pix: data.banco_pix || '',
          termo_garantia: data.termo_garantia || '',
          mensagem_pronto: data.mensagem_pronto || '',
          mensagem_orcamento: data.mensagem_orcamento || ''
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/empresa', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar dados da empresa.');

      setSuccess('Dados da assistência técnica atualizados com sucesso!');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-zinc-500 text-xs">
        Carregando configurações da loja...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 text-left">
      
      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Seção 1: Identificação da Assistência Técnica */}
      <div className="bg-white dark:bg-[#121214] border border-black/10 dark:border-white/[0.08] rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5 pb-3 border-b border-black/5 dark:border-white/[0.08]">
          <div className="w-8 h-8 rounded-xl bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Identificação & Dados Fiscais</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Exibido nos cabeçalhos, recibos térmicos e ordem de serviço</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-600 dark:text-zinc-400 font-medium">Nome Fantasia da Loja *</label>
            <input
              type="text"
              name="nome_empresa"
              required
              value={form.nome_empresa}
              onChange={handleChange}
              placeholder="Ex: AssistPro Assistência Técnica"
              className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-black/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-[#0071e3] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-600 dark:text-zinc-400 font-medium">Razão Social</label>
            <input
              type="text"
              name="razao_social"
              value={form.razao_social}
              onChange={handleChange}
              placeholder="Ex: AssistPro Tecnologia LTDA"
              className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-black/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-[#0071e3] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-600 dark:text-zinc-400 font-medium">CNPJ ou CPF</label>
            <input
              type="text"
              name="cnpj_cpf"
              value={form.cnpj_cpf}
              onChange={handleChange}
              placeholder="00.000.000/0001-00"
              className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-black/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-[#0071e3] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-600 dark:text-zinc-400 font-medium">WhatsApp Principal (com DDD) *</label>
            <input
              type="text"
              name="whatsapp"
              required
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-black/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-[#0071e3] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-600 dark:text-zinc-400 font-medium">Telefone Fixo</label>
            <input
              type="text"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(11) 3000-0000"
              className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-black/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-[#0071e3] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-600 dark:text-zinc-400 font-medium">Email Comercial</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contato@empresa.com"
              className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-black/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-[#0071e3] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-600 dark:text-zinc-400 font-medium">Endereço Completo</label>
            <input
              type="text"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              placeholder="Av. Paulista, 1000 - Centro"
              className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-black/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-[#0071e3] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-600 dark:text-zinc-400 font-medium">Cidade - UF</label>
            <input
              type="text"
              name="cidade_uf"
              value={form.cidade_uf}
              onChange={handleChange}
              placeholder="São Paulo - SP"
              className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-black/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-[#0071e3] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Seção 2: Pagamentos & PIX */}
      <div className="bg-white dark:bg-[#121214] border border-black/10 dark:border-white/[0.08] rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5 pb-3 border-b border-black/5 dark:border-white/[0.08]">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Dados de Pagamento (PIX)</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Impresso no comprovante para o cliente pagar rapidamente</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-600 dark:text-zinc-400 font-medium">Chave PIX</label>
            <input
              type="text"
              name="chave_pix"
              value={form.chave_pix}
              onChange={handleChange}
              placeholder="CNPJ, Celular, E-mail ou Aleatória"
              className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-black/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-[#0071e3] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-600 dark:text-zinc-400 font-medium">Instituição Bancária</label>
            <input
              type="text"
              name="banco_pix"
              value={form.banco_pix}
              onChange={handleChange}
              placeholder="Ex: Nubank, Inter, Banco do Brasil"
              className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-black/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-[#0071e3] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Seção 3: Termos de Garantia & Notificações */}
      <div className="bg-white dark:bg-[#121214] border border-black/10 dark:border-white/[0.08] rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5 pb-3 border-b border-black/5 dark:border-white/[0.08]">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Termos Legais de Garantia</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Texto impresso no rodapé de todas as ordens de serviço</p>
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="text-zinc-600 dark:text-zinc-400 font-medium">Texto de Garantia Legal</label>
          <textarea
            rows={3}
            name="termo_garantia"
            value={form.termo_garantia}
            onChange={handleChange}
            placeholder="Garantia legal de 90 dias conforme Art. 26 do Código de Defesa do Consumidor..."
            className="w-full p-3.5 rounded-2xl bg-black/[0.03] dark:bg-black/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-xs focus:border-[#0071e3] focus:outline-none leading-relaxed"
          />
        </div>
      </div>

      {/* Botão Salvar Apple Pill */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="apple-button-primary px-8 py-3 text-xs font-semibold flex items-center gap-2 shadow-xl hover:shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Salvando Alterações...' : 'Salvar Dados da Loja'}</span>
        </button>
      </div>

    </form>
  );
};
