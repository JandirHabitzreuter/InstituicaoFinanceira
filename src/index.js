const express = require("express");
const { json } = require("express/lib/response");

// gerar ID através do uuid. v4 gera com números random
const {v4: uuidv4} = require("uuid");

const app = express();
app.use(express.json());

// Enquanto não tiver banco de dados, armazenar em um array
const customers = [];

// Conta vai conter : 
// CPF - String
// name - String
// id - uuid
//statement []
app.post("/account", (request, response)=>{
  const {cpf, name} = request.body;
  const id = uuidv4();
  
  customers.push({
    cpf,
    name,
    id,
    statement: []

  });

return response.status(201).send(); 

});

app.listen(3333);

