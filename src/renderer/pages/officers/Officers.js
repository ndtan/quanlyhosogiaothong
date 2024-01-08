import React, {useEffect, useState} from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, Link } from 'react-router-dom';
import {getOfficers} from "../../business/officers";
import icon from "../../../../assets/icon.svg";

export default function Officers() {
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
      <h1>Officers</h1>
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
