import { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
  const history = useHistory();
  useEffect(() => {
    const token: string = localStorage.getItem("machine_token")!;
    alert(token);
    if (!token) {
      history.push("/login");
    }
    setToken(token);
  }, []);
  return (
    <AppContext.Provider value={{ token, setToken }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
