const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config()

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   // database: process.env.DB_NAME,
//   port: process.env.DB_PORT
// })

const pool = new Pool({
  host: 'db',
  user: 'postgres',
  password: 'root',
  // database: process.env.DB_NAME,
  // port: process.env.DB_PORT
})
const helpers = {
  setup_tables: async () => {
    const r = await pool.query("CREATE EXTENSION IF NOT EXISTS pgcrypto")
    const q1 = "CREATE TABLE IF NOT EXISTS recipes (id UUID PRIMARY KEY default gen_random_uuid(), name VARCHAR(255), timeLastModified VARCHAR(255), instructions TEXT)"
    const q2 = "CREATE TABLE IF NOT EXISTS ingredient (id UUID PRIMARY KEY default gen_random_uuid(), name VARCHAR(255) UNIQUE)"
    const q3 = "CREATE TABLE IF NOT EXISTS recipe_ingredient (recipe_id UUID, ingredient_id UUID, FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE, FOREIGN KEY (ingredient_id) REFERENCES ingredient(id) ON DELETE CASCADE)"

    const res1 = await pool.query(q1)
    const res2 = await pool.query(q2)
    const res3 = await pool.query(q3)
  },

  get_all_recipes: async () => {
    const q = `
    SELECT r.id, r.name as title, r.timeLastModified as time, r.instructions, array_agg(i.name) as ingredients
    FROM recipes r 
    JOIN recipe_ingredient ri ON r.id = ri.recipe_id
    JOIN ingredient i ON ri.ingredient_id = i.id
    GROUP BY r.id
    ORDER BY r.id
    `
    const res = await pool.query(q)
    console.log(res.rows)
    return res.rows
  },

  get_recipe: async (id) => {
    const query = `
    SELECT r.id, r.name as title, r.timeLastModified as time, r.instructions, array_agg(i.name) as ingredients
    FROM recipes r 
    JOIN recipe_ingredient ri ON r.id = ri.recipe_id
    JOIN ingredient i ON ri.ingredient_id = i.id
    WHERE r.id = $1
    GROUP BY r.id
    `
    const res = await pool.query(query, [id])
    return res.rows[0]
  },

  create_recipe: async (recipe) => {

    const recipe_query = `
        INSERT INTO recipes (name, timeLastModified, instructions) VALUES ($1, $2, $3) RETURNING id
        `
    const r1 = await pool.query(recipe_query, [recipe.name, Date.now(), recipe.instructions])
    const recipe_id = r1.rows[0].id

    for (let i = 0; i < recipe.ingredients.length; i++) {
      const ingredient_query = `
        INSERT INTO ingredient (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id
        `
      var r2 = await pool.query(ingredient_query, [recipe.ingredients[i]])
      if (r2.rowCount === 0) {
        console.log("Ingredient already exists")
        // search for the ingredent instead
        r2 = await pool.query("SELECT id FROM ingredient WHERE name = $1", [recipe.ingredients[i]])
      }

      // create the recipe-ingredient relationship
      const ingredient_id = r2.rows[0].id
      const recipe_ingredient_query = `
        INSERT INTO recipe_ingredient (recipe_id, ingredient_id) VALUES ($1, $2)
        `
      const r3 = await pool.query(recipe_ingredient_query, [recipe_id, ingredient_id])
    }

    return recipe_id
    // const result_obj = await helpers.get_recipe(recipe_id)
    // return result_obj
  },

  delete_recipe: async (id) => {
    const delete_recipe_query = "DELETE FROM recipes WHERE id = $1"
    const res = await pool.query(delete_recipe_query, [id])
    return res.rowCount
  },

  update_recipe: async (id, recipe) => {
    // update the recipe itself
    const update_recipe_query = `
    UPDATE recipes SET name = $1, timeLastModified = $2, instructions = $3 WHERE id = $4
    `
    const r1 = await pool.query(update_recipe_query, [recipe.name, recipe.timeLastModified, recipe.instructions, id])

    // delete all the old ingredients in recipe_ingredient relationship
    const delete_recipe_ingredient_query = "DELETE FROM recipe_ingredient WHERE recipe_id = $1"
    const r2 = await pool.query(delete_recipe_ingredient_query, [id])

    // add the new ingredients
    for (let i = 0; i < recipe.ingredients.length; i++) {
      const ingredient_query = `
        INSERT INTO ingredient (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id
        `
      var r3 = await pool.query(ingredient_query, [recipe.ingredients[i]])
      if (r3.rowCount === 0) {
        console.log("Ingredient already exists")
        // search for the ingredent instead
        r3 = await pool.query("SELECT id FROM ingredient WHERE name = $1", [recipe.ingredients[i]])
      }

      // create the recipe-ingredient relationship
      const ingredient_id = r3.rows[0].id
      const recipe_ingredient_query = `
        INSERT INTO recipe_ingredient (recipe_id, ingredient_id) VALUES ($1, $2)
        `
      const r4 = await pool.query(recipe_ingredient_query, [id, ingredient_id])
    }

    return r1.rowCount
    // const result_obj = await helpers.get_recipe(id)
    // return result_obj
  }

}


module.exports = { helpers }