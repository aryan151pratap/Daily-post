import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const VITE_BACKEND = import.meta.env.VITE_BACKEND;

const Login = function({setEnter, setLoading, setUserData}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const storedEmail = localStorage.getItem("daily-post-email");

        if (storedEmail) {
          const res = await fetch(`${VITE_BACKEND}/autologin/${storedEmail}`);
          const result = await res.json();

          if (res.ok) {
            setUserData(result.user);
            setEnter(true);
            navigate("/home");
          }
        }
      } catch (err) {
        console.log(err);
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = login ? { email, password } : { email, username, password };
    const res = await fetch(`${VITE_BACKEND}/${login ? "login" : "signup"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if(res.ok){
      localStorage.setItem("daily-post-email", email);
      setEnter(true);
      navigate("/home");
    } else {
      if(result?.status == 400){
        setLogin(!login);
      }
      setMessage(result.message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div
        className="bg-white p-6 rounded-2xl shadow-md w-80 flex flex-col space-y-4"
      >

      <form 
        className='w-full flex flex-col gap-2'
        onSubmit={handleSubmit} 
      >
        <h2 className="text-2xl font-semibold text-center">{login ? "Login" : "Sign up"}</h2>

        <div className="flex flex-col">
          <label className="mb-1 text-gray-700">Email</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {!login &&
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700">Username</label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        }

        <div className="flex flex-col">
          <label className="mb-1 text-gray-700">Password</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit" 
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>
      </form>
      <button 
        className='p-2 rounded-md text-blue-500 underline cursor-pointer'
        onClick={() => setLogin(!login)}
      >
        {!login ? "Login" : "Sign up"}
      </button>
      {message &&
      <pre className='bg-rose-200 rounded-md p-2 w-full flex items-center justify-center text-rose-500 text-sm font-semibold font-serif'>
        {message}
      </pre>
      }
      </div>
    </div>
  );
};

export default Login;
