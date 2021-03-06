import React from 'react'
import MessagesListItem from '../MessagesListItem';
import Typography from '@material-ui/core/Typography';



export default function InboxList({ messagesData: { data = [] } }) {

    if(!data.length) {
        return (
            <Typography
            align='center'
            component="span"
            variant="body2"
            color="textPrimary"
          >You have 0 Messages</Typography>
        )
    }

    return (
        data.map(({ senderEmail, senderFirstName, senderLastName, title, content, creationDate, id, isRead, receiverDeleted }) => (
            <MessagesListItem key={id} id={id} data={data} first={senderFirstName} isRead={isRead} last={senderLastName} email={senderEmail} title={title} content={content} creationDate={creationDate} deleted={receiverDeleted}/>
        ))
    )

}