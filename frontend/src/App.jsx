import { useState } from 'react'
import Home from './components/home'
import Header from './components/header'
import { FaHome } from 'react-icons/fa'
import Message from './components/home_component/message'
import News from './components/home_component/news'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Search from './components/search.jsx'
import Profile from './components/home_component/profile.jsx'
import Login from './components/login/login.jsx'
import Loading from './components/loading.jsx'
import User from './components/user.jsx';


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

        <div className='relative flex w-full mx-auto sm:flex-row justify-center'>

          {enter && userData &&
          <div className='sticky top-14 hidden md:flex flex-col h-fit'>
            <Profile userData={userData} setSelect={setSelect}/>
            <Message/>
          </div>
          }

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
