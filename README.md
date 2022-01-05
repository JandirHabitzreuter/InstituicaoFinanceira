# Instituição Financeira

Desenvolvimento de uma aplicação em NodeJS para controlar uma instituição financeira:

### Requisitos

 Deve ser possível criar umma conta <br>
 Deve ser possível buscar o extrato bancário do cliente <br>
 Deve ser possível realizar um depósito <br>
 Deve ser possível realizar um saque <br>
 Deve ser possível buscar o extrato bancário do cliente por data <br>
 Deve ser possível atualizar dados da conta do cliente <br>
 Deve ser possível obter dados da conta do cliente <br>
 Deve ser possível deletar uma conta <br>

### Regras de negócio

Não deve ser possível cadastrar uma conta com CPF já existente <br>
Não deve ser possível fazer depósito em uma conta não existente <br>
Não deve ser possível buscar extrato em uma conta não existente <br>
Não deve ser possível fazer saque em uma conta não existente <br>
Não deve ser possível excluir uma conta não existente <br>
Não deve ser possível fazer saque quando o saldo for insuficiente <br>

### Instalação de dependências

yarn add express <br>
yarn add nodemon -D <br>
yarn add uuid <br>
