import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import {createOfficer, getOfficers} from "./business/officers";
import {useEffect, useState} from "react";

function Hello() {
  const [officers, setOfficers] = useState([]);

  useEffect(() => {
    getOfficers({}).then(officers => setOfficers(officers));
    // createOfficer({}).then(info => console.log('info', info))
    //   .catch(error => console.warn(error));
  }, []);

  console.log('officers', officers);

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      {officers.map(o => <div key={o.id}>
        <span>{o.id}</span>
        <span>{o.name}</span>
        <span>{o.birthday}</span>
      </div>)}

      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
