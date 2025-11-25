import { FaArrowLeft, FaArrowRight, FaEdit, FaUser } from "react-icons/fa";
import user from "../images/image.png";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditProfile from "./userEdit";
import Media from "./home_component/media";
import Post from "./post";

const VITE_BACKEND = import.meta.env.VITE_BACKEND;

const User = function({setLoading, userData, setSelect}){
	const {id} = useParams();
	const [data, setData] = useState(null);
	const [post, setPost] = useState(null);
	const [edit, setEdit] = useState(false);
	const [currentPost, setCurrentPost] = useState(0);
	const [postCount, setPostCount] = useState(0);
	const [AddPost, setAddPost] = useState(false);
	const [counter, setCounter] = useState(0);
	const [loadPost, setLoadPost] = useState(0);


	useEffect(() => {
		const getUser = async () =>{
			setLoading(true);
			const res = await fetch(`${VITE_BACKEND}/user/${id}`, {
				method: "GET"
			});
			const result = await res.json();
			if(res.ok){
				setData(result.user);
				setPost(result.post);
				setPostCount(result.count);
			}
			setLoading(false);
		}
		getUser();
		if(id == userData?._id) setSelect({ name: "user", icon: <FaUser/>})
	}, [id, counter])


	const getPost = async function(){
		if(currentPost < loadPost) {
			setCurrentPost((e) => e+1%postCount);
			return;
		};
		const res = await fetch(`${VITE_BACKEND}/postByIndex/${id}/${currentPost+1}`, {
			method: "GET"
		});
		const result = await res.json();
		if(res.ok){
			setLoadPost(e => e+1);
			setPost([...post, ...result.post]);
			setPostCount(result.count);
			setCurrentPost((e) => e+1%postCount);
		}
	}
	return(
		<div className="lg:w-xl w-full sm:p-4 h-full">
			<div className="min-h-40 bg-white border border-zinc-200 sm:rounded-md shadow-sm">
				<div className={`h-20 relative ${data?.bgColor}/40 flex flex-col justify-end sm:rounded-t-md`}>
					<div className={`absolute w-full h-15 ${data?.bgColor}/30`}></div>
					<div className={`absolute w-full h-10 ${data?.bgColor}/50`}></div>
					<div className={`absolute w-full h-5 ${data?.bgColor}`}></div>
					<div className="absolute inset-0 top-12 left-8 border-4 border-white w-25 h-25 rounded-full overflow-hidden">
						<img src={data?.image ? data?.image : user} alt="" className="w-full h-full object-cover"/>
					</div>
				</div>
				<div className="h-18 w-full flex justify-end p-2">
					{userData?._id == id && <FaEdit className="" onClick={() => setEdit(!edit)}/>}
				</div>
				<div className="px-4 w-full flex flex-col justify-end p-2">
					<p className="text-lg font-semibold flex gap-2 items-center">{data?.username}<span className="text-sm text-zinc-700 font-normal">{data?.email}</span></p>
					<p className="text-sm p-1">{data?.bio}</p>
					<div className="ml-auto mt-2 flex flex-row gap-2">
						<p className={`flex gap-2 text-sm px-2 p-1 rounded-md w-fit ${data?.bgColor}/40 text-${data?.bgColor.split("-")[1]}-700`}>
							<span className="font-semibold">Total {postCount > 1 ? "Posts" : "Post"} - </span>
							<span className="font-bold">{postCount}</span>
						</p>
						<div className={`${userData?._id != id  &&  "hidden"} bg-rose-600 px-2 p-1 text-sm font-semibold text-rose-100 rounded-md cursor-pointer`}
							onClick={() => setAddPost(true)}
						>
							Post +
						</div>
					</div>
				</div>
				
				<div className="flex flex-col overflow-hidden">
					{postCount > 0 &&
					<div className={`p-1 px-4 bg-white text-zinc-700 flex items-center justify-between sm:rounded-md border-t border-zinc-200`}>
						<p className="text-sm font-semibold">Post No. - {currentPost+1}</p>
						<p className="text-sm font-semibold">Load Post - {loadPost+1}</p>
						<div className="flex flex-row gap-4 items-center justify-center">
							<button
								className={`px-2 p-1 ${currentPost == 0 ? "bg-zinc-200 text-zinc-500 rounded-md cursor-not-allowed" : "cursor-pointer hover:text-zinc-800"}`}
								disabled={currentPost == 0}
								onClick={() => setCurrentPost((e) => e == 0 ? e : e-1)}
							>
								<FaArrowLeft className="hover:text-zinc-800"/>	
							</button>
							<button
								className={`px-2 p-1 ${currentPost == postCount-1 ? "bg-zinc-200 text-zinc-500 rounded-md cursor-not-allowed" : "cursor-pointer hover:text-zinc-800"}`}
								disabled={currentPost == postCount-1}
								onClick={() => getPost()}
							>
								<FaArrowRight className=""/>
							</button>
						</div>
					</div>
					}

					{postCount > 0 && currentPost <= post?.length-1 ?
						<Media data={{...post[currentPost], userId: data}} userData={userData}/>
						:
						<div className="h-50 w-full flex gap-2 items-center justify-center">
							<div className="p-4 border-2 rounded-full border-t-transparent border-b-transparent animate-spin"></div>
							<p className="font-semibold">loading...</p>
						</div>
					}
				</div>
			</div>

			{edit && 
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
					<EditProfile data={data} setData={setData} setEdit={setEdit}/>
				</div>
			}

			{AddPost && userData?._id == id && 
				<Post setShowPost={setAddPost} setCounter={setCounter} userData={userData}/>
			}
		</div>
	)
}

export default User;