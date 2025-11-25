import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

function Profile({userData, setSelect}) {
	return(
		<div className="p-4 max-w-xs h-full">
			<div className="w-fit h-full bg-white border border-zinc-200 rounded-md">
				<div className="flex flex-col justify-between items-center border-b border-zinc-200">
					<div className={`w-full h-20 relative ${userData?.bgColor}/40 flex flex-col justify-end sm:rounded-t-md`}>
						<div className={`absolute w-full h-15 ${userData?.bgColor}/30`}></div>
						<div className={`absolute w-full h-10 ${userData?.bgColor}/50`}></div>
						<div className={`absolute w-full h-5 ${userData?.bgColor}`}></div>
						<div className="absolute inset-0 top-12 md:left-2  border-4 border-white w-20 h-20 rounded-full overflow-hidden">
							<img src={userData?.image} alt="" className="w-full h-full object-cover"/>
						</div>
					</div>
					<div className="h-12"></div>
					<div className="p-2 w-full flex flex-col gap-2">
						<Link to={`/user/${userData?._id}`}>
							<p className="hover:underline cursor-pointer" onClick={() => setSelect({name: "user", icon : <FaUser/>})}>{userData?.username}</p>
						</Link>
					</div>
					<div className="px-3 text-sm font-serif text-zinc-700 mb-2">
						<p>{userData?.bio}</p>
					</div>
				</div>
				
			</div>
		</div>
	)
}

export default Profile;