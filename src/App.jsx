import { Routes, BrowserRouter, Route, useParams } from "react-router-dom";
import Game from './pages/Game';
import Join from './pages/Join';
import Home from './pages/Home';
import Race from './pages/Race'
	
const App = () => {
	
	return (
	  <BrowserRouter>
		  <Routes>
			  <Route path="/" element={<Home />} />
			  <Route path="/game" element={<Game />} />
			  <Route path="/join" element={<Race master={false}/>} />
			  <Route path="/race" element={<Race master={true}/>}></Route>
		  </Routes>
	  </BrowserRouter>
   );
};

export default App; 