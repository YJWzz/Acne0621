import "./App.css";
import Appstyles from "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chatbot from './templates/Chatbot/Chatbot';
import Mainpage from './templates/Mainpage/Mainpage';
import Inform from './templates/Inform/Inform';
import Form from './templates/Form/Form';
import AnalysisResult from './templates/AnalysisResult/AnalysisResult';

function App() {
  return (
    <div className="App">
      {/* <Router> */}
        <Routes>
          <Route path="/" element={<Mainpage />}/>
          <Route path="/Chatbot" element={<Chatbot />}/>
          <Route path="/Inform" element={<Inform />}/>
          <Route path="/Form" element={<Form />}/>
          <Route path="/AnalysisResult" element={<AnalysisResult />}/>
        </Routes>
      {/* </Router> */}
    </div>
  );
}

export default App;