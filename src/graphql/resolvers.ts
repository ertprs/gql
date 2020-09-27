/* eslint-disable @typescript-eslint/no-explicit-any */
import { HelloService } from '../services/hello-service'
import { FinalizadoraService } from '../services/finalizadora-service'
import { Finalizadora, Produto, Cliente, Atendimento } from '@prisma/client'
import { ProdutoService } from '../services/produto-service'
import { ClienteService } from '../services/cliente-service'
import { ProdutoInput, ClienteInput, EnderecoInput } from '../model'
import { AtendimentoService } from '../services/atendimento-service'

export const Query = {
  hello: (_: any, { nome }: any): string => new HelloService().hello(nome),

  produtos: async (_: any, args: any, { prisma }: any): Promise<Produto[]> => {
    return new ProdutoService(prisma).list()
  },

  finalizadoras: async (_: any, args: any, { prisma }: any): Promise<Finalizadora[]> => {
    return new FinalizadoraService(prisma).list()
  },

  clientes: async (_: any, args: any, { prisma }: any): Promise<Cliente[]> => {
    return new ClienteService(prisma).list()
  },

  atendimentos: async (_: any, { skip, take }: any, { prisma }: any): Promise<Atendimento[]> => {
    return new AtendimentoService(prisma).list({ skip, take })
  },

  atendimento: async (_: any, { id }: any, { prisma }: any): Promise<Atendimento> => {
    return new AtendimentoService(prisma).find(id)
  },
}

export const Mutation = {
  inserirProduto: async (
    _: any,
    { produtoInput }: { produtoInput: ProdutoInput },
    { prisma }: any,
  ): Promise<Produto> => {
    return new ProdutoService(prisma).save(produtoInput)
  },

  inserirFinalizadora: async (_: any, { finalizadoraInput }: any, { prisma }: any): Promise<Finalizadora> => {
    return new FinalizadoraService(prisma).save(finalizadoraInput)
  },

  inserirCliente: async (
    _: any,
    { clienteInput, enderecoInput }: { clienteInput: ClienteInput; enderecoInput: EnderecoInput },
    { prisma }: any,
  ): Promise<Cliente> => {
    return new ClienteService(prisma).save({ clienteInput, enderecoInput })
  },

  abrirAtendimento: async (_: any, { atendimentoInput }: any, { prisma }: any): Promise<Atendimento> => {
    return new AtendimentoService(prisma).abrirAtendimento(atendimentoInput)
  },

  lancarItem: async (_: any, { idAtendimento, itemInput }: any, { prisma }: any): Promise<Atendimento> => {
    return new AtendimentoService(prisma).lancarItem({
      idAtendimento,
      itemInput,
    })
  },

  alterarStatus: async (_: any, { idAtendimento, status }: any, { prisma }: any): Promise<Atendimento> => {
    return new AtendimentoService(prisma).alterarStatus({
      idAtendimento,
      status,
    })
  },

  lancarPagamento: async (_: any, { idAtendimento, pagamentoInput }: any, { prisma }: any): Promise<Atendimento> => {
    return new AtendimentoService(prisma).lancarPagamento({
      idAtendimento,
      pagamentoInput,
    })
  },

  auditarEArquivar: async (_: any, { idAtendimento }: any, { prisma }: any): Promise<Atendimento> => {
    return new AtendimentoService(prisma).auditarEArquivar(idAtendimento)
  },
}
