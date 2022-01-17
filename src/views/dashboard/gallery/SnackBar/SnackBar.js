import React, {useEffect} from 'react';
import {IconButton} from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';

const SnackBar = (props) => {
    let {isOpen, variant, message, onClose, delay = 2000} = props;
    const handleClose = () => {
        onClose()
    }

    return (
        <div className="d-flex w-100 position-fixed" style={{zIndex: "999"}}>
            <div className={`snack_bar ${isOpen && "show"}`} style={{
                backgroundColor: `${variant === "success" ? "#085f08" : variant === "error" ? "#5f0808" : "#2f4269"}`
            }}>
                {
                    message
                }
                <IconButton onClick={handleClose} style={{padding: "0"}}>
                    <CancelIcon style={{color: "white"}}/>
                </IconButton>
            </div>
        </div>
    );
};

export default SnackBar;