import React from "react";
import { Auth, Home } from "./components";

import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "./configs/Firebase.config.js";
import Loading from "./components/loading/Loading";

function App() {
  const [user, loading, error] = useAuthState(firebaseAuth);

  if (user) {
    return <Home user={user} />;
  }
  if (loading && !error) {
    return <Loading />;
  }
  if (error && !loading) {
    return <Auth />;
  }
  return <Auth />;
}

export default App;
