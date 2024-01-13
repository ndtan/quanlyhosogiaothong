import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import {createOfficer, getOfficers} from "./business/officers";
import React, {useEffect, useState} from "react";
import Layout from "./Layout";
import Officers from "./pages/officers/Officers";
import Profiles from "./pages/profiles/Profiles";
import Manipulations from "./pages/manipulations/Manipulations";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Profiles />} />
          <Route path={"manipulations"} element={<Manipulations />} />
          <Route path={"officers"} element={<Officers />} />
        </Route>
      </Routes>
    </Router>
  );
}
