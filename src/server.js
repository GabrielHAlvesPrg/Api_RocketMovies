require("express-async-errors");
const migrationsRun = require("./dataBase/sqlite/migrations")
const AppError = require("./utils/AppError");

const express = require("express");
const routes = require("./routes")

migrationsRun();

const app = express();
app.use(express.json());

app.use(routes);

app.use(( error, request, response, next) => {
  //Estou verificando se o erro foi do lado do servidor ou do cliente.
  // Se o error for da mesma instancia do AppError, é um erro que foi gerado pelo cliente.
  if(error instanceof AppError){
    /*
      Dou um retorno no response.status e coloco o error.statusCode .json e passo um objeto com status de error.
    */
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  });

});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));