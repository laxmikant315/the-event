import moment from "moment";
import { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { A } from "../helpers/binary-parser/parser";
type ContextProps = {
  token: string;
  setToken: (token: string) => void;
  kiteToken: string;
  setKiteToken: (token: string) => void;
  availableMargin: number;
  setAvailableMargin: (availableMargin: number) => void;
  wsData: any;
  setInstrumentTokens: (instrumentTokens: any) => void;
  orginalDetails: any;
  setOriginalDetails: (orginalDetails: any) => void;
};

export const AppContext = createContext<ContextProps>({
  token: "",
  setToken: (token: string) => {},
  kiteToken: "",
  setKiteToken: (token: string) => {},
  availableMargin: 0,
  setAvailableMargin: (availableMargin: number) => {},
  wsData: null,
  setInstrumentTokens: (instrumentTokens: any) => {},
  orginalDetails: null,
  setOriginalDetails: (orginalDetails: any) => {},
});

const AppProvider = ({ children }: any) => {
  const [token, setToken] = useState("");
  const [kiteToken, setKiteToken] = useState("");
  const [availableMargin, setAvailableMargin] = useState(0);
  const history = useHistory();
  const [wsData, setWsData] = useState<any>(null);
  const [instrumentTokens, setInstrumentTokens] = useState<any>(null);

  useEffect(() => {
    const token: string = localStorage.getItem("machine_token")!;
    if (!token) {
      history.push("/login");
    }
    setToken(token);
  }, []);

  let doSend: any;
  const [isOpened, setIsOpen] = useState(false);
  const [websocket, setWebsocket] = useState<any>(null);
  const [orginalDetails, setOriginalDetails] = useState<any>(null);
  useEffect(() => {
    if (isOpened && doSend) {
      const tokens = `[256265,268041${
        instrumentTokens && instrumentTokens.length
          ? "," + instrumentTokens.join(",")
          : ""
      } ]`;
      doSend(`{"a":"unsubscribe","v":${tokens}}`);
      doSend(`{"a":"subscribe","v":${tokens}}`);
      doSend(`{"a":"mode","v":["ltpc",${tokens}]}`);
    }
  }, [isOpened, instrumentTokens]);
  // let websocket: any;
  doSend = function (message: any) {
    console.log("SENT: " + message);

    if (websocket) {
      websocket.send(message);
    }
  };
  useEffect(() => {
    if (!kiteToken) {
      return;
    }
    const token = encodeURIComponent(kiteToken.split(" ")[1]);
    const uid = moment().unix() * 1000;
    var wsUri = `wss://ws.zerodha.com/?api_key=kitefront&user_id=BV7667&enctoken=${token}&uid=${uid}&user-agent=kite3-web&version=3.0.3`;
    // let output: any;

    function init() {
      // output = document.getElementById("output");
      testWebSocket();
    }

    function testWebSocket() {
      const websocket = new WebSocket(wsUri);
      setWebsocket(websocket);
      websocket.onopen = function (evt: any) {
        onOpen(evt);
      };

      websocket.onmessage = async function (evt: any) {
        await onMessage(evt);
      };

      websocket.onerror = function (evt: any) {
        onError(evt);
      };
    }

    function onOpen(evt: any) {
      console.log("WSS CONNECTED");
      setIsOpen(true);
      // doSend('{"a":"subscribe","v":[256265,268041,4754177]}');
      // doSend(`{"a":"mode","v":["ltpc",[256265,268041,4754177]]}`);
    }

    async function onMessage(evt: any) {
      let output = evt.data;
      const arrayBuffer = await new Response(evt.data).arrayBuffer();
      if (arrayBuffer instanceof ArrayBuffer && arrayBuffer.byteLength > 2) {
        const a1 = new A();
        output = a1.parseBinary(arrayBuffer);
        setWsData(output);
      }

      //   websocket.close();
    }

    function onError(evt: any) {
      console.log('<span style="color: red;">ERROR:</span> ' + evt.data);
    }
    init();
    // window.addEventListener("load", init, false);
  }, [kiteToken]);

  return (
    <AppContext.Provider
      value={{
        token,
        setToken,
        kiteToken,
        setKiteToken,
        availableMargin,
        setAvailableMargin,
        wsData,

        setInstrumentTokens,
        orginalDetails,
        setOriginalDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
