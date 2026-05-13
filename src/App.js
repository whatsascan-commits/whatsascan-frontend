import { useEffect, useRef, useState } from "react";
import axios from "axios";
import QRSection from "./components/QRSection";
import FileViewer from "./components/FileViewer";
import { socket } from "./socket/socket";

function App() {
  const [sessionId, setSessionId] = useState("");
  const [connected, setConnected] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const sessionCreatedRef = useRef(false);

  // =========================
  // 1. CREATE SESSION ONCE
  // =========================
  useEffect(() => {
    if (sessionCreatedRef.current) return;
    sessionCreatedRef.current = true;

    const createSession = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL;

        const res = await axios.post(`${apiUrl}/session/create`);

        console.log("SESSION CREATED:", res.data.sessionId);

        setSessionId(res.data.sessionId);
        setLoading(false);
      } catch (err) {
        console.log("SESSION ERROR:", err);
        setLoading(false);
      }
    };

    createSession();
  }, []);

  // =========================
  // 2. SOCKET INIT
  // =========================
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED:", socket.id);
    });

    socket.on("connected", () => {
      console.log("SESSION CONNECTED ✅");
      setConnected(true);
    });

    socket.on("new-file", (file) => {
      console.log("🔥 FILE RECEIVED FRONTEND:", file);
      setFiles((prev) => [file, ...prev]);
    });

    return () => {
      socket.off("connect");
      socket.off("connected");
      socket.off("new-file");
    };
  }, []);

  // =========================
  // 3. JOIN SESSION (FIXED)
  // =========================
  useEffect(() => {
    if (!sessionId) return;

    const joinRoom = () => {
      console.log("JOINING SESSION:", sessionId);
      socket.emit("join-session", sessionId);
    };

    socket.connect();

    socket.once("connect", joinRoom);

    // agar already connected ho
    if (socket.connected) {
      joinRoom();
    }

    return () => {
      socket.off("connect", joinRoom);
    };
  }, [sessionId]);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", textAlign: "center" }}>
      <h1>📲 WhatsApp File Transfer</h1>

      {loading && <h3>Loading session...</h3>}

      {!loading && !connected && sessionId && (
        <>
          <QRSection sessionId={sessionId} />
          <p>Scan QR and send:</p>
          <b>Connect:{sessionId}</b>
        </>
      )}

      {connected && (
        <h2 style={{ color: "green" }}>
          Connected Successfully ✅
        </h2>
      )}

      <FileViewer files={files} />

      {connected && files.length === 0 && (
        <h3>Waiting for files...</h3>
      )}
    </div>
  );
}

export default App;