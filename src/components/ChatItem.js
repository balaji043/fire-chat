import React from "react";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import useChatData from "../hooks/useChatData";

export default function ChatItem({ chatId, selectedChat, onChatClick, user }) {
  const { chat, chatUser } = useChatData(user, chatId);

  return chat && chatUser ? (
    <ListItem
      button
      onClick={(e) => {
        onChatClick({ chat, chatUser });
      }}
      selected={
        selectedChat && selectedChat.chat && selectedChat.chat.id === chat.id
      }
    >
      <ListItemAvatar>
        <Avatar alt={chatUser.displayName} src={chatUser.photoURL} />
      </ListItemAvatar>
      <ListItemText>
        <Typography>{chatUser.displayName}</Typography>
      </ListItemText>
    </ListItem>
  ) : (
    <div></div>
  );
}
