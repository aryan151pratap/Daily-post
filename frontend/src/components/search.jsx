import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";

function Search() {
	const [search, setSearch] = useState("");
	const [show, setShow] = useState(false);

	const boxRef = useRef(null);

	// close on outside click
	useEffect(() => {
		function handleClickOutside(e) {
			if (boxRef.current && !boxRef.current.contains(e.target)) {
				setShow(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="md:w-xl w-full h-full p-2 sm:py-4 md:ml-0 sm:ml-4">
			<div className={`relative w-full h-full ${show && "bg-zinc"} bg-white rounded-md border border-zinc-200`}>

				<div className="p-3 text-sm w-full flex flex-row gap-2 border-b border-zinc-200">
					<input
						value={search}
						type="text"
						placeholder="search ..."
						className="w-full outline-none border-2 border-zinc-400 focus:border-black py-1 px-2 rounded"
						onChange={(e) => setSearch(e.target.value)}
						onClick={() => setShow(true)}
					/>

					<button className="bg-black p-2 rounded-md text-white hover:opacity-60 focus:bg-black/40 cursor-pointer">
						<FaSearch />
					</button>
				</div>

				{show && (
					<div ref={boxRef} className="w-fit h-full absolute inset-0 top-10 p-2 w-full rounded-md">
						<div className="p-2 flex flex-col gap-2 text-sm bg-white border border-zinc-300 w-full rounded-md shadow-lg">
							<p>Recent search 1</p>
							<p>Recent search 2</p>
							<p>Recent search 3</p>
						</div>
					</div>
				)}

			</div>
		</div>
	);
}

export default Search;
