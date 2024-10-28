import { useState } from 'react';
import './App.css';
import Logic from './Components/Logic.jsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Logic />
    </>
  );
}

export default App;