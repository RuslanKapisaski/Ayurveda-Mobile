import { useContext } from "react";

import { AuthContext } from "./AuthProvider";

export default function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
