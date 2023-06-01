const path = require("path")//Importando o path, ele auxilia a achar a localização dos arquivos, independente de qual seja o sistema operacional.

module.exports = {
  development: {
    //development é um objeto que contem propriedades de conexão do knex com o banco de dados.
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "databaseRocketMovies.db")//diz o local que esta armazenado o arquivo do banco de dados.
    },

    pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)// esse comando "PRAGMA foreign_keys = ON" serve para habilitar a funcionalidade de, quando por exemplo deletar uma nota, ele vai deletar em cascata as tags relacionadas a nota.
    },
    
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
    },    
    
    useNullAsDefault: true //propriedade padrão para trabalhar com o sqlite.
  }
};
