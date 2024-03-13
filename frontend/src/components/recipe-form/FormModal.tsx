// import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { NewRecipeForm } from './NewRecipeForm';
import { Recipe } from '../../models/recipe';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '45%',
    border: '2px solid #000',
    boxShadow: 24,
    backgroundColor: 'hsl(0, 0%, 14%)',
    p: 4,
    borderRadius: '10px'
};
// https://mui.com/material-ui/react-modal/
export function FormModal(props: {
    open: boolean,
    handleClose: () => void
    addRecipe: (recipe: Recipe) => boolean
}) {
    return (
        <>
            <Modal
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <NewRecipeForm addRecipe={props.addRecipe} />
                </Box>
            </Modal>
        </>
    )
}