import { gql } from 'apollo-server'

export const INSERIR_FINALIZADORA = gql` 
mutation inserirFinalizadora($finalizadoraInput: FinalizadoraInput!) {
  inserirFinalizadora(finalizadoraInput: $finalizadoraInput) {
    id
    descricao
  }
}
`

export const INSERIR_PRODUTO = gql`
mutation inserirProduto($produtoInput: ProdutoInput!) {
  inserirProduto(produtoInput: $produtoInput) {
    id
    descricao
    codigo
  }
}
`

export const INSERIR_CLIENTE = gql`
mutation inserirCliente(
  $clienteInput: ClienteInput!
  $enderecoInput: EnderecoInput
) {
  inserirCliente(clienteInput: $clienteInput, enderecoInput: $enderecoInput) {
    id
    nome
    telefone
    endereco {
      id
      logradouro
      bairro
      cidade
      cep
    }
  }
}
`

export const ATENDIMENTOS = gql`query {
  atendimentos {
    id
    dataAbertura
    dataEncerramento
    status
    valorPedido
    valorEntrega
    valorTotal
    cliente {
      id
      nome
    }
    enderecoEntrega {
      id
      logradouro
      bairro
      cidade
      cep
    }
    itens {
      id
      quantidade
      precoUnitario
      valor
      produto {
        id
        descricao
        codigo
      }
    }
    pagamentos {
      id
      valor
      troco
      finalizadora {
        id
        descricao
      }
    }
  }
}
`

export const ABRIR_ATENDIMENTO = gql`
mutation abrirAtendimento($atendimentoInput: AtendimentoInput!) {
  abrirAtendimento(atendimentoInput: $atendimentoInput) {
    id
    dataAbertura
    dataEncerramento
    status
    valorPedido
    valorEntrega
    valorTotal
    cliente {
      id
      nome
    }
    enderecoEntrega {
      id
      logradouro
      bairro
      cidade
      cep
    }
    itens {
      id
      quantidade
      precoUnitario
      valor
      produto {
        id
        descricao
        codigo
      }
    }
    pagamentos {
      id
      valor
      troco
      finalizadora {
        id
        descricao
      }
    }
  }
}
`

export const LANCAR_ITEM = gql`
mutation lancarItem($idAtendimento: String!, $itemInput: ItemInput!) {
  lancarItem(idAtendimento: $idAtendimento, itemInput: $itemInput) {
    id
    valorEntrega
    valorPago
    valorTotal
    itens {
      id
      cancelado
      quantidade
      precoUnitario
      valor
      produto {
        id
        descricao
        codigo
        preco
      }
    }
  }
}  
`

export const LANCAR_PAGAMENTO = gql`
mutation lancarPagamento(
  $idAtendimento: String!
  $pagamentoInput: PagamentoInput!
) {
  lancarPagamento(
    idAtendimento: $idAtendimento
    pagamentoInput: $pagamentoInput
  ) {
    id
    valorPedido
    valorEntrega
    valorTotal
    valorPago
    pagamentos {
      id
      cancelado
      valor
      troco
      finalizadora {
        id
        descricao
      }
    }
  }
}
`

export const AUDITAR_EARQUIVAR = gql`
mutation auditarEArquivar($idAtendimento: String!) {
  auditarEArquivar(idAtendimento: $idAtendimento) {
    id
    dataAbertura
    dataEncerramento
    status
    valorPedido
    valorEntrega
    valorTotal
    valorPago
    cliente {
      id
      nome
    }
    enderecoEntrega {
      id
      logradouro
      bairro
      cidade
      cep
    }
    itens {
      id
      quantidade
      precoUnitario
      valor
      produto {
        id
        descricao
        codigo
      }
    }
    pagamentos {
      id
      valor
      troco
      finalizadora {
        id
        descricao
      }
    }
  }
}
`

export const PRODUTOS = gql`
query {
  produtos {
    id
    descricao
  }
}
`

export const ALTERAR_STATUS = gql`
mutation alterarStatus($idAtendimento: String!, $status: Status!) {
  alterarStatus(idAtendimento: $idAtendimento, status: $status) {
    status
  }
}
`
