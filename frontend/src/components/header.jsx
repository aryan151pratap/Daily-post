import React from "react";
import { useState } from "react";
import {FaBell, FaHome, FaSearch, FaUser} from "react-icons/fa";
import user from '../images/image.png';


const Header = function({select, setSelect}){
	const feature = [{name:"home", icon:<FaHome/>}, {name:"search", icon: <FaSearch/>}, {name:"user", icon: <FaUser/>}, {name:"Notification", icon: <FaBell/>}];
	const [image, setImage] = useState(null);
	
	return(
		<div className="w-full flex flex-row bg-white shadow-md">
			<div className="p-4 flex items-center gap-10 ml-auto">
				{feature.map((i, index) => (
					<div key={index} className="cursor-pointer"
						onClick={() => setSelect(i)}
					>
						{React.cloneElement(i.icon, { className: `${ i.name == select.name  ? "text-rose-500 hover:text-rose-700" : "text-zinc-500 hover:text-zinc-700"} text-xl transition`})}
					</div>
				))}
			</div>
			<div className="sm:px-4 md:px-10 p-2 flex border-l border-zinc-200 ml-auto">
				<div className="flex flex-row text-sm gap-4 mr-auto ">
					<img src={image ? image : user} alt="" className='w-10 h-10 objet-cover rounded-full'/>
					<p className="py-2 font-semibold">Aryan Pratap</p>
				</div>
			</div>
		</div>
	)
}

export default Header;