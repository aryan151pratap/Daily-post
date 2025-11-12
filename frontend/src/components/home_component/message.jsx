import { FaArrowDown } from "react-icons/fa";

const Message = function(){
	return(
		<div className="p-4 min-w-xs h-full">
			<div className="w-full h-full bg-white border border-zinc-200 rounded-md">
				<div className="p-2 flex justify-between items-center border-b border-zinc-200">
					<p>Messages</p>
					<FaArrowDown className="text-zinc-500 text-sm cursor-pointer"/>
				</div>
			</div>
		</div>
	)
}

export default Message;