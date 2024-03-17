import { InputForm } from "./components/input-form";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import { Upload } from "./components/upload";
import { DrawerAppBar } from "./components/app-bar";
import { CustomizedBreadcrumbs } from './components/breadcrumbs';
import { useState } from "react";
import { Evaluation } from "./components/evaluate";
function App() {
  const [section, setSection] = useState('form');
  const navigate = useNavigate();
  const [title, setTitle] = useState('');

  // Map to next thing.
  const handleNavigate = (nextPath: string) => {
   navigate(nextPath); // update to history changes route + breadcrumb.
  };


  return (
    <div style={{
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      flexDirection: "column"
    }}>
      <DrawerAppBar />
      <CustomizedBreadcrumbs curPath={ window.location.pathname} />
      <Routes> 
        <Route path="/" element={<InputForm goNext={(propertyTitle: string) => {
          setTitle(propertyTitle);
          navigate("/upload?propertyTitle="+propertyTitle)
        }
        }/>} />
        <Route path="/upload" element={<Upload propertyTitle={title} goNext={() => { navigate('/evaluate') }} />} />
        <Route path="/evaluate" element={<Evaluation />} />


      </Routes>
      </div>
  );
}

export default App;
