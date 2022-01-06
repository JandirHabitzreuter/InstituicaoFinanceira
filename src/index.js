const { request, response } = require("express");
const express = require("express");
const res = require("express/lib/response");

// gerar ID através do uuid. v4 gera com números random
const {v4: uuidv4} = require("uuid");

const app = express();
app.use(express.json());

// Enquanto não tiver banco de dados, armazenar em um array
const customers = [];

// Middleware de verificação de conta existente
// Regra de negócio - Não deve ser possível buscar extrato em uma conta não existente
// Regra de negócio - Não deve ser possível fazer depósito em uma conta não existente
// Regra de negócio - Não deve ser possível fazer saque em uma conta não existente
// Regra de negócio - Não deve ser possível excluir uma conta não existente
function verifyAccountExists(request, response, next){
  const {cpf} = request.headers;
  const customer = customers.find(cust => cust.cpf === cpf);

  if (customer){
    request.customer = customer;
     return next();
  }

  return response.status(400).json({error: "Customer not found!"});
};


// Regra de negócio - Não deve ser possível fazer saque quando o saldo for insuficiente
// Vai fazer o balanço da minha conta
function getBalance(statement){

  const balance = statement.reduce((acc,oper)=>{
    if(oper.type === 'credit'){
      return acc + oper.amount;
    }else{
      return acc - oper.amount;
    }
  },0);

  return balance;

}

// Requisito - Deve ser possível criar uma conta
// Conta vai conter : 
// CPF - String
// name - String
// id - uuid
//statement []
app.post("/account", (request, response)=>{
  const {cpf, name} = request.body; 
  
  // Regra de negócio - Não deve ser possível cadastrar uma conta com CPF já existente
  // Verificar se  o CPF que já existe
  const customersAlreadyExists = customers.some((cust)=> cust.cpf === cpf);
  
  // Se já existir vai dar a mensagem de erro
  if (customersAlreadyExists){
     return response.status(401).json({error: "Customer already exists!"});
  } 

  // Se o CPF não existir vai deixar inserir 
  customers.push({
    cpf,
    name,
    id : uuidv4(),
    statement: []

  });
 

return response.status(201).send(); 

});

// Usando o middleware para validar se a conta existe, nesse formato o middleware é valido para todas as rotas que estão abaixo dele
app.use(verifyAccountExists);

// Requisito - Deve ser possível buscar o extrato bancário do cliente
// Criar a rota para buscar extrato
app.get("/statement", (request, response)=>{ 
  const {customer} = request;
  return response.status(201).json(customer.statement);
});

// Requisito - Deve ser possível realizar um depósito
app.post("/deposit", (request, response)=>{
  const {description, amount} = request.body;
  const {customer} = request;

  const statementOperation = {
    description,
    amount,
    created_at : new Date(),
    type: "credit"
  }
    
  customer.statement.push(statementOperation);

  return response.json({Message: "deposit confirmed!"});

});

// Requisito - Deve ser possível realizar um saque
app.post("/withdraw",(request, response)=>{
  const {customer} = request;
  const {amount, description} = request.body;
  const balance = getBalance(customer.statement);

  if(balance < amount){
    return response.status(400).json({error:"Insufficient funs"});
  }

  const statementOperation = {
    description,
    amount,
    created_at : new Date(),
    type: "debit"
  }

  customer.statement.push(statementOperation);


  return response.status(200).json({Message: "Confirmed!"});


});

// Requisito - Deve ser possível atualizar dados da conta do cliente
app.put("/account",(request, response)=>{
  const {customer} = request;
  const {name} = request.body;

  customer.name = name;

  return response.status(201).json(customer);

});

// Requisito - Deve ser possível obter dados da conta do cliente
app.get("/account", (request, response)=>{ 
  const {customer} = request;
  return response.status(201).json(customer);
});

// Requisito - Deve ser possível deletar uma conta
app.delete("/account",(request, response)=>{
  const {customer} = request;

  // 1 par verificar de onde começar a excluir, 2 par quantas posições
  customers.splice(customers.indexOf(customer),1);

  return response.status(201).json(customers);
});



app.listen(3333);

