import { ListItem, makeStyles, Typography } from "@material-ui/core";
import React from "react";
const useStyles = makeStyles((theme) => ({
  send: {
    justifyContent: "flex-end",
    maxWidth: "60%",
    backgroundColor: "#DCF8C6",
    padding: "1% 5% 1% 5%",
    borderRadius: "10px",
  },
  alignRight: {
    justifyContent: "flex-end",
  },
  received: {
    padding: "1% 5% 1% 5%",
    color: "white",
    backgroundColor: "#478fb9",
    maxWidth: "60%",
    borderRadius: "10px",
  },
  message: {
    wordBreak: "break-word",
  },
}));

export default function MessageItem({ message, sendByCurrentUser }) {
  const classes = useStyles();

  return message ? (
    <ListItem
      key={message.id}
      className={`${sendByCurrentUser ? classes.alignRight : ``}`}
    >
      <div className={`${sendByCurrentUser ? classes.send : classes.received}`}>
        <Typography component="p" className={classes.message}>
          {message.message}
        </Typography>
      </div>
    </ListItem>
  ) : (
    <div></div>
  );
}
