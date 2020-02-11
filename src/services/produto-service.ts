import { PrismaClient, Produto } from '@prisma/client'
import { ProdutoInput } from '../model'

export class ProdutoService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async list(): Promise<Produto[]> {
    return this.prisma.produto.findMany()
  }

  async save(produtoInput: ProdutoInput): Promise<Produto> {
    return this.prisma.produto.upsert({
      create: {
        ...produtoInput
      },
      update: {
        ...produtoInput
      },
      where: {
        id: produtoInput.id || ''
      }
    })
  }
}
