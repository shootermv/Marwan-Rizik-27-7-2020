import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { getMessageById, markMessageAsRead, getReceivedMessages, getSentMessages } from '../../../actions/actions'
import MessageDrawer from '../MessageDrawer'
import { useSetMessageData } from '../../../store/messageData'
import { routes } from '../../../constants';
import { useLocation } from 'react-router-dom'




const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '90%',
    marginTop: '5px',
    backgroundColor: theme.palette.background.paper
  },
  read: {
    backgroundColor: `${theme.palette.grey[200]} `
  },
  inline: {
    display: 'inline',
  },
  avatar: {
    marginRight: '5px',
    alignSelf: 'center'
  },
  itemListContainer: {
    display: 'flex',
    justifyContent: 'center',
  }
}));


export default function MessagesListItem({ email, title, content, isRead, id, creationDate, sentList, deleted }) {

  const [message, setMessage] = useState()
  const [openDrawer, setOpenDrawer] = useState(false)
  
  const currentLocation = useLocation().pathname

  const setRecoilMessagesData = useSetMessageData()

  const handleClick = async () => {
    try {
      const messageData = await getMessageById(id)
      setMessage(messageData)
      setOpenDrawer(true)
      markMessageAsRead(id)
      if (currentLocation === routes.inbox) {
        const newMsgData = await getReceivedMessages()
        setRecoilMessagesData(newMsgData)
      } else if (currentLocation === routes.sent) {
        const newMsgData = await getSentMessages()
        setRecoilMessagesData(newMsgData)
      }

    } catch {
      setMessage({ error: 'Ops, Server Error Try Again Later' })
    }
  }


  const classes = useStyles();


  return (


    <div className={classes.itemListContainer}>
      {deleted ? '' :
        <>
          <ListItem onClick={handleClick} className={`${classes.root} ${isRead && classes.read} ${sentList && classes.read}`} alignItems="flex-start">
            <Avatar className={classes.avatar}>{`${email[0].toUpperCase()}`}</Avatar>
            <ListItemText
              primary={title}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {`${email}-  `}
                  </Typography>
                  {`${content.length < 70 ? content : content.slice(0, 70) + '...'}`}
                  <br />
                  {creationDate.split('T')[0]}
                </React.Fragment>
              }
            />
          </ListItem>
          <MessageDrawer message={message?.data} openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
        </>
      }

    </div>
  );
}