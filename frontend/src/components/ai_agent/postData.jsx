import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import Post from "../post";
import { useEffect } from "react";

const PostData = function({data, disabled, userData}){
	const [showEdit, setShowEdit] = useState(false);
	const [postData, setPostData] = useState(null);
	console.log(data);

	useEffect(() => {
		const edit = function(){
			if(data.post){
				let content = data.post.content + "\n\n";
				data.post.tags.map((i) => content += `#${i} `)
				content+"\n";
				const result = {
					title: data.post.title,
					content,
				}
				setPostData(result);
			}
		}
		edit();
	}, [])

	return(
		<div>
			{data?.post?.title &&
			<div className="p-1 bg-white rounded border border-zinc-300">
				<div className="w-full flex flex-row items-center border-b border-zinc-100 gap-2 p-1">
					<img src={userData?.image} alt="" className='h-10 w-10 object-cover rounded-full'/>
					<Link to={`/user/${userData?._id}`}>
					<div className="flex flex-col hover:underline cursor-pointer">
						<p className="text-md font-semibold">{userData?.username}</p>
						<p className="sm:w-[70%] w-[80%] text-[11px] text-zinc-600 line-clamp-1">{userData?.bio}</p>
					</div>
					</Link>
				</div>
				<div className="p-2 flex flex-col">
					<b className="mb-2">{data?.post.title}</b>
					<p>{data?.post?.content}</p>
					<div className="mt-2 w-full flex flex-wrap">
						{data?.post.tags?.map((i, index) => (
							<div key={index} className="mr-1 text-rose-600">
								<p>#{i}</p>
							</div>
						))}
					</div>
				</div>
				<div className="p-2 flex flex-row gap-2 items-center justify-between text-white text-xs">
					<p className="text-xs text-zinc-700 font-semibold">{data?.post.date}</p>
					<button className="flex flex-row gap-2 items-center bg-rose-500 px-2 p-1 rounded cursor-pointer"
						onClick={() => setShowEdit(true)}
					>Edit Manually
						<FaEdit className="hover:text-rose-200"/>
					</button>
				</div>
				{showEdit &&
				<Post setShowPost={setShowEdit} userData={userData} postData={postData}/>
				}
			</div>
			}
		</div>
	)
}

export default PostData;