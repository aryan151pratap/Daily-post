import { useState } from 'react'
import Login from './components/login/login'
import Loading from './components/loading'
import Home from './components/home'
import Header from './components/header'
import { FaHome } from 'react-icons/fa'
import Message from './components/home_component/message'
import News from './components/home_component/news'
import {postsData} from './components/postData.js';
import { useEffect } from 'react'

function App() {
  const [select, setSelect] = useState({name:"home", icon:<FaHome/>});
  const [data, setData]  = useState(null);
  useEffect(() => {
    setData(postsData);
  }, [postsData]);

  return (
    <div className='relative w-full min-h-screen bg-yellow-100/20'>
      <div className='sticky top-0 z-50 flex'>
        <Header select={select} setSelect={setSelect}/>
      </div>
      {/* <Login/> */}
      {/* <Loading/> */}
      <div className='relative flex w-full h-full mx-auto sm:flex-row overflow-auto'>
        <div className='w-full flex flex-col'>
          {data?.map((i, index) => (
            <Home data={i} setData={setData}/>
          ))}
        </div>
        <div className='sticky flex flex-col md:w-sm w-full h-full'>
          <News/>
          <Message/>
        </div>
      </div>
    </div>
  )
}

export default App
