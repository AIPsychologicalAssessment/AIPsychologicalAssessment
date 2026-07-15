import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainScreen from "./screens/MainScreen";
import DrawScreen from "./screens/DrawScreen";
import ResultScreen from "./screens/ResultScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/draw/:testId" element={<DrawScreen />} />
        <Route path="/result/:testId" element={<ResultScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
