
import { ApolloServer } from 'apollo-server'
import fs from 'fs'
import { PrismaClient } from '@prisma/client'
import { Query, Mutation } from './graphql/resolvers'

const prisma = new PrismaClient({
  errorFormat: 'minimal'
})

const typeDefs = fs.readFileSync('src/graphql/schema.graphql', { encoding: 'utf-8' })
const server = new ApolloServer({
  typeDefs,
  resolvers: { Query, Mutation },
  context: { prisma },
  introspection: true,
  playground: true
})

export default server
