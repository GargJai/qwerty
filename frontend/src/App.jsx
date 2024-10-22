import { Routes, BrowserRouter, Route } from "react-router-dom";
import Home from "./pages/Home";
import Race from "./pages/Race";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/join" element={<Race master={false} />} />
                <Route path="/race" element={<Race master={true} />}></Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
