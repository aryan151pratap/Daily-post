import React from "react";
import { useState } from "react";
import {FaBell, FaHome, FaSearch, FaUser} from "react-icons/fa";
import user from '../images/image.png';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';


const Header = function({select, setSelect, userData}){
	const feature = [{name:"home", icon:<FaHome/>}, {name:"search", icon: <FaSearch/>}, {name:"user", icon: <FaUser/>}, {name:"notification", icon: <FaBell/>}];
	const [image, setImage] = useState(null);
	const [notify, setNotify] = useState(["connect"]);
	
	return(
		<div className="w-full flex flex-row bg-white shadow-md">
			<div className="p-4 flex items-center sm:gap-10 gap-6 ml-auto">
				{feature.map((i, index) => (
					<div key={index} className="cursor-pointer"
						onClick={() => setSelect(i)}
					>
						<Link to={`/${i?.name == "user" ? `${i?.name}/${userData._id}`: i?.name}/`}>
							<div className="relative">
								{i?.name == "notification" && notify.length > 0 &&
								<div className="absolute text-xs border border-white font-mono w-5 h-5 flex items-center justify-center bottom-2 left-2 bg-rose-500 hover:bg-rose-400 rounded-full">
									<p className="text-rose-100">10</p>
								</div>
								}
								{React.cloneElement(i.icon, { className: `${ i.name == select.name  ? "text-rose-500 hover:text-rose-700" : "text-zinc-500 hover:text-zinc-700"} text-xl transition`})}
							</div>
						</Link>
					</div>
				))}
			</div>
			<div className="sm:px-4 md:px-10 p-2 flex border-l border-zinc-200 ml-auto">
				<div className="flex flex-row text-sm gap-4 mr-auto ">
					<div className="w-10 h-10">
						<img src={userData?.image ? userData?.image : user} alt="" className='h-full w-full object-cover rounded-full'/>
					</div>
					<p className="shrink-0 py-2 font-semibold">{userData?.username}</p>
				</div>
			</div>
		</div>
	)
}

export default Header;