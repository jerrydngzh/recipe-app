import { Recipe } from "../../models/recipe";
import { FormModal } from "../recipe-form/FormModal";
import "./NavBar.css";

export function NavBar(props: {
    openState: boolean
    addRecipe: (recipe: Recipe) => boolean
    displayRecipeForm: () => void
    closeRecipeForm: () => void
}) {
    return (
        <nav className="nav-bar">
            <h1>Recipe App</h1>

            <FormModal
                open={props.openState}
                handleClose={props.closeRecipeForm}
                addRecipe={props.addRecipe}
            />
            <button
                className="new-recipe-button"
                onClick={props.displayRecipeForm}
            >New Recipe</button>
        </nav>
    )
}