import { useEffect, useState, useRef } from "react";
import Post from "./post.jsx";
import Media from "./home_component/media.jsx";

const VITE_BACKEND = import.meta.env.VITE_BACKEND;

const Home = function ({ setLoading, userData }) {
	const [data, setData] = useState([]);
	const [post, setPost] = useState(false);
	const [skip, setSkip] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [postLoading, setPostLoading] = useState(false);

	const observerRef = useRef(null);

	async function fetchPosts() {
		const email = localStorage.getItem("daily-post-email");
		if (!email || !hasMore) return;

		if(skip == 0) setLoading(true);
		else setPostLoading(true);

		const res = await fetch(`${VITE_BACKEND}/getPost/${email}?skip=${skip}&limit=3`);
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
	}, []);

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

	return (
		<div className="sm:w-fit w-full flex flex-col gap-4 sm:p-4 p-2">

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

			{data.map((postData, index) => (
				<div
					key={index}
					className={index === data.length - 1 ? "watch-item" : ""}
				>
					<Media data={postData} userData={userData} />
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
