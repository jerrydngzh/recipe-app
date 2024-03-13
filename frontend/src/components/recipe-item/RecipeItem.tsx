import { useState } from "react";
import { RecipeInfo } from "../recipe-info/RecipeInfoModal";
import { Recipe } from "../../models/recipe";
import './RecipeItem.css'

export function RecipeItem(props: {
    recipe: Recipe
    deleteRecipe: (id: string) => void,
    onUpdateRecipe: () => void
}) {

    const [openItem, setOpenItem] = useState(false);

    function displayRecipeInfo(id: string) {
        console.log('Displaying recipe info for', id)
        setOpenItem(true)
    }

    return (
        <li key={props.recipe.id}>
            <div className="item-div" onClick={() => displayRecipeInfo(props.recipe.id!)}>
                <a href="#">{props.recipe.name}</a>
            </div>
            <RecipeInfo {...props.recipe} open={openItem} handleClose={() => setOpenItem(false)} deleteRecipe={props.deleteRecipe} onUpdateRecipe={props.onUpdateRecipe}/>
        </li>
    )
}