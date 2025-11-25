import { FaComment, FaPaperPlane, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import user from '../../images/image.png';
import image from '../../images/image2.png';
import { Link } from 'react-router-dom';


import { useEffect, useState } from 'react';
import CommentBox from './comment';
import Frames from './frames';
import FullFrame from './fullFrame';

const VITE_BACKEND = import.meta.env.VITE_BACKEND;

const Media = function({data, userData}){
	const storedEmail = localStorage.getItem("daily-post-email");
	const [details, setDetails] = useState({like:false, unlike:false, comment: []});
	const [comment, setComment] = useState(false);
	const [showMore, setShowMore] = useState(true);
	const [likes, setLikes] = useState(0);
	const [fullFrame, setfullFrame] = useState(false);

	const handleDetailes = function(value){
		if(value == "like"){
			if(details[value]){
				setDetails({...details, like: false});
				handleLikes("remove-like");
				setLikes((e) => e == 0 ? 0 : e-1);
			}else{
				setLikes((e) => e+1);
				setDetails({...details, like: true, unlike: false});
				handleLikes("like");
			}
		} 
		else{
			if(details[value]){
				setDetails({...details, unlike: false});
				handleLikes("remove-unlike");
			} else{
				setDetails({...details, unlike: true, like: false});
				handleLikes("unlike");
				setLikes((e) => e == 0 ? 0 : e-1);
			}
		}
	}

	useEffect(() => {
		if(!storedEmail) return;
		if (Array.isArray(data.like)) {
			const userLiked = data.like.some(user => user.email === storedEmail);
			setLikes(data.like.length);

			setDetails(prev => ({...prev, like: userLiked}));
		}
		if(data?.unlike?.length > 0){
			const userLiked = data?.unlike.some(
				(user) => user.email === storedEmail
			);
			setDetails(prev => ({...prev, unlike: userLiked}));
		}
	}, [data])

	const handleLikes = async function(action){
		if(!storedEmail) return;
		const newData = {
			email: storedEmail,
			action
		}
		const res = await fetch(`${VITE_BACKEND}/react/${data?._id}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newData)
		});
		const result = await res.json();
		console.log(result);
		if(res.ok){

		}
	}

	useEffect(() => {
		const getComment = async function(){
			if(comment){
				try{
					const res = await fetch(`${VITE_BACKEND}/getComment/${data?._id}`, {
						method: "GET",
					});
					const result = await res.json();
					if(res.ok){
						if (Array.isArray(result?.post?.comments)) {
							setDetails(prev => ({
							...prev,
							comment: result?.post?.comments
							}));
						}	
					}
				} catch (err){
					console.log(err);
				}
			}
		}
		getComment();
	}, [comment])

	const handleComment = async function(){
		setComment((e) => !e);
	}

	return(
		<div className="w-full h-fit flex justify-center">
			<div className="lg:w-xl sm:w-100 w-full bg-white border border-zinc-200 sm:rounded-md shadow-md flex flex-col overflow-hidden">
				<div className="p-3">
					<Link to={`/user/${data?.userId?._id}`}>
					<div className="w-fit flex flex-row items-center gap-5 text-md cursor-pointer">
						<div className='shrink-0 w-10 h-10'>
							<img src={data?.userId?.image ? data?.userId?.image : user} alt="" className='w-full h-full object-cover rounded-full'/>
						</div>
						<div className="hover:underline">
							<p>{data?.userId?.username}</p>
							<p className='text-xs text-zinc-400 line-clamp-1'>{data?.userId?.bio}</p>
						</div>
					</div>
					</Link>
				</div>

				{/* <div className='w-full flex justify-center border-t border-zinc-200'>
					<img src={image} alt="" className=''/>
				</div> */}

				<div className={`p-2 border-t border-zinc-100 ${showMore && "max-h-50 overflow-hidden"}`}>
					<pre className="font-sans text-sm text-wrap p-2" dangerouslySetInnerHTML={{ __html: data?.caption }} />
				</div>

				<button className='w-fit h-fit px-4 text-sm text-zinc-500 hover:underline mb-1 cursor-pointer hover:text-blue-500'
					onClick={() => setShowMore(!showMore)}
				>
					...{showMore ? "more" : "less"}
				</button>

				<div className=''>
					<Frames setfullFrame={setfullFrame} image={data?.imageUrl ? data?.imageUrl : []}/>
				</div>

				<div className='flex gap-2 items-center justify-between text-zinc-600'>
					{likes > 0 &&
					<div className='p-1 px-2 flex gap-2 items-center'>
						<FaThumbsUp className='h-5 w-5 rounded text-rose-500 bg-rose-200 p-1'/>
						<p className='text-sm'>{likes}</p>
					</div>
					}
					{data?.comments.length > 0 &&
					<div className='p-1 px-2 flex gap-2 text-sm items-center'>
						<p>{data?.comments.length}</p>
						<p className=''>comments</p>
					</div>
					}
				</div>

				<div className='p-2 w-full flex items-center justify-center w-full border-t border-zinc-200'>
					<div className='px-2 text-sm text-zinc-700 w-full flex flex-row justify-between'>
						
						<p className={`flex gap-1 items-center cursor-pointer ${details.like ? "bg-rose-200 text-rose-600" : "hover:bg-zinc-200"} p-1 rounded-md`}
							onClick={() => handleDetailes("like")}
						><FaThumbsUp className={`h-6 w-6 p-1 ${details.like ? "text-rose-500 bg-rose-300" : "text-zinc-400"} cursor-pointer rounded-sm`}	
						/>like</p>
						
						<p className={`flex gap-1 items-center cursor-pointer ${details.unlike ? "bg-green-200 text-green-600" : "hover:bg-zinc-200"} p-1 rounded-md`}
							onClick={() => handleDetailes("unlike")}
						><FaThumbsDown className={`h-6 w-6 p-1 ${details.unlike ? "text-green-500 bg-green-300" : "text-zinc-400"} cursor-pointer rounded-sm`}
						/>Unlike</p>

						<p className={`flex gap-1 items-center cursor-pointer ${comment ? "bg-zinc-200" : "hover:bg-zinc-200"} p-1 rounded-md`}
							onClick={() => handleComment()}
						><FaComment className={`h-6 w-6 p-1 ${comment ? "text-zinc-500 bg-zinc-300" : "text-zinc-400"} cursor-pointer rounded-sm`}
						/>comments</p>

						<p className='flex gap-1 items-center cursor-pointer hover:bg-zinc-200 p-1 rounded-md'><FaPaperPlane className='h-6 w-6 p-1 text-zinc-400 cursor-pointer'/>
							send
						</p>
					</div>
				</div>

				{comment &&
					<CommentBox details={details} id={data._id} userData={userData} setDetails={setDetails}/>
				}

				{fullFrame &&
					<FullFrame data={data} setfullFrame={setfullFrame} likes={likes}/>
				}
			</div>
		</div>
	)
}

export default Media;