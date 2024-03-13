var express = require('express');
var router = express.Router();
var db = require("../models/db")

/* GET all recipes in DB */
router.get("/recipes", async (req, res) => {
  const result = await db.helpers.get_all_recipes()
  res.json(result)
})

// get recipe w/ id
router.get("/recipes/:id", async (req, res) => {
  try {
    console.log(req.params.id)
    const result = await db.helpers.get_recipe(req.params.id)

    if (!result) {
      res.status(404).json({ message: "Invalid recipe_id" })
      return
    }

    res.json(result)
  } catch (e) {
    res.status(500).json(e)
  }
})

// TODO: clean up error handling -- create recipe
router.post("/recipe", async (req, res) => {

  var recipe = {}
  try {
    // validate body params
    // name not empty, instructions not empty, ingredients not empty (is array of strings)
    if (!req.body.name || !req.body.instructions || !req.body.ingredients || !req.body.timeLastModified) {
      res.status(400).json({ message: "Invalid request" })
      return
    }

    recipe = {
      name: req.body.name,
      timeLastModified: Date.now(),
      instructions: req.body.instructions,
      ingredients: req.body.ingredients
    }

  } catch (e) {
    console.log(e)
    res.status(400).json({ message: "Invalid request" })
    return
  }

  // send
  try {
    const result = await db.helpers.create_recipe(recipe)
    if (!result) {
      res.status(404).json({ message: "Failed to create recipe" })
      return
    }
    res.json(result)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
})

// delete recipe with id
router.delete("/recipes/:id", async (req, res) => {
  try {
    const result = await db.helpers.delete_recipe(req.params.id)
    if (result === 0) {
      res.status(404).json({ message: "Invalid recipe_id to delete" })
      return
    }
    res.json(result)
  } catch (e) {
    res.status(500).json(e)
  }
})

// update recipe with id
router.put("/recipes/:id", async (req, res) => {
  // validate
  var recipe = {}
  try {
    // validate body params
    // name not empty, instructions not empty, ingredients not empty (is array of strings)
    if (!req.body.name || !req.body.instructions || !req.body.ingredients || !req.params.id || req.params.timeLastModified) {
      res.status(400).json({ message: "Invalid request" })
      return
    }

    recipe = {
      name: req.body.name,
      timeLastModified: Date.now(),
      instructions: req.body.instructions,
      ingredients: req.body.ingredients
    }

  } catch (e) {
    console.log(e)
    res.status(400).json({ message: "Invalid request" })
    return
  }

  // update
  try {
    const result = await db.helpers.update_recipe(req.params.id, recipe)

    if (!result) {
      res.status(404).json({ message: "Invalid recipe_id to update" })
      return
    }

    res.json(result)
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router;
