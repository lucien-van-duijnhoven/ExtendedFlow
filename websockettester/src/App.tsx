import { createSignal } from "solid-js";
import solidLogo from "./assets/solid.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function connect(url: string) {
  const ws = new WebSocket(url);
  ws.onopen = () => {
    console.log("connected");
  };
  ws.onclose = () => {
    console.log("disconnected");
  };
  ws.onerror = (err) => {
    console.error(err);
  };
  ws.onmessage = (msg) => {
    console.log(msg);
  };
}

function App() {
  const [wsUrl, setWsUrl] = createSignal("ws://localhost:8020");
  return (
    <>
      <input
        type="text"
        value={wsUrl()}
        onInput={(e) => setWsUrl(e.currentTarget.value)}
      />
      <button onClick={() => connect(wsUrl())}>Connect</button>
    </>
  );
}

export default App;
