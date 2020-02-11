export class HelloService {
  hello(nome: string): string {
    console.log(nome)
    return 'Olá ' + (nome || 'Mundo') + '!'
  }
}
