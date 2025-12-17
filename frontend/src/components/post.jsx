import { FaBold, FaCode, FaCut, FaImages, FaItalic, FaReadme, FaSmile, FaTimes, FaUnderline } from "react-icons/fa";
import user from '../images/image.png';
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import Frames from "./home_component/frames";
import { Link } from "react-router-dom";

const VITE_BACKEND = import.meta.env.VITE_BACKEND;

function Post({setShowPost, setCounter, userData, postData}){
	const fileRef = useRef(null);
	const [title, setTitle] = useState("");
	const [post, setPost] = useState('');
	const [preview, setPreview] = useState("");
	const [showPicker, setShowPicker] = useState(false);
	const [showPreview, setShowPreview] = useState(false);
	const [image, setImage] = useState([]);
	const [time, setTime] = useState(new Date());
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => {
		setTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		const edit = function(){
			if(!postData) return;
			if(postData?.title) setTitle(postData.title);
			if(postData?.content) setPost(postData.content);
		}
		edit();
	},[])

	const urlRegex = /(https?:\/\/[^\s"']+)/g;
	const boldRegex = /\*(.+?)\*/g;
	const italicRegex = /~i\s(.+?)\s~i/g;
	const strikeRegex = /~(.+?)~/g;
	const codeRegex = /`(.+?)`/g;
	const underlineRegex = /__(.+?)__/g;
	const hashtagRegex = /(^|\s)#([\p{L}\p{N}_]+)/gu;

	const formatText = (text) => {
		let formatted = text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");

		formatted = formatted.replace(codeRegex, (m, p1) => {
			return `<code class="bg-zinc-200 px-1 rounded text-sm">${p1}</code>`;
		});
		formatted = formatted.replace(boldRegex, (m, p1) => {
			return `<b class="font-bold">${p1}</b>`;
		});
		formatted = formatted.replace(italicRegex, (m, p1) => {
			return `<i class="italic">${p1}</i>`;
		});
		formatted = formatted.replace(underlineRegex, (m, p1) => {
			return `<span class="underline">${p1}</span>`;
		});
		formatted = formatted.replace(strikeRegex, (m, p1) => {
			return `<s class="line-through">${p1}</s>`;
		});
		formatted = formatted.replace(hashtagRegex, (match, space, tag) => {
			return `${space}<a href="/tag/${tag}" class="text-rose-600 font-semibold hover:underline">#${tag}</a>`;
		});
		formatted = formatted.replace(urlRegex, (url) => {
			return `<a href="${url}" target="_blank" class="text-blue-500 hover:underline">${url}</a>`;
		});

		return formatted;
	};

	useEffect(() => {
		const preview = function(){
			if(!post.trim()) {
				setPreview("");
				return;
			}
			console.log(post);
			const formatted = formatText(post);
			setPreview(formatted);
		}

		preview();
	}, [post])

	const handleEmojiClick = (emojiData) => {
		setPost((prev) => prev + emojiData.emoji);
		setShowPicker(false);
	};

	const fileToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	const handleImages = async (e) => {
		setImage([]);
		const files = Array.from(e.target.files);
		if (!files.length) return;

		const base64List = await Promise.all(
			files.map((file) => fileToBase64(file))
		);

		setImage((prev) => [...prev, ...base64List]);
	};

	const handlePost = async function(){
		setLoading(true);
		const storedEmail = localStorage.getItem("daily-post-email");
		if(!storedEmail) return;
		console.log(image);
		if(!image || !preview) return;
		const data = {
			title,
			post: preview,
			image
		}
		const res = await fetch(`${VITE_BACKEND}/savePost/${storedEmail}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});
		if(res.ok){
			setShowPost(false);
			setCounter((e) => e+1);
		}
		setLoading(false);
	}

	return(
		<div className="fixed inset-0 z-50 sm:p-4 p-2 bg-black/50 text-black backdrop-blur-xs w-full h-full flex items-center justify-center">
			<div className="md:w-4xl w-full h-[80%] flex flex-col bg-white rounded-md border border-zinc-200 p-2 overflow-hidden">
				<div className="w-full flex flex-row items-center gap-2 p-2 border-b border-zinc-200">
					<img src={userData?.image} alt="" className='sm:w-15 sm:h-15 h-10 w-10 object-cover rounded-full'/>
					<Link to={`/user/${userData?._id}`}>
					<div className="flex flex-col hover:underline cursor-pointer">
						<p className="sm:text-lg text-md font-semibold">{userData?.username}</p>
						<p className="sm:w-[70%] w-[80%] sm:text-sm text-xs text-zinc-600 line-clamp-1">{userData?.bio}</p>
					</div>
					</Link>
					<FaTimes className="shrink-0 h-6 w-6 p-1 text-sm text-rose-500 hover:bg-rose-200 rounded-md ml-auto cursor-pointer"
					 onClick={() => setShowPost(false)}
					/>
				</div>

				<div className={`w-full h-full grid sm:grid-cols-2 gap-2 p-2 overflow-auto`}>

					<div className="flex flex-col gap-1">
						<input type="text" value={title} className="text-rose-700 h-fit w-full bg-rose-50 text-sm px-2 p-1 outline-none border border-rose-200 focus:border-rose-400 rounded-md"
							placeholder="Title"
							onChange={(e) => setTitle(e.target.value)}
						/>
						<textarea name="" id="" 
						value={post}
						onChange={(e) => setPost(e.target.value)}
						placeholder="Post what you want ..."
						className={`${showPreview ? "sm:flex hidden" : ""} w-full h-full border border-rose-200 focus:border-rose-400 outline-none p-2 text-md text-rose-700 w-full rounded-md bg-rose-50`}>
						</textarea>
					</div>

					<div className={`${!showPreview ? "sm:flex hidden" : ""} h-full flex flex-col bg-white border border-zinc-200 rounded-md overflow-auto`}>
						<p className="sticky top-0 flex flex-row items-center gap-2 bg-white p-1 font-sans text-zinc-500 text-sm border-b border-zinc-200">
							<FaReadme className="text-rose-600 h-6 w-6 p-1 bg-rose-200 rounded"/>
							Review
						</p>

						{title &&
						<div className="p-2 font-semibold">
							<p className="w-fit p-1">{title}</p>
						</div>
						}
						{preview &&
						<div className="p-2">
							<pre className="font-sans text-sm text-wrap" dangerouslySetInnerHTML={{ __html: preview }} />
						</div>
						}

						{image?.length == 0 && 
							<div className="w-full h-full flex items-center justify-center">
								<p className="w-full min-h-40 flex items-center justify-center font-serif italic text-zinc-400">Add Images ... </p>
							</div>
						}

						<div className="mt-auto">
							{image?.length == 1 ?
							<div className="border-t border-b border-zinc-200 flex justify-center bg-zinc-200 items-center">
								<img src={image[0]} alt="" />
							</div>
							:
							<Frames image={image} imageCount={image.length}/>
							}
						</div>
						<div className="w-full flex flex-row justify-between gap-1 text-xs w-fit font-semibold">
							<p className="p-2 text-green-500 bg-green-100">Total character : {post.trim().length}</p>
							<p className="text-rose-500 bg-rose-100 p-2">time: {time.toLocaleString()}</p>
						</div>
					</div>

				</div>

				<div className="relative w-full flex flex-row gap-2 items-center p-2">
					<div className="text-lg text-zinc-600 flex flex-row items-center gap-5">
						<div className="sm:flex flex-row gap-5 grid grid-cols-4">
						<input ref={fileRef} type="file" 
						accept="image/*"
						className="hidden"
						multiple
						onChange={handleImages}
						/>
						<FaImages className="hover:text-zinc-700 cursor-pointer" onClick={() => fileRef.current.click()}/>

						<FaSmile onClick={() => setShowPicker(!showPicker)}/>
						{showPicker && (
							<div className="absolute bottom-10 mb-1 mt-2">
								<EmojiPicker onEmojiClick={handleEmojiClick} />
							</div>
						)}

						<FaItalic onClick={() => setPost(post+"~i italic ~i")} className="hover:text-zinc-800 cursor-pointer"/>
						<FaBold onClick={() => setPost(post+"*bold*")} className="hover:text-zinc-800 cursor-pointer"/>
						<FaUnderline onClick={() => setPost(post+" __underline__ ")} className="hover:text-zinc-800 cursor-pointer"/>
						<FaCut onClick={() => setPost(post+"~strike~")} className="hover:text-zinc-800 cursor-pointer"/>
						<FaCode onClick={() => setPost(post+"`code`")} className="hover:text-zinc-800 cursor-pointer"/>
						</div>

						<div className="sm:hidden flex sm:flex-row flex-col font-semibold gap-2 items-center text-sm">
							<button className={`p-1 px-2 ${showPreview ? "bg-zinc-200" : "hover:bg-rose-700 bg-rose-600 text-rose-200"} rounded cursor-pointer`}
								onClick={() => setShowPreview(false)}
							>
								Text box
							</button>
							<button className={`p-1 px-2 ${!showPreview ? "bg-zinc-200" : "hover:bg-rose-700 bg-rose-600 text-rose-200"} rounded cursor-pointer`}
								onClick={() => setShowPreview(true)}
							>
								Preview
							</button>
						</div>
					</div>
					<button className="mt-auto text-sm font-semibold bg-rose-600 p-1 px-2 rounded-md text-white ml-auto cursor-pointer focus:bg-rose-700 hover:bg-rose-800"
						onClick={() => handlePost()}
						>
						{!loading ?
						<p>Post</p>
						:
						<div className="p-2 border-3 rounded-full border-t-transparent animate-spin"></div>
						}
					</button>
				</div>
			</div>
		</div>
	)
}

export default Post;