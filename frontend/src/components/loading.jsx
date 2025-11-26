import { useEffect, useState } from "react";

const Loading = function () {

  const [randomCircles, setRandomCircles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const size = Math.floor(Math.random() * 30) + 8;
      const top = Math.random() * 100;
      const left = Math.random() * 100;

      const id = Date.now() + Math.random();

      setRandomCircles(prev => [
        ...prev,
        { id, size, top, left }
      ]);

      setTimeout(() => {
        setRandomCircles(prev => prev.filter(c => c.id !== id));
      }, 800);

    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="fixed backdrop-blur-sm inset-0 z-60 w-full h-full flex items-center justify-center">

        <div className="relative inset-0 flex items-center justify-center h-30 w-30 bg-white-500/50 rounded-full">

          <div className="absolute top-2 w-10 h-10 bg-rose-800/30 rounded-full animate-[ping_1.5s_linear_infinite]"></div>

          <div className="absolute right-30 w-15 h-15 bg-indigo-800/30 rounded-full animate-[ping_1.5s_linear_infinite]"></div>
          <div className="absolute left-30 w-8 h-8 bg-rose-800/30 rounded-full animate-[ping_1.5s_linear_infinite]"></div>
          <div className="absolute top-30 w-12 h-12 bg-purple-800/30 rounded-full animate-[ping_1.5s_linear_infinite]"></div>

          <div className="absolute top-[12%] left-[33%] w-6 h-6 bg-rose-800/30 rounded-full animate-[ping_1.8s_linear_infinite]"></div>
          <div className="absolute top-[58%] left-[72%] w-10 h-10 bg-rose-800/30 rounded-full animate-[ping_2.4s_linear_infinite]"></div>
          <div className="absolute top-[25%] left-[14%] w-4 h-4 bg-red-800/30 rounded-full animate-[ping_1.2s_linear_infinite]"></div>
          <div className="absolute top-[70%] left-[40%] w-8 h-8 bg-green-800/30 rounded-full animate-[ping_2s_linear_infinite]"></div>
          <div className="absolute top-[81%] left-[19%] w-5 h-5 bg-rose-800/30 rounded-full animate-[ping_1.4s_linear_infinite]"></div>
          <div className="absolute top-[45%] left-[5%] w-12 h-12 bg-yellow-800/30 rounded-full animate-[ping_2.7s_linear_infinite]"></div>
          <div className="absolute top-[10%] left-[80%] w-7 h-7 bg-orange-800/30 rounded-full animate-[ping_1.6s_linear_infinite]"></div>
          <div className="absolute top-[33%] left-[55%] w-9 h-9 bg-blue-800/30 rounded-full animate-[ping_2.2s_linear_infinite]"></div>
          <div className="absolute top-[65%] left-[90%] w-6 h-6 bg-sky-800/30 rounded-full animate-[ping_1.5s_linear_infinite]"></div>
          <div className="absolute top-[5%] left-[12%] w-11 h-11 bg-green-800/30 rounded-full animate-[ping_2.8s_linear_infinite]"></div>
          <div className="absolute top-[78%] left-[60%] w-4 h-4 bg-rose-800/30 rounded-full animate-[ping_1.1s_linear_infinite]"></div>
          <div className="absolute top-[40%] left-[30%] w-7 h-7 bg-zinc-800/30 rounded-full animate-[ping_2.3s_linear_infinite]"></div>

          {randomCircles.map(c => (
            <div
              key={c.id}
              className="absolute bg-rose-600/40 rounded-full animate-[ping_0.7s_linear]"
              style={{
                width: c.size,
                height: c.size,
                top: `${c.top}%`,
                left: `${c.left}%`
              }}
            ></div>
          ))}

          <p className="text-rose-800 text-sm font-bold">Loading....</p>
        </div>

      </div>
    </>
  );
};

export default Loading;
