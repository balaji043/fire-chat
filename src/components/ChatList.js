import React, { useState } from "react";

import {
  AppBar,
  Box,
  Button,
  IconButton,
  List,
  Modal,
  Paper,
  Popover,
  Radio,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";

import { green } from "@material-ui/core/colors";
import { Avatar } from "@material-ui/core";
import { firebaseAuth, firestoreInstance } from "../configs/Firebase.config";
import { ChatItem } from "./";
import firebase from "firebase/app";

import MoreHorizSharpIcon from "@material-ui/icons/MoreHorizSharp";
import AddSharpIcon from "@material-ui/icons/AddSharp";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SearchIcon from "@material-ui/icons/Search";
const { makeStyles } = require("@material-ui/core");

export default function ChatList({
  userData,
  selectedChat,
  setSelectedChat,
  user,
}) {
  const [openSearchModal, setOpenSearchModal] = React.useState(false);
  const [searchUserInput, setSearchUserInput] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);

  const classes = useStyles();
  const openOptionPopover = Boolean(anchorEl);
  const id = openOptionPopover ? "simple-popover" : undefined;

  const handleSearchUser = async (e) => {
    if (searchUserInput && searchUserInput.length !== 0) {
      const result = await firestoreInstance
        .collection("users")
        .where("displayName", ">=", searchUserInput)
        .where("displayName", "!=", user.displayName)
        .get();

      const userArray = [];
      result.docs.forEach((snapshot) => {
        userArray.push(snapshot.data());
      });

      setSearchedUsers(userArray);
    } else {
      setSearchedUsers([]);
    }
  };

  const handleStartChat = async (e) => {
    if (!selectedUser.id) {
      return;
    }
    const chatId =
      selectedUser.id > user.uid
        ? `${selectedUser.id}${user.uid}`
        : `${user.uid}${selectedUser.id}`;
    const chatData = await firestoreInstance.doc(`chats/${chatId}`).get();
    if (chatData.exists) {
      setSelectedChat({
        chat: chatData,
        chatUser: selectedUser,
      });
      return;
    }
    const chat = {
      id: chatId,
      messages: [],
      user1: user.uid,
      user2: selectedUser.id,
      createdOn: firebase.firestore.FieldValue.serverTimestamp(),
      updatedOn: firebase.firestore.FieldValue.serverTimestamp(),
    };
    await firestoreInstance.collection(`chats`).doc(chatId).set(chat);
    await firestoreInstance
      .collection("users")
      .doc(user.uid)
      .update({
        chats: firebase.firestore.FieldValue.arrayUnion(chatId),
      });
    await firestoreInstance
      .collection("users")
      .doc(selectedUser.id)
      .update({
        chats: firebase.firestore.FieldValue.arrayUnion(chatId),
      });
    setSelectedChat({ chat, selectedUser });
  };

  const modelBody = () => {
    return (
      <Modal
        open={openSearchModal}
        onClose={() => {
          setOpenSearchModal(false);
          setSearchedUsers([]);
          setSearchUserInput("");
          setSelectedUser({});
        }}
      >
        <div className={classes.modalStyle}>
          <Paper component="form" className={classes.modalRoot}>
            <TextField
              className={classes.input}
              value={searchUserInput}
              onChange={(e) => {
                setSearchUserInput(e.target.value);
                handleSearchUser(e);
              }}
              placeholder="Search with friends name. case sensitive"
              inputProps={{ "aria-label": "search google maps" }}
            />
            <IconButton
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleSearchUser(e);
              }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </Paper>
          <li className={classes.userList}>
            {searchedUsers.length !== 0 ? (
              searchedUsers.map((searchedUser, i) => (
                <Paper key={i} className={classes.profile}>
                  <div className={classes.profileNameAndAvatar}>
                    <Avatar
                      alt={searchedUser.displayName}
                      src={searchedUser.photoURL}
                    />
                    <Typography>{searchedUser.displayName}</Typography>
                  </div>
                  <Radio
                    className={classes.radioButton}
                    checked={selectedUser.id === searchedUser.id}
                    onChange={(e) => setSelectedUser(searchedUser)}
                    value="a"
                    name="radio-button-demo"
                    inputProps={{ "aria-label": "A" }}
                  />
                </Paper>
              ))
            ) : (
              <div></div>
            )}
          </li>
          <Button
            className={classes.startChatButton}
            variant="outlined"
            color="primary"
            onClick={(e) => {
              handleStartChat(e);
              setOpenSearchModal(false);
            }}
          >
            Start Chat
          </Button>
        </div>
      </Modal>
    );
  };

  const popoverOptions = () => {
    return (
      <Popover
        id={id}
        open={openOptionPopover}
        anchorEl={anchorEl}
        onClose={(e) => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={async (e) => {
            await firebaseAuth.signOut();
          }}
          className={classes.button}
          startIcon={<ExitToAppIcon />}
        >
          Sign out
        </Button>
      </Popover>
    );
  };
  return (
    <div>
      {modelBody()}
      {popoverOptions()}
      <AppBar position="static">
        <Toolbar>
          <Avatar alt={user.displayName} src={user.photoURL} />
          <Box component="div" flexGrow="1" />
          <div>
            <IconButton
              onClick={() => {
                setOpenSearchModal(true);
              }}
            >
              <AddSharpIcon style={{ color: green }} />
            </IconButton>
            <IconButton
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
              }}
            >
              <MoreHorizSharpIcon style={{ color: green }} />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {userData && userData.chats ? (
        <List className={classes.chatList}>
          {userData.chats.map((chatId, i) => {
            return (
              <ChatItem
                key={i}
                selectedChat={selectedChat}
                chatId={chatId}
                onChatClick={setSelectedChat}
                user={user}
              />
            );
          })}
        </List>
      ) : (
        <div></div>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  chatList: {
    overflow: "auto",
    height: "-webkit-fill-available",
  },
  grow: {
    flexGrow: 1,
  },
  profile: {
    display: "flex",
    padding: 5,
    marginTop: 5,
    width: 400,
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: " 50%",
    transform: "translate(-50%, -50%) !important",
    outline: "none",
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
  },
  modalRoot: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  startChatButton: {
    float: "right",
    marginTop: 5,
  },
  userList: {
    listStyle: "none",
    height: 300,
  },
  radioButton: {
    float: "right",
  },
  profileNameAndAvatar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
}));
