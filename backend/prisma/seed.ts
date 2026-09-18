import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpando dados para inicialização de produção...');

  await prisma.itemVenda.deleteMany({}).catch(() => {});
  await prisma.venda.deleteMany({}).catch(() => {});
  await prisma.notificacao.deleteMany({}).catch(() => {});
  await prisma.logHistorico.deleteMany({}).catch(() => {});
  await prisma.mensagemChat.deleteMany({}).catch(() => {});
  await prisma.ordemServico.deleteMany({}).catch(() => {});
  await prisma.itemEstoque.deleteMany({}).catch(() => {});
  await prisma.usuario.deleteMany({}).catch(() => {});

  console.log('👥 Cadastrando perfis genéricos por modalidade...');

  const passwordHash = await bcrypt.hash('123456', 10);

  // 1. ADMIN - Administrador Geral (Gestão, Finanças, Cadastros)
  await prisma.usuario.create({
    data: {
      nome: 'Administrador Geral',
      login: 'admin',
      senha_hash: passwordHash,
      cargo: 'ADMIN',
      status: 'ONLINE',
      telefone: '(11) 98000-0001',
      especialidades: JSON.stringify(['NOTEBOOK', 'SMARTPHONE', 'IMPRESSORA', 'PC_DESKTOP', 'CONSOLE', 'TABLET', 'MACBOOK'])
    }
  });

  // 2. GERENTE - Gerente Técnico & Triagem (Kanban, SLA, Distribuição)
  await prisma.usuario.create({
    data: {
      nome: 'Gerente de Oficina',
      login: 'gerente',
      senha_hash: passwordHash,
      cargo: 'GERENTE',
      status: 'ONLINE',
      telefone: '(11) 98000-0002',
      especialidades: JSON.stringify(['NOTEBOOK', 'SMARTPHONE', 'PC_DESKTOP', 'CONSOLE'])
    }
  });

  // 3. ATENDENTE - Atendente Balcão & Vendas (Entrada OS, Caixa, PDV)
  await prisma.usuario.create({
    data: {
      nome: 'Atendente de Balcão',
      login: 'atendente',
      senha_hash: passwordHash,
      cargo: 'ATENDENTE',
      status: 'ONLINE',
      telefone: '(11) 98000-0003',
      especialidades: JSON.stringify(['NOTEBOOK', 'SMARTPHONE'])
    }
  });

  // 4. TECNICO - Técnico de Hardware (Notebooks, PCs, Desktops, Consoles)
  await prisma.usuario.create({
    data: {
      nome: 'Técnico em Hardware',
      login: 'tecnico',
      senha_hash: passwordHash,
      cargo: 'TECNICO',
      status: 'ONLINE',
      telefone: '(11) 98000-0004',
      especialidades: JSON.stringify(['NOTEBOOK', 'PC_DESKTOP', 'CONSOLE', 'MACBOOK'])
    }
  });

  // 5. TECNICO_CELULAR - Especialista Mobile (Smartphones, iPhones, Tablets)
  await prisma.usuario.create({
    data: {
      nome: 'Especialista Mobile',
      login: 'tecnico_celular',
      senha_hash: passwordHash,
      cargo: 'TECNICO_CELULAR',
      status: 'ONLINE',
      telefone: '(11) 98000-0005',
      especialidades: JSON.stringify(['SMARTPHONE', 'TABLET'])
    }
  });

  // Configuração padrão da empresa
  await prisma.configuracaoEmpresa.upsert({
    where: { id: 1 },
    update: {},
    create: {
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
      termo_garantia: 'Garantia legal de 90 dias conforme Art. 26 do Código de Defesa do Consumidor, cobrindo exclusivamente o serviço executado e as peças substituídas.',
      mensagem_pronto: 'Olá, *{cliente}*! 🎉 Ótima notícia da *AssistPro*! Seu equipamento *{aparelho}* (OS *{os}*) está pronto para retirada. Valor: R$ {valor}.',
      mensagem_orcamento: 'Olá, *{cliente}*! Tudo bem? Aqui é da *AssistPro*. Temos o orçamento técnico para seu equipamento *{aparelho}* (OS *{os}*). Valor: R$ {valor}. Podemos aprovar o serviço?'
    }
  });

  console.log('\n========================================================');
  console.log('✅ BANCO DE DADOS INICIALIZADO COM PERFIS GENÉRICOS!');
  console.log('========================================================');
  console.log('👥 PERFIS POR MODALIDADE (Senha padrão para todos: 123456):');
  console.log('   👑 Administrador Geral -> Login: admin           (ADMIN)');
  console.log('   📊 Gerente de Oficina  -> Login: gerente         (GERENTE)');
  console.log('   📋 Atendente Balcão    -> Login: atendente       (ATENDENTE)');
  console.log('   💻 Técnico de Hardware -> Login: tecnico         (TECNICO)');
  console.log('   📱 Especialista Mobile -> Login: tecnico_celular (TECNICO_CELULAR)');
  console.log('========================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });