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
  const [agent, setAgent] = useState(false);
  

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

          <div className='mb-12'>
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

          <div className={`${!agent ? "fixed inset-0 bg-black/20 sm:bg-black/0 w-full h-screen z-20 sm:relative sm:w-fit sm:h-fit" : ""}`}>
          </div>
          
          {enter && userData &&
          <div 
            className={`${agent ? "hidden" : "fixed z-30 top-15 right-10 h-[600px]"} border border-rose-200 focus-within:border-rose-300 sm:border-0 rounded-md 
            sm:sticky sm:top-14 sm:inset-0 sm:flex flex-col md:min-w-sm max-w-xs min-w-xs sm:h-[655px]`}>
            <Agent userData={userData}/>
          </div>
          }
          <div className='h-8 w-fit sm:hidden flex items-center justify-center fixed bottom-4 right-8 z-30 bg-rose-500 p-2 rounded-md cursor-pointer group'
            onClick={() => setAgent(e => !e)}
          >
            <p className='text-xs text-white flex flex-col justify-center p-0 opacity-0 w-0 group-hover:px-2 group-hover:w-full group-hover:opacity-100 transition-all duration-400'>
              <span>Agent</span>
            </p>
            <p className='w-6 h-5 p-3 text-md font-bold text-rose-100 bg-rose-200/30 flex items-center justify-center rounded-md'>AI</p>
          </div>

        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
