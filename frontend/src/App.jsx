import { useState } from 'react'
import Home from './components/home'
import Header from './components/header'
import { FaHome } from 'react-icons/fa'
import Message from './components/home_component/message'
import News from './components/home_component/news'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Search from './components/search.jsx'
import Profile from './components/home_component/profile.jsx'
import Login from './components/login/login.jsx'
import Loading from './components/loading.jsx'


function App() {
  const [select, setSelect] = useState({name:"home", icon:<FaHome/>});
  const [enter, setEnter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  return (
    <BrowserRouter>
      <div className='relative w-full h-screen bg-blue-100/20 overflow-auto'>
        {loading == true &&
          <Loading/>
        }
        {enter && userData &&
          <div className='sticky top-0 z-50 flex'>
            <Header select={select} setSelect={setSelect}/>
          </div>
        }

        <div className='relative flex w-full mx-auto sm:flex-row justify-center'>

          {enter && userData &&
          <div className='sticky top-14 hidden md:flex flex-col h-fit'>
            <Profile/>
            <Message/>
          </div>
          }

          <Routes>
            <Route path='*' element={<Login setEnter={setEnter} setLoading={setLoading} setUserData={setUserData}/>}/>
            {enter && userData &&
              <>
                <Route path="/home" element={<Home setLoading={setLoading} userData={userData}/>} />
                <Route path="/search" element={<Search userData={userData}/>} />
                <Route path="/user" element={<Home userData={userData}/>} />
                <Route path="/notification" element={<Home userData={userData}/>} />
              </>
            }
          </Routes>

          {enter && userData &&
          <div className='sticky top-14 inset-0 hidden sm:flex flex-col md:w-sm w-full h-full'>
            <News/>
          </div>
          }

        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
