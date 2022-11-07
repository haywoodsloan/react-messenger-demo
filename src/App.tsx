import { Route, Routes } from 'react-router-dom';

import style from './App.module.scss';
import Messenger from './components/messenger';

export default function App() {
  return (
    <div className={style.container}>
      <Routes>
        <Route path="/" element={<Messenger />} />
      </Routes>
    </div>
  );
}
