import React, { useState } from "react";
import {
  AppBar,
  Hidden,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import { ArrowBack, Search, Send } from "@material-ui/icons";
import imgageToShowWhenNoChatSelected from "../images/onNoChatSelected.jpg";
import { MessageList } from "./";
import { firestoreInstance } from "../configs/Firebase.config";
import firebase from "firebase";
const { makeStyles } = require("@material-ui/core");

export default function Chat({ chatData, user, setSelectedChat }) {
  const classes = useStyles();
  const [input, setInput] = useState("");
  const { chatUser, chat } = chatData;

  const handleMessageSend = async (message) => {
    if (!message) {
      return;
    }
    const messageData = {
      createdOn: firebase.firestore.FieldValue.serverTimestamp(),
      message,
      sendBy: user.uid,
    };
    await firestoreInstance
      .collection("chats")
      .doc(chat.id)
      .collection("messages")
      .add(messageData);
  };

  return !chatUser ? (
    <div className={classes.imageContainer}>
      <img
        className={classes.image}
        src={imgageToShowWhenNoChatSelected}
        alt="Select a chat from left"
      />
    </div>
  ) : (
    <div className={classes.rootContainer}>
      <AppBar position="static">
        <Toolbar>
          <Avatar
            className={classes.avatar}
            alt={chatUser.displayName}
            src={chatUser.photoURL}
          />
          <div className={classes.title}>
            <Typography variant="h6" color="inherit">
              {chatUser.displayName}
            </Typography>
          </div>
          <div>
            <IconButton>
              <Search />
            </IconButton>
            <Hidden smUp>
              <Tooltip title="Go Back">
                <IconButton
                  onClick={() => {
                    setSelectedChat({});
                  }}
                >
                  <ArrowBack />
                </IconButton>
              </Tooltip>
            </Hidden>
          </div>
        </Toolbar>
      </AppBar>
      <MessageList chat={chat} user={user} />
      <Toolbar>
        <Paper component="form" className={classes.sendMessageContainer}>
          <TextField
            className={classes.input}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder="Type a message here"
            inputProps={{ "aria-label": "search google maps" }}
            autoFocus
          />
          <IconButton
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              const message = input;
              setInput("");
              handleMessageSend(message);
            }}
            aria-label="search"
          >
            <Send />
          </IconButton>
        </Paper>
      </Toolbar>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    maxHeight: window.innerHeight,
    // minHeight: "100vh",
    minHeight: "-webkit-fill-available",
    backgroundColor: "#F8F9FB",
  },
  image: {
    maxHeight: "-webkit-fill-available",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  sendMessageContainer: {
    display: "inherit",
    width: "100%",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
}));
