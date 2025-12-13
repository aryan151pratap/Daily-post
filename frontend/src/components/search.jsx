import { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';

const VITE_BACKEND = import.meta.env.VITE_BACKEND;

function Search({ userData }) {
	const boxRef = useRef(null);
	const [search, setSearch] = useState("");
	const [show, setShow] = useState(false);
	const [userList, setUserList] = useState([]);
	const [filterUser, setFilterUser] = useState([]);
	const [recent, setRecent] = useState([]);
	const [message, setMessage] = useState(null);

	useEffect(() => {
		function handleClickOutside(e) {
			if (boxRef.current && !boxRef.current.contains(e.target)) {
				setShow(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const getUsers = async function(){
			const res = await fetch(`${VITE_BACKEND}/getRecent/${userData?._id}`, {
				method: "GET"
			});

			const result = await res.json();
			if(res.ok){
				setRecent(result.user.recent);
			}
		}
		getUsers();
	}, [])


	useEffect(() => {
		if(search.trim()){
			const filtered = userList?.filter((i) => i.username.toLowerCase().startsWith(search.toLowerCase()));
			if(filtered?.length > 0){
				setFilterUser(filtered);
			}else{
				handleRecent(search);
			}
		} else {
			setFilterUser(userList);
			setMessage(null);
		}
	}, [search])

	const handleRecent = async function(text){
		setMessage("Loading ...");
		const res = await fetch(`${VITE_BACKEND}/search/${text}`, {
			method: "GET",
		});
		const result = await res.json();
		if(res.ok){
			setUserList( prev => [...prev, ...result.user]);
			setFilterUser(result.user);
			setMessage(null);
		} else {
			setFilterUser([]);
			setMessage(result.message);
		}
	}

	const handleSaveRecent = async function(id){
		const res = await fetch(`${VITE_BACKEND}/recent/${userData?._id}/${id}`, {
			method: "GET",
		});
	}

	const handleDeleteRecent = async function(id){
		const res = await fetch(`${VITE_BACKEND}/deleteRecent/${userData?._id}/${id}`, {
			method: "GET",
		});
		if(res.ok){
			const recented = recent?.filter((i) => i?._id != id);
			setRecent(recented);
		}
	}

	return (
		<div className="md:w-xl sm:w-xs w-full h-full  p-2 sm:py-4 md:ml-0 sm:ml-4">
			<div className={`relative w-full h-full ${show && "bg-zinc"} bg-white rounded-md border border-zinc-200`}>

				<div className="p-3 text-sm w-full flex flex-row gap-2">
					<input
						value={search}
						type="text"
						placeholder="search ..."
						className="w-full outline-none py-1 px-2 rounded"
						onChange={(e) => setSearch(e.target.value)}
						onClick={() => setShow(true)}
					/>
				</div>

				{show && (
					<div ref={boxRef} className="w-fit h-[400px] absolute inset-0 top-10 p-2 w-full rounded-md overflow-auto">
						<div className="h-full flex flex-col text-sm bg-white border border-zinc-300 w-full rounded-md shadow-lg">
							<div className="overflow-auto rounded-md">
								<div className="sticky top-0 px-2 bg-white underline text-zinc-500 border-b border-zinc-200">
									<p>new</p>
								</div>
								<div className="bg-zinc-50">
								{filterUser?.map((i, index) => (
									<Link to={`/user/${i?._id}`} key={index} className="p-2 hover:bg-zinc-200 flex flex-row items-center gap-2 border-b border-zinc-100 cursor-pointer"
										onClick={() => handleSaveRecent(i?._id)}
									>
										<div className="shrink-0 w-10 h-10 rounded-md border border-zinc-200 overflow-hidden">
											<img src={i?.image} alt="" className="w-full h-full object-cover"/>
										</div>
										<div className="flex hover:underline flex-col">
											<p className="font-semibold text-zinc-800">{i?.username}</p>
											<p className="text-xs text-zinc-500 line-clamp-1">{i?.bio}</p>
										</div>
									</Link>
								))}
								
								</div>
								{message &&
								<div className="p-2 text-zinc-600 font-semibold">
									<p>{message}</p>
								</div>
								}
							</div>
							<div className="mt-auto">
								{recent.length > 0 &&
								<div className="px-2 underline text-zinc-500 border-t border-b border-zinc-100">
									<p>recent</p>
								</div>
								}
								<div className="overflow-auto max-h-[114px]">
									{recent?.map((i, index) => (
									<div key={index} className="p-2 hover:bg-zinc-200 flex flex-row items-center gap-2 border-b border-zinc-100 cursor-pointer">
										<Link to={`/user/${i?._id}`} className="flex flex-row items-center gap-2">
										<div className="shrink-0 w-10 h-10 rounded-md border border-zinc-200 overflow-hidden">
											<img src={i?.image} alt="" className="w-full h-full object-cover"/>
										</div>
										<div className="flex hover:underline flex-col">
											<p className="font-semibold text-zinc-800">{i?.username}</p>
											<p className="text-xs text-zinc-500 line-clamp-1">{i?.bio}</p>
										</div>
										</Link>
										<div className="ml-auto text-xs p-2 sm:text-zinc-400 text-zinc-600 sm:bg-zinc-200 bg-zinc-300 hover:text-zinc-600 hover:bg-zinc-300 rounded-md cursor-pointer"
											onClick={() => handleDeleteRecent(i?._id)}
										>
											<FaTimes/>
										</div>
									</div>
									))}
								</div>
							</div>
						</div>
					</div>
				)}

			</div>
		</div>
	);
}

export default Search;
