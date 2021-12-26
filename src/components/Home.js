import React, { useState } from "react";
import { Chat, ChatList } from "./";
import { firestoreInstance } from "../configs/Firebase.config";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Box, Grid, Hidden } from "@material-ui/core";

export default function Home({ user }) {
  const userDocReference = firestoreInstance.doc(`users/${user.uid}`);
  const [userData] = useDocumentData(userDocReference);
  const [selectedChat, setSelectedChat] = useState({});

  const chatList = () => (
    <ChatList
      userData={userData}
      selectedChat={selectedChat}
      setSelectedChat={setSelectedChat}
      user={user}
    />
  );
  return userData ? (
    <>
      <Hidden smUp>
        {selectedChat && selectedChat.chatUser && selectedChat.chat ? (
          <Chat
            user={user}
            chatData={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        ) : (
          chatList()
        )}
      </Hidden>

      <Hidden xsDown>
        <Box>
          <Grid container>
            <Grid item sm={4} md={3} lg={3} xl={3}>
              {chatList()}
            </Grid>
            <Grid item sm={8} md={9} lg={9} xl={9}>
              <Chat user={user} chatData={selectedChat} />
            </Grid>
          </Grid>
        </Box>
      </Hidden>
    </>
  ) : (
    <div>Loadig</div>
  );
}
