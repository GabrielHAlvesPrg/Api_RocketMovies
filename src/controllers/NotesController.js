/**
 * Controle para lidar com as notas.
 */

const knex = require("../database/knex")

class NotesController{
  async create(request, response){
    const { title, description, tags, links} = request.body
    const { user_id } = request.params
    //const  user_id  = request.user.id;


    const [ note_id ] = await knex("notes").insert({
      title,
      description,
      user_id
    })

    /*
    const linksInsert = links.map(link => {
      return {s
        note_id,
        url: link
      }
    })

    await knex("links").insert(linksInsert)
    */

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    })

    await knex("tags").insert(tagsInsert)

    return response.json()
  }

  async show(request, response){
    const { id } = request.params

    const note = await knex("notes").where({ id }).first() //estou buscando a nota usando o knex baseadas no id e quero que retorne somente uma. 
    const tags = await knex("tags").where({ note_id: id }).orderBy("name")
  //  const links = await knex("links").where({ note_id: id}).orderBy("created_at")

    return response.json({
      ...note,
      tags,
      //links
    })
  }

  async delete(request, response){
    const { id } = request.params

    await knex("notes").where({ id }).delete()

    return response.json()
  }

  async index(request, response){
    
    const { title, tags } = request.query
    
    const user_id = request.user.id;

    let notes

    if(tags){
      const filterTags = tags.split(',').map(tag => tag.trim())
      
      notes = await knex("tags")
      .select([
        "notes.id",
        "notes.title",
        "notes.user_id"
      ])
      .where("notes.user_id", user_id)
      .whereLike("notes.title", `%${title}%`)
      .whereIn("name", filterTags)
      .innerJoin("notes", "notes.id", "tags.note_id")
      .groupBy("notes.id")
      .orderBy("notes.title")

      //Obs: A explicação dessa parte esta no stage 08 - backend / terceira parte Query Builder - aula de nome "Aplicando Inner Join". 

    }else{
      notes = await knex("notes")
      .where({ user_id })
      .whereLike("title", `%${title}%`) //whereLike ajuda a buscar por valores, que contenham dentro de uma palavra.Quando é colocado o porcentual % antes e depois da variável, estou dizendo para o banco que quero a verificação antes de depois ou seja em qualquer parte da palavra, se existir o que estou pesquisando, traga para mim.
      .orderBy("title")
    }

    const userTags = await knex("tags").where({ user_id }) // vou fazer um filtro em todas as tags onde a tag seja igual ao id do usuário.
    const notesWithTags = notes.map(note => { //Percorro todas as notas.
      const noteTags = userTags.filter(tag => tag.note_id === note.id)// noteTags esta filtrando as tags das notas.
        //o id da nota que esta vinculada a tag seja igual ao note.id.

      return {
        ...note,
        tags: noteTags
      }
    })

    return response.json(notesWithTags)

    
  }
}

module.exports = NotesController