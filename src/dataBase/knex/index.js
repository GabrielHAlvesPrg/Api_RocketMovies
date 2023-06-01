/**
 * Este arquivo faz a configuração e a conexão do knex com o banco de dados.
 */
const config = require("../../../knexfile")
const knex = require("knex") //importando o knex

const connection = knex(config.development)//criando a conexão.

module.exports = connection