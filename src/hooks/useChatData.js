import { useEffect, useState } from "react";
import { firestoreInstance } from "../configs/Firebase.config";

const useChatData = (user, chatId) => {
  const [chat, setChat] = useState({});
  const [chatUser, setChatUser] = useState({});

  useEffect(() => {
    async function fetchChat() {
      const data = await firestoreInstance.doc(`chats/${chatId}`).get();
      const chatData = data.data();
      setChat(chatData);
      const otherUserId =
        chatData && chatData.user1 === user.uid
          ? chatData.user2
          : chatData.user1;
      firestoreInstance.doc(`users/${otherUserId}`).onSnapshot((snapshot) => {
        setChatUser(snapshot.data());
      });
    }
    fetchChat();
  }, [chatId, user]);
  return { chat, chatUser };
};
export default useChatData;
