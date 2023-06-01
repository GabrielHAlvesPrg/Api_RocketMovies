const knex = require("../database/knex")

class TagsController{
  async index(request, response){
    const { user_id } = request.params;

    const tag = await knex("tags") //estou falando para o knex ir la na tabela de tags...
    .where({ user_id }) //... e filtre onde seja igual o user_id. Pelo fato de na tabela o nome ser igual a user_id, não é preciso colocar user_id: user_id.
    .groupBy("name") //groupBy é um recurso do banco de dados que agrupa pelo compo que for dito no argumento, dessa forma ele nao trás dados repetidos desse grupo.
    return response.json(tag)
  }
}

module.exports = TagsController