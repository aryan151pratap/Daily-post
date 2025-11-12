import { FaComment, FaPaperPlane, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import user from '../images/image.png';
import image from '../images/image2.png';

import { useState } from 'react';
import CommentBox from './home_component/comment';
import Frames from './home_component/frames';
const Home = function({data, setData}){

	const [details, setDetails] = useState({like:true, unlike:false, comment: "hello everyone you projectg is nice \nNice! \nGood work do well 🤐"});
	const [comment, setComment] = useState(false);

	const handleDetailes = function(value){
		if(value == "like"){
			if(details[value]){
				setDetails({...details, like: false});
			}else{
				setDetails({...details, like: true, unlike: false});
			}
		} 
		else{
			if(details[value]){
				setDetails({...details, unlike: false});
			} else{
				setDetails({...details, unlike: true, like: false});
			}
		}
	}
	return(
		<div className="md:ml-auto py-4 ml-4 h-fit flex justify-center">
			<div className="md:w-xl sm:w-100 w-full bg-white border border-zinc-200 rounded-md shadow-md flex flex-col overflow-hidden">
				<div className="p-3">
					<div className="w-fit flex flex-row items-center gap-5 text-md cursor-pointer">
						<img src={user} alt="" className='w-10 h-10 objet-cover rounded-full'/>
						<p className="hover:underline">
							<p>{data?.username}</p>
							<p className='text-xs text-zinc-400'>{data?.bio}</p>
						</p>
					</div>
				</div>

				{/* <div className='w-full flex justify-center border-t border-zinc-200'>
					<img src={image} alt="" className=''/>
				</div> */}

				<div className='w-full h-full'>
					<Frames/>
				</div>

				<div className='p-2 w-full flex items-center justify-center w-full border-t border-zinc-200'>
					<div className='px-2 text-sm text-zinc-700 w-full flex flex-row justify-between'>
						
						<p className='flex gap-1 items-center cursor-pointer hover:bg-zinc-200 p-1 rounded-md'
							onClick={() => handleDetailes("like")}
						><FaThumbsUp className={`h-6 w-6 p-1 ${details.like ? "text-rose-500 bg-rose-300" : "text-zinc-400"} cursor-pointer rounded-sm`}	
						/>like</p>
						<p className='flex gap-1 items-center cursor-pointer hover:bg-zinc-200 p-1 rounded-md'
							onClick={() => handleDetailes("unlike")}
						><FaThumbsDown className={`h-6 w-6 p-1 ${details.unlike ? "text-green-500 bg-green-300" : "text-zinc-400"} cursor-pointer rounded-sm`}
						/>Unlike</p>
						<p className='flex gap-1 items-center cursor-pointer hover:bg-zinc-200 p-1 rounded-md'
							onClick={() => setComment(!comment)}
						><FaComment className={`h-6 w-6 p-1 ${comment ? "text-zinc-500 bg-zinc-300" : "text-zinc-400"} cursor-pointer rounded-sm`}
						/>comments</p>
						<p className='flex gap-1 items-center cursor-pointer hover:bg-zinc-200 p-1 rounded-md'><FaPaperPlane className='h-6 w-6 p-1 text-zinc-400 cursor-pointer'/>
							send
						</p>
					</div>
				</div>

				{comment &&
					<CommentBox details={data.comments} setDetails={setDetails}/>
				}
			</div>
		</div>
	)
}

export default Home;