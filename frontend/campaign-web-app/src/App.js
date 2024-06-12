import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import AudienceForm from './componenets/AudienceForm'; 
import CampaignList from './componenets/CampaignList'; 
import Login from './componenets/Login';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path="/campaigns" element={<CampaignList />} />
        <Route path="/audience" element={<AudienceForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
