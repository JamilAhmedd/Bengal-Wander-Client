import React, { use } from "react";
import { AuthContext } from "./AuthContext.jsx";

const useAuth = () => {
  const context = use(AuthContext);

  return context;
};

export default useAuth;
