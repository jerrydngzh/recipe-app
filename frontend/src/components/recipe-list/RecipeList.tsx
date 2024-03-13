import { RecipeItem } from "../recipe-item/RecipeItem";
import { Recipe } from "../../models/recipe";
import './RecipeList.css'

export function RecipeList(props: {
    recipeList: Recipe[]
    deleteRecipe: (id: string) => void,
    onUpdateRecipe: () => void
}) {
    return (
        <>
            <ul>
                {
                    // "short circuit" operator
                    props.recipeList.length === 0 && <li>No items</li>
                }
                {
                    props.recipeList.map((recipe) => {
                        return <RecipeItem
                            key={recipe.id}
                            recipe={recipe}
                            deleteRecipe={props.deleteRecipe}
                            onUpdateRecipe={props.onUpdateRecipe}
                        /> 
                    })
                }
            </ul>
        </>
    )
}