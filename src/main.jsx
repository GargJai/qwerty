import { createRoot } from "react-dom/client";
import "./index.css";
import {io} from 'socket.io-client';


const PORT = 3000; 
const URL = `http://localhost:${PORT}`; 

const socket = io(URL); 

const App = () => {
  return (
    <div>
      hello world
    </div>
  )
};

createRoot(document.getElementById("root")).render(<App />);
