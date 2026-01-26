import { useEffect, useRef, useState } from "react";

const Notification = function({setNotify}){
	const boxRef = useRef(null);
const [notification, setNotification] = useState([
  {
    id: 1,
    type: "like",
    message: "Rahul liked your post",
    user: "Rahul",
    time: "2 min ago",
    read: false
  },
  {
    id: 2,
    type: "comment",
    message: "Anjali commented on your post",
    user: "Anjali",
    time: "10 min ago",
    read: false
  },
  {
    id: 3,
    type: "follow",
    message: "Suresh started following you",
    user: "Suresh",
    time: "1 hour ago",
    read: true
  },
  {
    id: 4,
    type: "mention",
    message: "You were mentioned in a comment",
    user: "Aman",
    time: "Yesterday",
    read: true
  }
]);
	useEffect(() => {
		function handleClickOutside(e) {
			if (boxRef.current && !boxRef.current.contains(e.target)) {
				setNotify(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return(
		<div ref={boxRef} className="fixed left-2 top-15 md:w-[20%] sm:w-[40%] w-[50%] rounded border border-zinc-200 bg-white z-30 shadow-md">
			<div className="flex flex-row text-sm p-2 border-b border-zinc-200 shadow-sm">
				<p className="">Notification</p>
				<div className="ml-auto flex flex-row font-mono bg-rose-200 rounded">
					<p className="bg-rose-600 text-white text-xs flex items-center rounded-l px-1">10</p>
					<p className="px-1 text-rose-700">100</p>
				</div>
			</div>

			{notification &&
			<div className="max-h-[200px] overflow-auto custom-scroll">
				{notification.map((n, index) => (
					<div key={n.id} className={`p-2 ${!n.read ? "font-semibold bg-rose-50" : ""} ${index < notification.length-1 && "border-b border-zinc-200/70"} text-sm`}>
						<p className={``}>
							{n.message}
						</p>
						<span className="text-xs text-zinc-500">{n.time}</span>
					</div>
				))}
			</div>
			}
		</div>
	)
}

export default Notification;