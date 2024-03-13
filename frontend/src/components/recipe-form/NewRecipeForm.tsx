import { useState } from "react"
import { Recipe } from "../../models/recipe"
import "./NewRecipeForm.css"

export function NewRecipeForm(props: {
    addRecipe: (recipe: Recipe) => boolean
}) {
    const [recipeName, setRecipeName] = useState("")
    const [recipeIngredients, setRecipeIngredients] = useState("")
    const [recipeInstructions, setRecipeInstructions] = useState("")

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault()

        if (recipeName === "" || recipeIngredients === "" || recipeInstructions === "") {
            return
            // TODO: display error message
        }

        // process ingredients string, seperate by commas, linebreaks, etc
        const processedIngredients: string[] = recipeIngredients.split(",").map((ingredient) => {
            return ingredient.trim().replace(/\n/g, "")
        })

        var isAdded = props.addRecipe({
            name: recipeName,
            time: Date.now().toString(),
            ingredients: processedIngredients,
            instructions: recipeInstructions
        })

        if (!isAdded) {
            // display error message
            alert("Failed to add recipe, please try again.")
        }
    }

    return (
        <form
            className="new-recipe-form"
            onSubmit={handleSubmit}
            onReset={() => {
                setRecipeName("")
                setRecipeIngredients("")
                setRecipeInstructions("")
            }}
        >
            <div className="form-row">
                <label htmlFor="recipe-item">Recipe Name:</label>
                <input
                    className="text-input"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    type="text"
                    id="recipe-item"
                    name="recipe-item"
                />
            </div>
            <div className="form-row">
                <label htmlFor="recipe-ingredients">Ingredients:</label>
                <p>Enter ingredients as comma seperated list.</p>

                <textarea
                    className="text-area"
                    value={recipeIngredients}
                    onChange={(e) => setRecipeIngredients(e.target.value)}
                    id="recipe-ingredients"
                    name="recipe-ingredients"
                />
            </div>
            <div className="form-row">
                <label htmlFor="recipe-diretions">Instructions:</label>
                <textarea
                    className="text-area"
                    value={recipeInstructions}
                    onChange={(e) => setRecipeInstructions(e.target.value)}
                    id="recipe-directions"
                    name="recipe-directions"
                />
            </div>
            <div className="btn-array">
                <button type="submit">Add Recipe</button>
                <button type="reset">Clear</button>
            </div>
        </form>
    )
}