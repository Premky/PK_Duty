import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CustomModal = ({ buttonText, title, children, fileType }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen}>{buttonText}</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        {/* <p>{fileType}</p> */}
                        {fileType === 'pdf' ? (
                            <iframe
                                src={children}
                                title={title}
                                width="100%"
                                height="400px"
                                style={{ border: 'none' }}
                            />
                        ) : (
                            <>
                                <img src={children} alt={`Preview of ${title}`} height='600px' width='100%' />
                            </>
                        )}
                        <div className='text-center' style={{ marginTop: '20px' }}>                            
                            <Button onClick={handleClose} style={{ marginLeft: '10px' }} className='bg-danger text-white'>Close</Button>
                        </div>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default CustomModal;
