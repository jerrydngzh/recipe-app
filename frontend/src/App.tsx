import { useEffect, useState } from 'react'
import { RecipeList } from './components/recipe-list/RecipeList'
import { Recipe } from './models/recipe'
import { NavBar } from './components/navbar/NavBar'
import axios from 'axios'
import './App.css'


function App() {
  const [recipeList, setRecipeList] = useState<Recipe[]>([])
  useEffect(() => {
    axios.get('http://localhost:3000/api/recipes')
      .then((response: any) => {
        var recipes: Recipe[] = response.data.map((recipe: any) => {
          return {
            id: recipe.id,
            name: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            time: recipe.time
          }
        })

        // console.log(response.data)
        console.log(recipes)
        setRecipeList(recipes)
      })
      .catch((error: any) => {
        console.log(error)
      })
  }, [])

  const [openForm, setOpenForm] = useState(false);
  const handleCloseForm = () => setOpenForm(false);

  function displayRecipeForm() {
    setOpenForm(true)
  }

  function addRecipe(recipe: Recipe) {
    var isAdded = true
    // make post request
    axios.post('http://localhost:3000/api/recipe', {
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      timeLastModified: recipe.time
    })
      .then((response: any) => {
        console.log(response.data)
        var recipeResponse = {
          id: response.data,
          name: recipe.name,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          time: recipe.time
        }
        setRecipeList((prev) => {
          return [...prev, recipeResponse]
        })

        setOpenForm(false)
      })
      .catch((error: any) => {
        console.log(error)
        isAdded = false
      })

    return isAdded
  }

  function deleteRecipe(id: string) {
    axios.delete('http://localhost:3000/api/recipes/' + id)
      .then((response: any) => {
        console.log(response.data)
        if (response.data === 1) {
          console.log('Deleted ' + id)
          setRecipeList((prev) => {
            return prev.filter((recipe) => recipe.id !== id)
          })
        }
      })
      .catch((error: any) => {
        console.log(error)
      })
  }

  function onUpdateRecipe() {    
    // make get request
    axios.get('http://localhost:3000/api/recipes')
    .then((response: any) => {
      var recipes: Recipe[] = response.data.map((recipe: any) => {
        return {
          id: recipe.id,
          name: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          time: recipe.time
        }
      })

      // console.log(response.data)
      console.log(recipes)
      setRecipeList(recipes)
    })
    .catch((error: any) => {
      console.log(error)
    })
  }

  return (
    <>
      <NavBar
        openState={openForm}
        displayRecipeForm={displayRecipeForm}
        closeRecipeForm={handleCloseForm}
        addRecipe={addRecipe}
      />
      <RecipeList recipeList={recipeList} deleteRecipe={deleteRecipe} onUpdateRecipe={onUpdateRecipe} />
    </>
  )
}

export default App
