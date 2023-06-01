/*
  Esta migrations esta utilizando o ORM Knex para gerar uma tabela independente do banco de dados que está sendo utilizado.
*/
exports.up = knex => knex.schema.createTable("notes", table => {
  table.increments("id");//criando um campo incremental chamado id.
  table.text("title");//criando um campo do tipo texto chamado title.
  table.text("rating");
  table.text("description");//criando um campo do tipo texto chamado description.
  table.integer("user_id").references("id").inTable("users");//to criando um campo de tipo inteiro, chamado "user_id" e estou dizendo que ele faz referencia ao id que existe dentro da tabela de usuários. "users".

  table.timestamp("created_at").default(knex.fn.now());//O fn diz que tem uma função dentro do knex, com o nome now.
  table.timestamp("updated_at").default(knex.fn.now());
});
  
exports.down = knex => knex.schema.dropTable("notes");