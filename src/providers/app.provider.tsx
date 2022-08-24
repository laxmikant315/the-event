import { createContext, useState } from "react";
type ContextProps = {
  token: string;
  setToken: (token: string) => void;
};

export const AppContext = createContext<ContextProps>({
  token: "",
  setToken: (token: string) => {},
});

const AppProvider = ({ children }: any) => {
  const [token, setToken] = useState("");

  return (
    <AppContext.Provider value={{ token, setToken }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
