import React, { useState } from "react";
import { FaComment, FaPaperPlane, FaThumbsUp, FaTrash } from "react-icons/fa";
import user from '../../images/image.png';
import EmojiPicker from "emoji-picker-react";

const VITE_BACKEND = import.meta.env.VITE_BACKEND;

function CommentBox({details, setDetails, id, userData}) {
	const [comment, setComment] = useState("");
	const [showPicker, setShowPicker] = useState(false);

	const handleEmojiClick = (emojiData) => {
		setComment((prev) => prev + emojiData.emoji);
	};

	const handleSend = async function(){
		if(!comment.trim()) return 0;
		const data = {email: userData.email ,comment};

		const res = await fetch(`${VITE_BACKEND}/comment/${id}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});

		const result = await res.json();
		if(res.ok){
			console.log(result);
			setComment("");
		}
		setDetails(prev => ({
			...prev,
			comment: [...prev.comment, {user: userData, comment}]
		}));
	}

	const handleDelete = async function(commentId){
		try{
			const res = await fetch(`${VITE_BACKEND}/deleteComment/${id}/${commentId}`, {
				method: "GET"
			});
			if(res.ok){
				const comments = details.comment.filter((i) => i._id !== commentId);
				setDetails(prev => ({
					...prev,
					comment: comments
				}));
			}
		} catch(err){
			console.log(err);
		}
	}


	return (
		<div className='px-4 py-2 w-full flex flex-col border-t border-zinc-200'>
			<p className='mt-2 mb-2 text-sm flex items-top gap-1 px-1'>Comments 
				<FaComment className='text-zinc-500'/>
			</p>

			<div className='relative w-full min-h-10 outline-none border-1 border-rose-400 rounded-md p-1 px-2 text-rose-600 text-sm ml-auto'>
				<textarea type="text" value={comment} placeholder="write comment here ..." 
					onChange={(e) => setComment(e.target.value)}
					className='bg-rose-50 rounded-md h-10 min-h-10 max-h-50 p-2 w-full outline-none'
				/>
				<div className="flex items-center gap-2">
					<button
						onClick={() => setShowPicker((prev) => !prev)}
						className={`p-1 ${showPicker ? "bg-rose-200" : "bg-rose-100"} rounded-md text-lg cursor-pointer`}
					>
					😀
					</button>

					<button
						onClick={() => handleSend()}
						className="p-2.5 bg-green-100 text-green-500 rounded cursor-pointer hover:bg-green-200 focus:bg-green-300"
					>
					<FaPaperPlane/>
					</button>
				</div>
				{showPicker && (
					<div className="mb-1 mt-2">
						<EmojiPicker onEmojiClick={handleEmojiClick} />
					</div>
				)}
			</div>

			<div className='py-2 flex flex-col gap-5'>
				{details?.comment?.map((i, index) => (
					<div key={index} className='flex flex-col gap-2 justify-center'>
						<div className="w-fit flex flex-row gap-3 items-center cursor-pointer">
							<img src={user} alt="" className='border border-zinc-400 w-8 h-8 objet-cover rounded-full'/>
							<div className="hover:underline">
								<p className="text-sm text-zinc-800 font-semibold">{i?.user?.username}</p>
								<p className="text-xs text-zinc-500">{i?.user?.email}</p>
							</div>
						</div>
						<div className="group ml-10 text-zinc-800 flex flex-row items-center justify-between bg-rose-50 hover:bg-rose-200/50 rounded-md transition duration-300">
							<pre className="px-2 text-sm font-sans whitespace-pre-wrap">{i?.comment}</pre>
							{i?.user?._id == userData?._id ?
							<div className="mt-auto p-2 sm:opacity-0 group-hover:opacity-100 hover:bg-rose-400/40 rounded-r-md text-rose-700 transition duration-100 cursor-pointer text-sm"
								onClick={() => handleDelete(i?._id)}
							>
								<FaTrash className=""/>
							</div>
							:
							<div className="p-2 opacity-0">
								<FaThumbsUp/>
							</div>
							}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default CommentBox;
