import { useState } from 'react'
import './App.css'
import './index.css'
import MyList from './components/List';
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='container'>
      <MyList></MyList>
    </div>
  )
}

export default App