import { List, makeStyles } from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import useMessageCollection from "../hooks/useMessageCollection";
import { MessageItem } from "./";

export default function MessageList({ chat, user }) {
  const classes = useStyles();
  const messagesEndRef = useRef(null);
  const messageCollection = useMessageCollection(chat);

  const scrollToBottom = () => {
    if (messagesEndRef && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [messageCollection]);

  return chat && messageCollection ? (
    <>
      <List className={classes.messageList}>
        {messageCollection.map((message, i) => {
          return (
            <MessageItem
              key={i}
              message={message}
              sendByCurrentUser={user.uid === message.sendBy}
            />
          );
        })}
        <div id="messagesEndRef" ref={messagesEndRef} />
      </List>
    </>
  ) : (
    <div className={classes.messageList}></div>
  );
}

const useStyles = makeStyles((theme) => ({
  messageList: {
    flexGrow: 1,
    overflow: "auto",
    backgroundColor: "#F5F5F5",
  },
}));
