-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ABERTO', 'CONFIRMADO', 'EM_ENTREGA', 'RECEBIDO', 'CANCELADO');

-- CreateTable
CREATE TABLE "cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "enderecoId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "codigo" TEXT,
    "preco" DECIMAL(65,30) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL,
    "precoUnitario" DECIMAL(65,30) NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "cancelado" BOOLEAN NOT NULL,
    "produtoId" TEXT NOT NULL,
    "atendimentoId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finalizadora" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamento" (
    "id" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "troco" DECIMAL(65,30) NOT NULL,
    "cancelado" BOOLEAN NOT NULL DEFAULT false,
    "finalizadoraId" TEXT NOT NULL,
    "atendimentoId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endereco" (
    "id" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "cep" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atendimento" (
    "id" TEXT NOT NULL,
    "dataAbertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataEncerramento" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT E'ABERTO',
    "valorPedido" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valorEntrega" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valorTotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valorPago" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "arquivado" BOOLEAN NOT NULL DEFAULT false,
    "clienteId" TEXT,
    "enderecoId" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cliente" ADD FOREIGN KEY("enderecoId")REFERENCES "endereco"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "item" ADD FOREIGN KEY("produtoId")REFERENCES "produto"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "item" ADD FOREIGN KEY("atendimentoId")REFERENCES "atendimento"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "pagamento" ADD FOREIGN KEY("finalizadoraId")REFERENCES "finalizadora"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "pagamento" ADD FOREIGN KEY("atendimentoId")REFERENCES "atendimento"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "atendimento" ADD FOREIGN KEY("clienteId")REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "atendimento" ADD FOREIGN KEY("enderecoId")REFERENCES "endereco"("id") ON DELETE SET NULL ON UPDATE RESTRICT;
