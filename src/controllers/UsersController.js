const { hash, compare } = require("bcryptjs");

const AppError = require("../utils/AppError");

const moment = require("moment-timezone"); //passar a data formatada da criação do usuário com o moment-timezone. executa npm i moment-timezone, dps importaria em uma variável

const sqliteConnection = require("../dataBase/sqlite"); //Importando a conexão com o banco de dados.

class UsersController {
  async create(request, response) {
    const {name, email, password} = request.body;

    const database = await sqliteConnection();
    const checkUserExist = await database.get("SELECT * FROM users WHERE email = (?)", [email]); //A "(?)" sera substituída pelo valor da variável email.
    
    if(checkUserExist){
      throw new AppError("Este e-mail já esta em uso.");
    }

    const hashedPassword = await hash(password, 8);

    const saoPauloTime = moment.tz(Date.now(), 'America/Sao_Paulo');
    const formattedDate = saoPauloTime.format('DD/MM - HH:mm')

    await database.run("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, formattedDate]);//Inserindo os dados do usuário. .run significa que vai executar alguma coisa.

    return response.status(201).json();

  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection(); //Conectando com o banco de dados.
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

    if(!user) {
      throw new AppError("Usuário não encontrado.");
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){ //Se ele encontrar um email e se esse email for diferente do id do usuário, significa que esse usuário já existe.
      throw new AppError("Este e-mail já esta em uso.");
    }

    user.name = name ?? user.name;//Se existir conteúdo dentro de "name", então ele mesmo será utilizado, se não será utilizado o "user.name", ou seja vai continuar o que já estava.
    user.email = email ?? user.email;

    if( password && !old_password){//Se o usuário digitou a nova senha em password, mas ela nao digitou a senha antiga. (old_password).
      throw new AppError("Você precisa informar a senha antiga para definir uma nova senha.");
    }

    if(password && old_password){
      const checkOldPassword = await compare(old_password, user.password);//Essa linha compara se a senha antiga informada é a mesma senha que esta cadastrada para aquele usuário.
    
      if(!checkOldPassword){
        throw new AppError("A senha antiga não confere.")
      }

      user.password = await hash(password, 8);
    }

    await database.run(`
    UPDATE users SET
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
    [user.name, user.email, user.password, id] //OBS: No final do updated_at, não é preciso a virgula, pois ela indicaria que vou passar um parâmetro por "?", no caso estou pegando a datetime de uma função do banco de dados.
  )

    return response.status(200).json();
  }

}

module.exports = UsersController;