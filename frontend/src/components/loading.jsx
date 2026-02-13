import { useEffect, useState } from "react";

const Loading = function () {


  return (
    <>
      <div className="fixed backdrop-blur-sm inset-0 z-60 w-full h-full flex items-center justify-center">

        <div className="relative inset-0 flex items-center justify-center h-30 w-30 bg-white-500/50 rounded-full">
          <p className="text-rose-800 text-sm font-bold">Loading....</p>
        </div>

      </div>
    </>
  );
};

export default Loading;
