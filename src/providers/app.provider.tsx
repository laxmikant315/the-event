import { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
type ContextProps = {
  token: string;
  setToken: (token: string) => void;
  availableMargin: number;
  setAvailableMargin: (availableMargin: number) => void;
};

export const AppContext = createContext<ContextProps>({
  token: "",
  setToken: (token: string) => {},
  availableMargin: 0,
  setAvailableMargin: (availableMargin: number) => {},
});

const AppProvider = ({ children }: any) => {
  const [token, setToken] = useState("");
  const [availableMargin, setAvailableMargin] = useState(0);
  const history = useHistory();
  useEffect(() => {
    const token: string = localStorage.getItem("machine_token")!;
    if (!token) {
      history.push("/login");
    }
    setToken(token);
  }, []);
  return (
    <AppContext.Provider
      value={{ token, setToken, availableMargin, setAvailableMargin }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
