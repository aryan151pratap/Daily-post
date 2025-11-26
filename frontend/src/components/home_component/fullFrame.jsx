import { Link } from "react-router-dom";
import Frames from "./frames";
import { FaThumbsUp, FaTimes } from "react-icons/fa";
import Media from "./media";

const FullFrame = function({data, setfullFrame, likes}){
	return(
		<div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] p-2 flex items-center justify-center">
			<div className="relative h-[700px] p-2 bg-white flex flex-col rounded-md overflow-auto">
				<div className="p-2">
					<Link to={`/user/${data?.userId?._id}`}>
					<div className="w-fit flex flex-row items-center gap-5 text-md cursor-pointer">
						<div className='shrink-0 w-12 h-12'>
							<img src={data?.userId?.image ? data?.userId?.image : user} alt="" className='w-full h-full object-cover rounded-full'/>
						</div>
						<div className="hover:underline">
							<p>{data?.userId?.username}</p>
							<p className='max-w-60 text-xs text-zinc-400 line-clamp-1'>{data?.userId?.bio}</p>
						</div>
					</div>
					</Link>
				</div>
				<div className="absolute w-fit h-fit inset-0 z-50 left-auto p-2">
					<FaTimes className="h-5 w-5 p-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-600 hover:text-zinc-800 cursor-pointer"
						onClick={() => setfullFrame(false)}
					/>
				</div>
				<div className="w-full h-full flex items-center overflow-auto mt-auto">
					<Media data={data} />
				</div>
			</div>
		</div>
	)
}
export default FullFrame;