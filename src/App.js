import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './shared/NavBar';
import GameView from './views/GameView';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<GameView />} exact />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
