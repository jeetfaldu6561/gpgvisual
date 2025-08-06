import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PaygapContent from "./PaygapContent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaygapContent />} />
      </Routes>
    </Router>
  );
}

export default App;