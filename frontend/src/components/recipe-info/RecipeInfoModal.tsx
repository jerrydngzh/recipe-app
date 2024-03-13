import { Box, Modal } from "@mui/material";
import "./RecipeInfoModal.css";
import { useState } from "react";
import axios from "axios";

// https://mui.com/material-ui/react-modal/
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '45%',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    backgroundColor: 'hsl(0, 0%, 14%)',
    borderRadius: '10px'
};

function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function joinIngredients(ingredients: string[] | string): string {
    if (typeof ingredients === 'string') {
        return ingredients;
    }
    return ingredients.join(', ');
}


export function RecipeInfo(props: {
    id?: string
    name: string
    time: string
    instructions: string
    ingredients: string[]
    open: boolean
    handleClose: () => void
    deleteRecipe: (id: string) => void,
    onUpdateRecipe: () => void
}) {
    const [editMode, setEditMode] = useState(false);
    const [editedName, setEditedName] = useState(props.name);
    const [editedIngredients, setEditedIngredients] = useState(joinIngredients(props.ingredients));
    const [editedInstructions, setEditedInstructions] = useState(props.instructions);
    const [updatedTime, setUpdatedTime] = useState(props.time);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        // Revert changes
        setEditedName(props.name);
        setEditedIngredients(joinIngredients(props.ingredients));
        setEditedInstructions(props.instructions);
        setEditMode(false);
    };

    const handleSave = async () => {
        const updatedRecipe = {
            id: props.id,
            name: editedName,
            ingredients: editedIngredients.split(', '),
            instructions: editedInstructions,
            timeLastModified: Date.now().toString()
        };

        axios.put('http://localhost:3000/api/recipes/' + props.id, updatedRecipe)
            .then((response: any) => {
                console.log(response.data);
                setEditMode(false);
                
                // display updated recipe in the modal
                setEditedName(updatedRecipe.name);
                setEditedIngredients(updatedRecipe.ingredients.join(', '));
                setEditedInstructions(updatedRecipe.instructions);
                setUpdatedTime(updatedRecipe.timeLastModified);

                // update the recipe in the parent component via get request in parent component
                props.onUpdateRecipe();
            })
            .catch((error: any) => {
                console.log(error);
                // TODO: Show error message
                alert("uh oh, stinkyyyyy")
            });
    }

    return (
        <Modal
            open={props.open}
            onClose={()=>{
                setEditMode(false)
                props.handleClose()
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {editMode ? (
                    <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                ) : (
                    <h2>{editedName}</h2>
                )}

                <h5>Last Modified: {formatTimestamp(Number(updatedTime))}</h5>

                <h4>Ingredients: </h4>
                {editMode ? (
                    <textarea value={editedIngredients} onChange={(e) => setEditedIngredients(e.target.value)} />
                ) : (
                    <p>{joinIngredients(editedIngredients)}</p>
                )}

                <h4>Instructions: </h4>
                {editMode ? (
                    <textarea value={editedInstructions} onChange={(e) => setEditedInstructions(e.target.value)} />
                ) : (
                    <p>{editedInstructions}</p>
                )}
                <div className="button-container">
                    {editMode ? (
                        <>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleEdit}>Edit</button>
                            <button onClick={() => props.deleteRecipe(props.id!)}>Delete</button>
                        </>
                    )}
                </div>
            </Box>
        </Modal>
    )
}