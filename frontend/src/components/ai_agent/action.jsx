import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const VITE_BACKEND = import.meta.env.VITE_BACKEND;

const Action = function({actions, userData, setActionDetails, selectPost, setSelectPost}){
	const navigate = useNavigate();
	const [post, setPost] = useState([]);
	const [message, setMessage] = useState("");
	const [select, setSelect] = useState("");

	useEffect(() => {
		const apply = function(){
			try{
				if(actions.action == "deletePost") {
					navigate(`/user/${userData._id}`);
					setActionDetails(null);
				} else if(actions.action == "userPost" || actions.action == "getPosts"){
					console.log(actions);
					setPost(actions.post);
				} else if(actions.action == "savePost"){
					navigate(`/user/${userData._id}`);
					setActionDetails(null);
				} else if(actions.action == "selectPost"){
					navigate(`/user/${userData._id}`);
					setActionDetails(null);
				} else if(actions.action == "editPost"){
					navigate(`/user/${userData._id}`);
					setActionDetails(null);
				}
			} catch(err){
				console.log(err);
				setMessage(err.message);
				// setActionDetails(null);
			}
		}
		console.log(actions.action);
		apply();
	}, [])

	useEffect(() => {
		const getPost = async function(){
			const res = await fetch(`${VITE_BACKEND}/getPostById/${select}`);
			const result = await res.json();
			console.log(result);
			if (res.ok) {
				setSelectPost(result);
			} else {
				setHasMore(false);
			}
		}
		getPost();
	}, [select])

	return(
		<div className="px-2">
			{post.length > 0 ?
			<div className="bg-white border border-zinc-300 p-1 rounded shadow-md hover:shadow-lg">
				<div className="p-2 bg-white flex flex-row justify-between">
					<p className="font-bold">Posts Title</p>
					<p className="mt-auto text-xs font-semibold">Total Posts - {post.length}</p>
				</div>
				<div className="max-h-60 custom-scroll overflow-auto text-xs">
					{actions.action == "getPosts" ?
					<div className="flex flex-col gap-1">
						{post.map((i, index) => (
						<Link to={`/user/${i?.userId?._id || userData?._id}`} key={index} 
							className="flex flex-col gap-1 hover:shadow-lg hover:bg-rose-300 hover:border-rose-400 duration-300 px-2 p-1 bg-rose-100 text-rose-800 rounded border border-rose-300"
						>
							<p className="hover:underline font-semibold">{i?.title}</p>
							<div className="text-[10px] flex flex-row gap-2 justify-between">
								<p className="">{i?.userId?.username}</p>
								<p className="text-zinc-600">{new Date(i.createdAt).toLocaleString()}</p>
							</div>
						</Link>
						))}
					</div>
					: actions.action == "userPost"?
					<div className="flex flex-col gap-1">
						{post.map((i, index) => (
						<div key={index} 
							className="flex flex-col gap-1 hover:shadow-lg hover:bg-rose-300 hover:border-rose-400 duration-300 px-2 p-1 bg-rose-100 text-rose-800 rounded border border-rose-300"
						>
							<p className="hover:underline font-semibold">{i?.title}</p>
							<div className="text-[10px] flex flex-row gap-2 justify-between">
								<input
									type="checkbox"
									onChange={() => {
										if(select === i._id){
											setSelect("");
											setSelectPost("");
										} else {
											setSelect(i._id);
										}
									}}									
									checked={select === i._id}
									className="accent-rose-600 cursor-pointer"
								/>
								<p className="text-zinc-600">{new Date(i.createdAt).toLocaleString()}</p>
							</div>
						</div>
						))}
						<div className="p-1 bg-zinc-100 rounded border border-zinc-300">
							<p className="font-semibold text-red-500">Note</p>
							<p className="">Select the <span className="font-semibold">"checkbox"</span> to edit or delet the post.</p>
						</div>
					</div>	
					:
					<div></div>
					}
					<div>
						{selectPost && 
						<div className="p-1">
							<div className="font-semibold">
								<p>Selected post</p>
							</div>
							<div className="p-2">
								<p>PostId - {selectPost?._id}</p>
								<p>Title - {selectPost?.title}</p>
								<p>Content - {selectPost?.caption || "no content..."}</p>
							</div>
						</div>
						}
					</div>
				</div>
			</div>
			:
			<div className="text-xs px-2 bg-white border border-zinc-200 rounded p-1 shadow"><span className="font-semibold">Note</span> - No posts found ...</div>
			}
			<div>
				{message && 
				<div>{message}</div>
				}
			</div>
		</div>
	)
}

export default Action;