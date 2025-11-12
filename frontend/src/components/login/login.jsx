import React, { useState } from 'react';

const Login = function() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Username:', username);
    alert(`Logged in as ${username}`);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 rounded-2xl shadow-md w-80 flex flex-col space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>

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

        <button 
          type="submit" 
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
