import { useEffect, useState, useRef } from "react";
import Post from "./post.jsx";
import Media from "./home_component/media.jsx";
import { FaSearch } from "react-icons/fa";

const VITE_BACKEND = import.meta.env.VITE_BACKEND;

const Home = function ({ setLoading, userData }) {
	const [data, setData] = useState([]);
	const [post, setPost] = useState(false);
	const [skip, setSkip] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [postLoading, setPostLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [searchTrigger, setSearchTrigger] = useState(0);


	const observerRef = useRef(null);

	async function fetchPosts() {
		const email = localStorage.getItem("daily-post-email");
		console.log(hasMore);
		if (!email || !hasMore) return;
		if(skip == 0) setLoading(true);
		else setPostLoading(true);

		// console.log(search);
		const res = await fetch(`${VITE_BACKEND}/getPost/${email}/?skip=${skip}&limit=3&search=${search}`);
		const result = await res.json();
		console.log(result);
		if (result.post?.length > 0) {
			setData((prev) => [...prev, ...result.post]);
			setSkip((prev) => prev + 3);
			setHasMore(result.hasMore);
		} else {
			setHasMore(false);
		}

		setLoading(false);
		setPostLoading(false);
	}

	useEffect(() => {
		fetchPosts();
	}, [searchTrigger]);

	useEffect(() => {
		if (observerRef.current) observerRef.current.disconnect();
			observerRef.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasMore) {
				console.log(hasMore);
				fetchPosts(); 
			}
		});

		const secondLast = document.querySelector(".watch-item");
		if (secondLast) observerRef.current.observe(secondLast);

	}, [data]);

	const handleSearch = function(){
		setData([]);
		setSkip(0);
		setHasMore(true);
		setSearchTrigger(prev => prev + 1);
	}

	return (
		<div className="sm:w-fit w-full flex flex-col gap-2 sm:p-4 p-2">

			{post && (
				<Post setShowPost={setPost} setCounter={() => {}} userData={userData} />
			)}

			<div className="w-full shadow-sm flex flex-row gap-2 justify-between items-center p-1 px-2 bg-white rounded-md border border-zinc-200">
				<p className="text-sm font-serif ">Add Post</p>
				<button
					className="py-1 px-2 bg-rose-600 font-semibold border text-sm text-rose-50 hover:bg-rose-700 focus:bg-rose-500 rounded-md cursor-pointer"
					onClick={() => setPost(true)}
				>
					Post
				</button>
			</div>

			<div className="mb-2 flex flex-row items-center px-2 bg-white rounded border border-zinc-200 shadow">
				<input type="text" value={search} onChange={(e) => setSearch(e.target.value)}className="w-full outline-none p-2" placeholder="Enter title to search the post ..."/>
				<button className="text-sm p-2 text-white rounded bg-rose-500 cursor-pointer hover:bg-rose-600"
					onClick={handleSearch}
				>
					<FaSearch/>
				</button>
			</div>

			{data.map((postData, index) => (
				<div
					key={index}
					className={index === data.length - 1 ? "watch-item" : ""}
				>
					<Media postData={postData} userData={userData} />
				</div>
			))}
			{postLoading &&
				<div className="p-2 h-20 border border-zinc-200 rounded-md bg-white shadow-sm flex flex-row gap-4 items-center justify-center">
					<div className="p-4 border-3 rounded-full border-t-transparent animate-spin"></div>
					<p className="font-semibold">Loading ...</p>
				</div>
			}

		</div>
	);
};

export default Home;
