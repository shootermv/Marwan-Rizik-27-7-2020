import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ComposeDialog from '../ComposeDialog'
import { addMessage, deleteMessage, getSentMessages, getReceivedMessages } from '../../../actions/actions';
import capitalizeFirstLetter from '../../../util/capitalizeFirstLetter'
import { messageState, useSetMessageData } from '../../../store/messageData'
import { useRecoilValue } from 'recoil'
import { useLocation } from 'react-router-dom'


const drawerHeight = 500

const useStyles = makeStyles((theme) => ({
    card: {
        minWidth: 500,

    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    pos: {
        marginBottom: 12,
    },

    drawer: {
        height: drawerHeight,
        flexShrink: 0
    },
    drawerPaper: {
        height: drawerHeight,
    },
    divider: {
        marginBottom: '20px',
        marginTop: '20px    '
    },
    cardActions: {
        marginLeft: '-10px'
    }
}));

export default function MessageDrawer({ message, openDrawer, setOpenDrawer }) {


    const messageData = useRecoilValue(messageState)
    const setRecoilMessagesData = useSetMessageData()
    const currentLocation = useLocation().pathname
    const classes = useStyles();

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpenDrawer(open);
    };

   //Compose dialog state and handle functions
   const [dialogOpen, setDialogOpen] = React.useState(false);
   const [error, setError] = React.useState("");


   const handleClickOpen = () => {
       setDialogOpen(true);
   };

   const handleClose = () => {
       setDialogOpen(false);
   };

   const handleSend = async (body) => {
       const res = await addMessage(body)
       
       if (res.error) {
           setError(res.error)
           setDialogOpen(true);
       } else {
           setDialogOpen(false)
       }
   }

   const handleDelete = async () => {
        try {
            await deleteMessage(message.id)
            if(currentLocation === '/'){
                const newMsgsList = await getReceivedMessages()
                setRecoilMessagesData(newMsgsList)  
            } 
            if(currentLocation === '/sent'){
                const newMsgsList = await getSentMessages()
                setRecoilMessagesData(newMsgsList)
            }
        } catch({message}) {
            setError(message)
        }
   }

    useEffect(() => {
        setOpenDrawer(openDrawer)
    }, [openDrawer])


    return (
        <div>
            <React.Fragment>
                <Drawer className={classes.drawer}
                    anchor='bottom' open={openDrawer}
                    onClose={toggleDrawer(false)}
                    classes={{ paper: classes.drawerPaper }}
                >

                    <Card className={classes.card}>
                        <CardContent>
                            {currentLocation === '/sent' && 
                            <>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                To: {message && capitalizeFirstLetter(message.receiver.firstName)} {message && capitalizeFirstLetter(message.receiver.lastName)} <br/> 
                                {message?.receiver.email}
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                                At : {message?.creationDate.split('T')[0]}
                            </Typography>
                        <CardActions className={classes.cardActions}>
                            <Button variant='contained' onClick={handleClickOpen} color='primary' size="small">Write again</Button>
                            <Button variant='contained' onClick={handleDelete} color='secondary' size="small">Delete</Button>
                        </CardActions>
                            <Typography variant="h4" component="h2">
                                {message?.title}
                            </Typography>
                            <Divider className={classes.divider}/>
                            <Typography variant="body2" component="p">
                                {message?.content}
                            </Typography>
                            </>}
                            {currentLocation === '/' && 
                            <>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                From: {message && capitalizeFirstLetter(message.sender.firstName)} {message && capitalizeFirstLetter(message.sender.lastName)} <br/> 
                                {message?.senderEmail}
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                                At : {message?.creationDate.split('T')[0]}
                            </Typography>
                        <CardActions className={classes.cardActions}>
                            <Button variant='contained' onClick={handleClickOpen} color='primary' size="small">Reply</Button>
                            <Button variant='contained' onClick={handleDelete} color='secondary' size="small">Delete</Button>
                        </CardActions>
                            <Typography variant="h4" component="h2">
                                {message?.title}
                            </Typography>
                            <Divider className={classes.divider}/>
                            <Typography variant="body2" component="p">
                                {message?.content}
                            </Typography>
                            </>}
                            
                        </CardContent>
                    </Card>
                    <ComposeDialog open={dialogOpen} handleClose={handleClose} handleSend={handleSend} error={error} senderEmail={message?.senderEmail} receiverEmail={message?.receiver.email}/>
                </Drawer>
            </React.Fragment>

        </div>
    );
}