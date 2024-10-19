import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";

const Home = () => {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState("");

  const onClickCreate = () => {
    navigate("/game");
  };

  const onClickJoin = () => {
    if (gameId) {
      navigate("/join", { state: { gameId } });
    } else {
      alert("Please enter a Game ID");
    }
  };

  return (
    <div className="h-screen w-full bg-neutral-700 flex flex-col items-center justify-center">
      <div>
        <input
          type="text"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          className="w-72 mb-9 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Game ID"
        />
      </div>
      <div className="flex gap-4">
        <Button onClick={onClickJoin}> Join Race </Button>
        <Button onClick={onClickCreate}> Create RaceTrack </Button>
      </div>
    </div>
  );
};


export default Home;
