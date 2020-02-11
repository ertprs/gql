import { AtendimentoInput } from './../model';
import { Status, Atendimento, PrismaClient } from '@prisma/client'
import { Pagination, ItemInput, PagamentoInput } from '../model'

const ALL_FIELDS = {
  cliente: true,
  enderecoEntrega: true,
  pagamentos: {
    include: {
      finalizadora: true
    }
  },
  itens: {
    include: {
      produto: true
    }
  }
}

export class AtendimentoService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async list(pagination: Pagination): Promise<Atendimento[]> {
    return this.prisma.atendimento.findMany({
      include: ALL_FIELDS,
      ...pagination
    })
  }

  async find(id: string): Promise<Atendimento> {
    if ((typeof id !== 'string') || id === '') {
      throw new Error('invalid id: ' + id)
    }

    const atendimento = await this.prisma.atendimento.findOne({
      include: ALL_FIELDS,
      where: {
        id: id
      }
    })

    if (!atendimento) {
      throw new Error('Atendimento [Id ' + id + ' não encontrado]')
    }

    return atendimento
  }

  async alterarStatus({ idAtendimento, status }: { idAtendimento: string, status: Status }): Promise<Atendimento> {
    return this.prisma.atendimento.update({
      data: {
        status: status
      },
      where: {
        id: idAtendimento
      }
    })
  }

  async lancarItem({ idAtendimento, itemInput }: { idAtendimento: string, itemInput: ItemInput }): Promise<Atendimento> {
    const produto = await this.prisma.produto.findOne({
      where: {
        id: itemInput.idProduto
      }
    })

    if (!produto) {
      throw new Error('Produto [Id ' + itemInput.idProduto + '] não encontrado')
    }

    const atendimento = await this.prisma.atendimento.findOne({
      where: {
        id: idAtendimento
      }
    })

    if (!atendimento) {
      throw new Error('Atendimento [Id ' + idAtendimento + '] não encontrado')
    }

    if (atendimento.status !== Status.ABERTO) {
      throw new Error('Atendimento [Id ' + idAtendimento + '] não está aberto')
    }

    if (itemInput.id) {
      const item = await this.prisma.item.findOne({
        where: {
          id: itemInput.id
        },
        include: {
          atendimento: true
        }
      })

      if (item && (item.atendimento.id !== idAtendimento)) {
        throw new Error('Item [Id ' + itemInput.id + '] não pertence ao atendimento [Id ' + idAtendimento + ']')
      }
    }

    const item = {
      id: itemInput.id,
      descricao: produto.descricao,
      cancelado: itemInput.cancelado || false,
      quantidade: itemInput.quantidade,
      precoUnitario: produto.preco,
      valor: itemInput.quantidade * produto.preco
    }

    await this.prisma.item.upsert({
      create: {
        ...item,
        produto: {
          connect: {
            id: produto.id
          }
        },
        atendimento: {
          connect: {
            id: idAtendimento
          }
        }
      },
      update: {
        ...item,
        produto: {
          connect: {
            id: produto.id
          }
        },
        atendimento: {
          connect: {
            id: idAtendimento
          }
        }
      },
      where: {
        id: item.id || ''
      }
    })

    const atendimentoComItens = await this.prisma.atendimento.findOne({
      where: {
        id: idAtendimento
      },
      include: {
        itens: true
      }
    })

    // todo validar se o item veio de outro atendimento

    const itens = atendimentoComItens.itens

    const valorPedido = itens.filter(item => !item.cancelado)
      .map(item => item.valor)
      .reduce((soma, valorAtual) => {
        return (soma += valorAtual)
      }, 0)

    const atendimentoAtualizado = await this.prisma.atendimento.update({
      where: {
        id: idAtendimento
      },
      data: {
        valorTotal: valorPedido + atendimentoComItens.valorEntrega,
        valorPedido: valorPedido
      },
      include: {
        cliente: true,
        enderecoEntrega: true,
        pagamentos: {
          include: {
            finalizadora: true
          }
        },
        itens: {
          include: {
            produto: true
          }
        }
      }
    })

    return atendimentoAtualizado
  }

  async abrirAtendimento(atendimentoInput: AtendimentoInput): Promise<Atendimento> {

    const idCliente = atendimentoInput.idCliente || null
    delete atendimentoInput.idCliente

    const enderecoEntrega = atendimentoInput.enderecoEntrega || null
    delete atendimentoInput.enderecoEntrega

    const atendimento = atendimentoInput

    atendimento.dataAbertura = atendimento.dataAbertura || new Date()

    if (idCliente && enderecoEntrega) { // cliente  e endereco informado ?
      const enderecoEntregaInserido = await this.prisma.endereco.upsert({
        create: {
          ...enderecoEntrega
        },
        update: {
          ...enderecoEntrega
        },
        where: {
          id: enderecoEntrega.id || ''
        },
        select: {
          id: true
        }

      })

      const createOrUpdate = {
        ...atendimento,
        cliente: {
          connect: {
            id: idCliente
          }
        },
        enderecoEntrega: {
          connect: {
            id: enderecoEntregaInserido.id
          }
        }
      }

      return this.prisma.atendimento.upsert({
        create: {
          ...createOrUpdate,
          valorEntrega: 10 * Math.random()
        },
        update: createOrUpdate,
        where: {
          id: atendimentoInput.id || ''
        },
        include: {
          cliente: true,
          enderecoEntrega: true
        }
      })
    } else if (idCliente) { // somente cliente
      const cliente = await this.prisma.cliente.findOne({
        where: {
          id: idCliente
        },
        select: {
          endereco: {
            select: {
              id: true
            }
          }
        }
      })

      if (!cliente) {
        throw new Error('cliente [Id ' + idCliente + '] não encontrado')
      }

      const createOrUpdate = {
        ...atendimento,
        cliente: {
          connect: {
            id: idCliente
          }
        },
        enderecoEntrega: {
          connect: {
            id: cliente.endereco.id
          }
        }
      }

      return this.prisma.atendimento.upsert({
        create: {
          ...createOrUpdate,
          valorEntrega: parseFloat((10 * Math.random()).toFixed(2))
        },
        update: createOrUpdate,
        where: {
          id: atendimentoInput.id || ''
        },
        include: {
          cliente: true,
          enderecoEntrega: true
        }
      })
    } else if (enderecoEntrega) { // somente endereco
      const enderecoEntregaInserido = await this.prisma.endereco.upsert({
        create: {
          ...enderecoEntrega
        },
        update: {
          ...enderecoEntrega
        },
        where: {
          id: enderecoEntrega.id || ''
        },
        select: {
          id: true
        }

      })

      const createOrUpdate = {
        ...atendimento,
        enderecoEntrega: {
          connect: {
            id: enderecoEntregaInserido.id
          }
        }
      }

      return this.prisma.atendimento.upsert({
        create: {
          ...createOrUpdate,
          valorEntrega: parseFloat((10 * Math.random()).toFixed(2))
        },
        update: createOrUpdate,
        where: {
          id: atendimentoInput.id || ''
        },
        include: {
          cliente: true,
          enderecoEntrega: true
        }
      })
    } else {
      return this.prisma.atendimento.upsert({
        create: {
          ...atendimento,
          valorEntrega: parseFloat((10 * Math.random()).toFixed(2)),
          enderecoEntrega: {
            connect:{
              id: null
            }
          }
        },
        update: {
          ...atendimento,
          enderecoEntrega: {
            connect:{
              id: null
            }
          }
        },
        where: {
          id: atendimentoInput.id || ''
        },
        include: {
          cliente: true,
          enderecoEntrega: true
        }
      })
    }
  }

  async lancarPagamento({ idAtendimento, pagamentoInput }: { idAtendimento: string, pagamentoInput: PagamentoInput }): Promise<Atendimento> {
    const idFinalizadora = pagamentoInput.idFinalizadora
    delete pagamentoInput.idFinalizadora
    pagamentoInput.troco = pagamentoInput.troco || 0

    const atendimento = await this.prisma.atendimento.findOne({
      where: {
        id: idAtendimento
      }
    })

    if (!atendimento) {
      throw new Error('Atendimento [Id ' + idAtendimento + '] não encontrado')
    }

    const finalizadora = await this.prisma.finalizadora.findOne({
      where: {
        id: idFinalizadora
      },
      select: {
        id: true
      }
    })

    if (!finalizadora) {
      throw new Error('Finalizadora [Id ' + idFinalizadora + '] não encontrada')
    }

    if (pagamentoInput.id) {
      const pagamento = await this.prisma.pagamento.findOne({
        where: {
          id: pagamentoInput.id
        },
        include: {
          atendimento: true
        }
      })

      if (pagamento && (pagamento.atendimento.id !== idAtendimento)) {
        throw new Error('Pagamento [Id ' + pagamentoInput.id + '] não pertence ao atendimento [Id ' + idAtendimento + ']')
      }
    }

    const valorEsperado = atendimento.valorTotal - atendimento.valorPago
    const valorPagamento = pagamentoInput.valor - pagamentoInput.troco

    if (valorPagamento > valorEsperado) {
      throw new Error('Pagamento inválido, valor informado [' + valorPagamento + '] esperado [' + valorEsperado + ']')
    }

    await this.prisma.pagamento.upsert({
      create: {
        ...pagamentoInput,
        finalizadora: {
          connect: {
            id: idFinalizadora
          }
        },
        atendimento: {
          connect: {
            id: idAtendimento
          }
        }
      },
      update: {
        ...pagamentoInput,
        finalizadora: {
          connect: {
            id: idFinalizadora
          }
        },
        atendimento: {
          connect: {
            id: idAtendimento
          }
        }
      },
      where: {
        id: pagamentoInput.id || ''
      }
    })

    const atendimentoComPagamentos = await this.prisma.atendimento.findOne({
      where: {
        id: idAtendimento
      },
      include: {
        pagamentos: true
      }
    })

    const valorPago = atendimentoComPagamentos.pagamentos
      .filter(pagamento => !pagamento.cancelado)
      .map(pagamento => pagamento.valor - pagamento.troco)
      .reduce((soma, valorAtual) => {
        return (soma += valorAtual)
      }, 0)

    const data: {
      valorPago: number,
      status: Status
    } = {
      valorPago: valorPago,
      status: Status.ABERTO
    }

    if (valorPago === atendimentoComPagamentos.valorTotal) {
      data.status = Status.RECEBIDO
    } else {
      delete data.status
    }

    return this.prisma.atendimento.update({
      where: {
        id: idAtendimento
      },
      data: data,
      include: {
        cliente: true,
        enderecoEntrega: true,
        pagamentos: {
          include: {
            finalizadora: true
          }
        },
        itens: {
          include: {
            produto: true
          }
        }
      }
    })
  }

  async arquivar(idAtendimento: string): Promise<Atendimento> {
    return this.prisma.atendimento.update({
      where: {
        id: idAtendimento
      },
      data: {
        arquivado: true
      }
    })
  }

  async auditar(atendimento: Atendimento): Promise<void> {
    if (atendimento.status === Status.CANCELADO) {
      return
    }

    const erros = []

    const valorTotal = atendimento.valorPedido + atendimento.valorEntrega

    if (valorTotal !== atendimento.valorTotal) {
      erros.push({
        entidade: 'atendimento',
        id: atendimento.id,
        descricao: 'valor total do atendimento incorreto',
        valorEsperado: valorTotal,
        valorObtido: atendimento.valorTotal
      })
    }

    if (valorTotal !== atendimento.valorPago) {
      erros.push({
        entidade: 'atendimento',
        id: atendimento.id,
        descricao: 'valor pago do atendimento incorreto',
        valorEsperado: valorTotal,
        valorObtido: atendimento.valorPago
      })
    }

    const itens = await this.prisma.item.findMany({
      where: {
        atendimento: {
          id: atendimento.id
        }
      }
    })

    const somaValorItem = itens
      .filter(item => !item.cancelado)
      .map(item => {
        const multiply = item.quantidade * item.precoUnitario
        if (multiply !== item.valor) {
          erros.push({
            entidade: 'item',
            id: item.id,
            descricao: 'valor do item incorreto',
            valorEsperado: multiply,
            valorObtido: item.valor
          })
        }
        return multiply
      }).reduce((soma, atual) => {
        return (soma += atual)
      }, 0)

    if (somaValorItem !== atendimento.valorPedido) {
      erros.push({
        entidade: 'atendimento',
        id: atendimento.id,
        descricao: 'valor do atendimento difere do valor do item',
        valorEsperado: somaValorItem,
        valorObtido: atendimento.valorPedido
      })
    }

    const pagamentos = await this.prisma.pagamento.findMany({
      where: {
        atendimento: {
          id: atendimento.id
        }
      }
    })

    const somaValorPagamento = pagamentos
      .filter(pagamento => !pagamento.cancelado)
      .map(pagamento => {
        console.log(pagamento)
        const multiply = pagamento.valor - pagamento.troco
        return multiply
      }).reduce((soma, atual) => {
        return (soma += atual)
      }, 0)

    if (somaValorPagamento !== atendimento.valorPago) {
      console.log('teste')
      console.log(somaValorPagamento)
      console.log(atendimento.valorPago)

      erros.push({
        entidade: 'atendimento',
        id: atendimento.id,
        descricao: 'valor do atendimento difere do valor do pagamento',
        valorEsperado: somaValorPagamento,
        valorObtido: atendimento.valorPago
      })
    }

    if (erros.length !== 0) {
      throw new Error(JSON.stringify(erros))
    }
  }

  async auditarEArquivar(idAtendimento: string): Promise<Atendimento> {
    const atendimento = await this.prisma.atendimento.findOne({
      where: {
        id: idAtendimento
      }
    })

    if (atendimento.arquivado) {
      throw new Error('Atendimento [Id ' + idAtendimento + '] já arquivado')
    }

    await this.auditar(atendimento)

    await this.arquivar(idAtendimento)

    atendimento.arquivado = true

    return this.find(idAtendimento)
  }
}
