import React, { useState } from "react";
import { FaHome, FaSearch, FaUser } from "react-icons/fa";
import user from "../images/image.png";
import { Link } from "react-router-dom";

const Header = ({ select, setSelect, userData }) => {
	const feature = [
		{ name: "home", icon: <FaHome /> },
		{ name: "search", icon: <FaSearch /> },
		{ name: "user", icon: <FaUser /> }
	];

	return (
		<div className="w-full flex flex-row bg-white shadow-md">
			<div className="p-4 flex items-center sm:gap-10 gap-6 ml-auto">
				{feature.map((i, index) => (
				<div
					key={index}
					className="cursor-pointer"
					onClick={() => setSelect(i)}
				>
					<Link
					to={`/${
						i.name === "user" ? `${i.name}/${userData._id}` : i.name
					}`}
					>
					{React.cloneElement(i.icon, {
						className: `${
						i.name === select.name
							? "text-rose-500 hover:text-rose-700"
							: "text-zinc-500 hover:text-zinc-700"
						} text-xl transition`
					})}
					</Link>
				</div>
				))}
			</div>

			<div className="sm:px-4 md:px-10 p-2 flex border-l border-zinc-200 ml-auto">
				<div className="flex flex-row text-sm gap-4 mr-auto">
					<div className="w-10 h-10">
						<img
						src={userData?.image ? userData.image : user}
						alt=""
						className="h-full w-full object-cover rounded-full"
						/>
					</div>
					<p className="shrink-0 py-2 font-semibold">
						{userData?.username}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Header;
