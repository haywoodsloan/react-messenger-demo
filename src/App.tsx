import { Route, Routes } from 'react-router-dom';

import Messenger from './components/messenger/Messenger';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Messenger />} />
    </Routes>
  );
}
