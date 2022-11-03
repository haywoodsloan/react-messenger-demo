import { Routes, Route } from 'react-router-dom';
import Messenger from 'components/messenger/Messenger';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Messenger />} />
      </Routes>
    </div>
  );
}

export default App;
