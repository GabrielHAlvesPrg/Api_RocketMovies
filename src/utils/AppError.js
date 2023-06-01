class AppError {
  //A criação de variável no topo de uma classe serve para que todos os métodos(funções), tenham conhecimento delas.
  message;
  statusCode;

  constructor(message, statusCode = 400){
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;