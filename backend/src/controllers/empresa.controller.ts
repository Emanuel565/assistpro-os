import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/index.js';

const prisma = new PrismaClient();

export const getEmpresaConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    let config = await prisma.configuracaoEmpresa.findUnique({
      where: { id: 1 }
    });

    if (!config) {
      config = await prisma.configuracaoEmpresa.create({
        data: {
          id: 1,
          nome_empresa: 'AssistPro Assistência Técnica',
          razao_social: 'AssistPro Tecnologia & Serviços Especializados',
          cnpj_cpf: '00.000.000/0001-00',
          telefone: '(11) 3000-0000',
          whatsapp: '(11) 98888-8888',
          email: 'contato@assistpro.local',
          endereco: 'Av. Paulista, 1000 - Bela Vista',
          cidade_uf: 'São Paulo - SP',
          chave_pix: 'pix@assistpro.local',
          banco_pix: 'Banco Inter',
          termo_garantia: 'Garantia legal de 90 dias conforme Art. 26 do Código de Defesa do Consumidor, cobrindo exclusivamente o serviço executado e as peças substituídas.'
        }
      });
    }

    res.json(config);
  } catch (error) {
    console.error('Erro ao buscar configurações da empresa:', error);
    res.status(500).json({ error: 'Erro ao buscar dados da empresa.' });
  }
};

export const updateEmpresaConfig = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      nome_empresa,
      razao_social,
      cnpj_cpf,
      telefone,
      whatsapp,
      email,
      endereco,
      cidade_uf,
      logo_url,
      chave_pix,
      banco_pix,
      termo_garantia,
      mensagem_pronto,
      mensagem_orcamento
    } = req.body;

    const updated = await prisma.configuracaoEmpresa.upsert({
      where: { id: 1 },
      update: {
        nome_empresa: nome_empresa || undefined,
        razao_social: razao_social !== undefined ? razao_social : undefined,
        cnpj_cpf: cnpj_cpf !== undefined ? cnpj_cpf : undefined,
        telefone: telefone !== undefined ? telefone : undefined,
        whatsapp: whatsapp !== undefined ? whatsapp : undefined,
        email: email !== undefined ? email : undefined,
        endereco: endereco !== undefined ? endereco : undefined,
        cidade_uf: cidade_uf !== undefined ? cidade_uf : undefined,
        logo_url: logo_url !== undefined ? logo_url : undefined,
        chave_pix: chave_pix !== undefined ? chave_pix : undefined,
        banco_pix: banco_pix !== undefined ? banco_pix : undefined,
        termo_garantia: termo_garantia !== undefined ? termo_garantia : undefined,
        mensagem_pronto: mensagem_pronto !== undefined ? mensagem_pronto : undefined,
        mensagem_orcamento: mensagem_orcamento !== undefined ? mensagem_orcamento : undefined
      },
      create: {
        id: 1,
        nome_empresa: nome_empresa || 'AssistPro Assistência Técnica',
        razao_social,
        cnpj_cpf,
        telefone,
        whatsapp,
        email,
        endereco,
        cidade_uf,
        logo_url,
        chave_pix,
        banco_pix,
        termo_garantia,
        mensagem_pronto,
        mensagem_orcamento
      }
    });

    res.json({ message: 'Configurações da empresa atualizadas com sucesso!', config: updated });
  } catch (error) {
    console.error('Erro ao atualizar dados da empresa:', error);
    res.status(500).json({ error: 'Erro ao salvar configurações da empresa.' });
  }
};
