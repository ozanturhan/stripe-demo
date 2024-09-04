import { createContext, FC, ReactNode, useContext } from "react";

const AuthContext = createContext<{ customer: string } | undefined>(undefined);

export const AuthContextProvider: FC<{
  customer: string;
  children: ReactNode;
}> = ({ customer, children }) => {
  return (
    <AuthContext.Provider value={{ customer }}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
