import {
  createContext,
  JSX,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Socket, Manager } from "socket.io-client";
import {
  useLocation,
  // useNavigate
} from "react-router-dom";

type TStateSocket = "loading" | "disconnected" | "connected";

interface PropsSocketContext_I {
  socket: Socket;
  setdepartmentOpenId: (id: number | null) => void;
  ns: (namespace: string, opts?: any) => Socket;
}

export const SocketContext = createContext({} as PropsSocketContext_I);

interface PropsProviderSocketContext_I {
  children: JSX.Element;
}

export const SocketProvider = ({
  children,
}: PropsProviderSocketContext_I): JSX.Element => {
  const [departmentOpenId, setdepartmentOpenId] = useState<number | null>(null);
  // const { account } = useContext(AuthContext);
  const [_stateSocket, setStateSocket] = useState<TStateSocket>("loading");
  const path = useLocation();
  // const navigate = useNavigate();
  const audioOrderRef = useRef<HTMLAudioElement | null>(null);

  const manager = useMemo(() => {
    return new Manager(import.meta.env.VITE_API.split("/v1")[0], {
      timeout: 3000,
      autoConnect: true,
    });
  }, []);

  const socket = useMemo(() => manager.socket("/", { auth: {} }), [manager]);

  const ns = (nsp: string, opts = {}) => manager.socket(nsp, { ...opts });

  useEffect(() => {
    socket.on("connect_error", () => setStateSocket("disconnected"));
    socket.on("connect", () => setStateSocket("connected"));
    return () => {
      socket.off("connect_error");
      socket.off("connect");
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("inbox", () => {});
    }
    return () => {
      socket.off("inbox");
    };
  }, [socket, departmentOpenId]);

  useEffect(() => {
    if (socket) {
      socket.on("notify-order", () => {});
    }
    return () => {
      socket.off("inbox");
      socket.off("notify-order");
    };
  }, [socket, path.pathname]);

  const dataValue = useMemo(() => {
    return { socket: socket, setdepartmentOpenId, ns };
  }, [socket]);

  return (
    <SocketContext.Provider value={dataValue}>
      <audio
        className="hidden"
        ref={audioOrderRef}
        src="/audios/notify-fade-in.mp3"
      />
      {children}
    </SocketContext.Provider>
  );
};
