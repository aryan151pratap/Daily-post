import { use, useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaSearch } from "react-icons/fa";
import user from '../../images/image.png';

const Message = function(){
	const [search, setSearch] = useState("");
	const [show, setShow] = useState(false);
	const [data, setData] = useState([{
		name: "Aryan Pratap",
	},
	{name : "Adesh"},
	{name: "Ishu"},
	{name: "Gourav"},
	{name: "Priyanshu"}
	])

	const [filter, setFilter] = useState(null);

	useEffect(() => {
		const handleSearch = function(){
			if(!search.trim()) return setFilter(data);
			const filter_data = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
			setFilter(filter_data);
		}

		handleSearch();
	}, [search])

	return(
		<div className="p-4 max-w-xs h-full">
			<div className="w-full h-full bg-white border border-zinc-200 rounded-md">
				<div className="mt-2 px-2 flex justify-between items-center borde border-zinc-200">
					<p className="text-sm font-semibold">Messages ...</p>
					<button
						className="rounded-full p-1 cursor-pointer"
						onClick={() => setShow(!show)}
					>
						{show ? 
						<div>
							{/* <FaArrowDown className="text-zinc-500 text-sm"/> */}
							<p className="text-sm text-blue-500 hover:underline">show less</p>
						</div> 
						:
						<div>
							{/* <FaArrowUp className="text-zinc-500 text-sm"/> */}
							<p className="text-sm text-blue-500 hover:underline">show more</p>
						</div>						
						}
					</button>
				</div>
				{show &&
				<div className="py-2 flex text-sm flex-row gap-1 p-1 items-center justidy-center border-b border-zinc-200">
					<div className="w-full flex flex-row border-2 border-zinc-200 focus-within:border-black rounded-md">
						<input type="text" placeholder="search ..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full outline-none py-1 px-2"/>
						<button className="p-2 bg-black text-white hover:opacity-50 rounded-r cursor-pointer">
							<FaSearch/>
						</button>
					</div>
				</div>
				}
				{show &&
				<div className="">
					{filter?.map((i, index) => (
						<div key={index} className="p-2 flex flex-row gap-2 items-center text-sm hover:bg-zinc-100 transition duration-200 cursor-pointer border-b border-zinc-200">
							<div className="shrink-0 flex">
								<img src={user ? user : null} alt="" className='w-10 h-10 objet-cover rounded-full'/>
							</div>
							<div className="text-sm">
								<p className="font-serif">{i?.name}</p>
								<p className="italic opacity-50 line-clamp-1 text-xs">Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, voluptates.</p>
							</div>
						</div>
					))}
				</div>
				}
			</div>
		</div>
	)
}

export default Message;