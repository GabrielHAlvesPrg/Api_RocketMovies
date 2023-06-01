/*
  Esta migrations esta utilizando o ORM Knex para gerar uma tabela independente do banco de dados que está sendo utilizado.
*/
exports.up = knex => knex.schema.createTable("tags", table => {
  table.increments("id");//criando um campo incremental chamado id.
  table.text("name").notNullable()//criando um campo do tipo texto chamado title.Não permite nullo.
  
  table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE")//.onDelete("CASCADE") significa que, se eu deletar a nota que esta tag esta vinculada, a tag será automaticamente deletada.
  table.integer("user_id").references("id").inTable("users")
  
});
  
exports.down = knex => knex.schema.dropTable("tags");  