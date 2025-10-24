import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MusicStaffDragDrop from "./pages/notes";
import MatchingLevel1 from "./pages/matching";
import Register from "./pages/register";
import Congratulations from "./pages/congrats";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/level1" element={<MusicStaffDragDrop />} />
          <Route path="/level2" element={<MatchingLevel1 />} />
          <Route path="/" element={<Register />} />
          <Route path="/congratulations" element={<Congratulations />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;