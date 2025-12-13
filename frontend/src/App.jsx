import { useState } from 'react'
import Home from './components/home'
import Header from './components/header'
import { FaHome } from 'react-icons/fa'
import Message from './components/home_component/message'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Search from './components/search.jsx'
import Profile from './components/home_component/profile.jsx'
import Login from './components/login/login.jsx'
import Loading from './components/loading.jsx'
import User from './components/user.jsx';
import Agent from './components/ai_agent/agent.jsx'
import './app.css';


function App() {
  const [select, setSelect] = useState({name:"home", icon:<FaHome/>});
  const [enter, setEnter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  

  return (
    <BrowserRouter>
      <div className='relative w-full h-screen bg-blue-100/20 overflow-auto'>
        {loading &&
          <Loading/>
        }
        {enter && userData &&
          <div className='sticky top-0 z-50 flex'>
            <Header select={select} setSelect={setSelect} userData={userData}/>
          </div>
        }

        <div className='flex w-full mx-auto sm:flex-row justify-center'>

          {enter && userData &&
          <div className='sticky top-14 hidden md:flex flex-col h-fit'>
            <Profile userData={userData} setSelect={setSelect}/>
            <Message/>
          </div>
          }

          <div className=''>
            <Routes>
            {enter && userData ?
              <>
                <Route path="/home" element={<Home setLoading={setLoading} userData={userData}/>} />
                <Route path="/search" element={<Search setLoading={setLoading} userData={userData}/>} />
                <Route path="/user/:id" element={<User setLoading={setLoading} userData={userData} setSelect={setSelect} setEnter={setEnter}/>} />
                <Route path="/notification" element={<Home setLoading={setLoading} userData={userData}/>} />
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/user" element={<Navigate to="/home" />} />
              </>
              :
              <Route path='*' element={<Login setEnter={setEnter} setLoading={setLoading} setUserData={setUserData}/>}/>
            }
            </Routes>
          </div>

          {enter && userData &&
          <div className='sticky top-14 inset-0 hidden sm:flex flex-col md:min-w-sm max-w-xs min-w-xs h-[655px]'>
            <Agent userData={userData}/>
          </div>
          }

        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
