import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import {createOfficer, getOfficers} from "./business/officers";
import React, {useEffect, useState} from "react";
import Layout from "./Layout";
import Officers from "./pages/officers/Officers";
import Profiles from "./pages/profiles/Profiles";
import Manipulations from "./pages/manipulations/Manipulations";
import Return from "./pages/return/Return";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Profiles />} />
          <Route path={"manipulations"} element={<Manipulations />} />
          <Route path={"return"} element={<Return />} />
          <Route path={"officers"} element={<Officers />} />
          <Route path={"reports/solieutonghoso"} element={<Officers />} />
        </Route>
      </Routes>
    </Router>
  );
}
