import { createContext, useState } from "react";
import { useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Retrieve auth data from localStorage if available
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });
  useEffect(() => {
    // Save auth data to localStorage whenever it changes
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
