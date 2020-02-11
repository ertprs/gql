import { Cliente, PrismaClient } from '@prisma/client'
import { ClienteInput, EnderecoInput } from '../model'

export class ClienteService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async list(): Promise<Cliente[]> {
    return this.prisma.cliente.findMany()
  }

  async save({ clienteInput, enderecoInput }: { clienteInput: ClienteInput; enderecoInput: EnderecoInput }): Promise<Cliente> {
    const enderecoInserido = await this.prisma.endereco.upsert({
      create: {
        ...enderecoInput
      },
      update: {
        ...enderecoInput
      },
      select: {
        id: true
      },
      where: {
        id: enderecoInput.id || ''
      }
    })

    const createOrUpdate = {
      ...clienteInput,
      endereco: {
        connect: {
          id: enderecoInserido.id
        }
      }
    }

    return this.prisma.cliente.upsert({
      create: createOrUpdate,
      update: createOrUpdate,
      include: {
        endereco: true
      },
      where: {
        id: clienteInput.id || ''
      }
    })
  }
}
