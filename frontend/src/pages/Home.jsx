import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const onClick = () => {
        navigate("/race");
    };

    return (
        <div className="h-screen w-screen bg-slate-700 flex items-center justify-center">
            <button
                onClick={onClick}
                className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
            >
                Create Race
            </button>
        </div>
    );
};

export default Home;
