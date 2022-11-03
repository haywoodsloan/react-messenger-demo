import { Route, Routes } from 'react-router-dom';

import './App.scss';
import Messenger from './components/messenger/Messenger';

export default function App () {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Messenger />} />
      </Routes>
    </div>
  );
}
