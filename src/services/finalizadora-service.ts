import { PrismaClient, Finalizadora } from '@prisma/client'
import { FinalizadoraInput } from '../model'
export class FinalizadoraService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async list(): Promise<Finalizadora[]> {
    return this.prisma.finalizadora.findMany()
  }

  async save(finalizadoraInput: FinalizadoraInput): Promise<Finalizadora> {
    return this.prisma.finalizadora.upsert({
      create: {
        ...finalizadoraInput
      },
      update: {
        ...finalizadoraInput
      },
      where: {
        id: finalizadoraInput.id || ''
      }
    })
  }
}

export default {
  FinalizadoraService
}
