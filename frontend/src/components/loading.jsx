const Loading = function(){
	return(
		<>
		<div className="fixed backdrop-blur-sm inset-0 z-60 w-full h-full flex items-center justify-center">
			<div className="relative inset-0 flex items-center justify-center h-30 w-30 bg-rose-500/50 rounded-full">
				<div className="absolute w-20 h-20 bg-rose-500/30 rounded-full animate-[ping_1.5s_linear_infinite]">
				</div>
				<div className="absolute border-5 border-b-transparent border-rose-600/20 rounded-full w-full h-full animate-[spin_0.5s_linear_infinite] ">
				</div>
				
				<p className="text-rose-800 text-sm font-bold">Loading....</p>
			</div>
		</div>
		</>
	)
}

export default Loading;