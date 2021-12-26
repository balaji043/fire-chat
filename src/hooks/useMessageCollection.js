const { useCollectionData } = require("react-firebase-hooks/firestore");
const { firestoreInstance } = require("../configs/Firebase.config");

const useMessageCollection = (chat) => {
  const messageCollectionRef = firestoreInstance.collection(
    `chats/${chat.id}/messages`
  );
  const messageCollectionsQuery = messageCollectionRef
    .orderBy("createdOn")
    .limit(25);
  const [messageCollection] = useCollectionData(messageCollectionsQuery);
  return messageCollection;
};

export default useMessageCollection;
