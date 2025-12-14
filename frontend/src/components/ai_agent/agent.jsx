import React, { useEffect, useRef, useState } from "react";
import Response from "./response";
import { FaArrowUp, FaSync } from "react-icons/fa";
import Action from "./action";
import PostData from "./postData";

const VITE_BACKEND = import.meta.env.VITE_BACKEND;

export default function Agent({userData}) {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const scrollRef = useRef(null);
	const [lastMsg, setLastMsg] = useState("");
	const [disabled, setDisabled] = useState(false);
	const [loading, setLoading] = useState(false);
	const [suggests, setSuggests] = useState([]);
	const [data, setData] = useState([{
		reply: "I am sleeping ...",
		post:{
			title: "Python programming language",
			content: "Python is a versatile, high‑level programming language known for its readability and simplicity. In this post, we'll explore the basics of Python syntax, data types, control structures, and how to write your first script. Whether you're a beginner or brushing up on fundamentals, these concepts will help you start building useful programs quickly.",
			tags: ["python", "programming"],
			date: "2025-5-12"
		}
	}]);
	const [actionDetails, setActionDetails] = useState(null);
	const [reload, setReload] = useState(0);
	const [selectPost, setSelectPost] = useState("");


	useEffect(() => {
		const getBot = async function(){
			try{
				console.log("reload ....");
				setLoading(true);
				setMessages([]);
				setSuggests([]);
				setActionDetails(null);
				setDisabled(false);
				const data = {
					name: userData.username,
					email: userData.email
				}
				const res = await fetch(`${VITE_BACKEND}/agent/getAgent/${userData._id}`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data)
				});
				const result = await res.json();
				if(res.ok){
					setSuggests(result.suggests);
					setMessages([{id: Date.now(), role: "bot", text: result.reply}]);
				} else {
					// setReload(e => e+1);
				}
			} catch(err){
				console.log(err);
				setMessages([{id: Date.now(), role: "bot", text: "I am sleeping ..."}]);
			} finally {
				setLoading(false);
			}
		}
		getBot();
	}, [reload])


	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({
				top: scrollRef.current.scrollHeight,
				behavior: "smooth"
			});		
		}
	}, [messages, actionDetails, data]);

	useEffect(() => {
		if (!lastMsg?.trim()){
			setDisabled(false);
			return;
		}

		let index = 0;
		const words = lastMsg.split(" ");
		
		setMessages((prev) => [...prev, { id: Date.now(), role: "bot", text: "" }]);

		const interval = setInterval(() => {
			setMessages((prev) => {
				const updated = [...prev];
				const lastIndex = updated.length - 1;
				updated[lastIndex].text += (updated[lastIndex].text ? " " : "") + words[index-1];
				return updated;
			});
			index++;
			if (index >= words.length) {
				clearInterval(interval);
				setLastMsg("");
				setDisabled(false);
			}
		}, 100);

		return () => clearInterval(interval);
	}, [lastMsg]);

	const handleSend = async (input, e) => {
		if(e) e.preventDefault();
		if (!input.trim() || disabled) return;
			
		const userMsg = { id: Date.now(), role: "user", text: input };
		setMessages((prev) => [...prev, userMsg]);
		setInput("");
		if(actionDetails?.action == "userPost"){
			input = input + " postId - " + JSON.stringify(selectPost);
		}
		console.log(input);
		try {
			setLoading(true);
			setDisabled(true);
			const res = await fetch(`${VITE_BACKEND}/agent/chat/${userData._id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: input })
			});
			const result = await res.json();
			if(result?.status){
				setActionDetails({status: result.status, action: result.action, post: result?.post ? result.post : []})
			} else {
				setActionDetails(null);
			}
			if(result?.action == "createPost"){
				setData(e => [...e, result]);
				console.log("result", result);
			} 
			setLastMsg(result.reply);
			setSuggests(result.suggests);
		} catch {
			setLastMsg("Error getting response");
		} finally {
			setLoading(false);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend(input, e);
		}
	};


	return (
		<div className="md:px-4 py-4 w-full h-full flex flex-col overflow-hidden">
			<div className="bg-white h-full flex flex-col rounded-md overflow-hidden mr-4">
				<header className="px-4 py-3 bg-gradient-to-r from-rose-400 to-rose-500 text-white flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-semibold">AI</div>
						<div>
							<h3 className="text-sm font-semibold">Agent</h3>
							<p className="text-xs opacity-80">Chat with assistant</p>
						</div>
					</div>
					<button className="text-xs bg-white/20 px-3 py-1 rounded-md cursor-pointer"
						onClick={() => setReload(e => e+1)}
					>
						<FaSync/>
					</button>
				</header>

				<div className="flex-1 flex flex-col overflow-hidden">
					<div ref={scrollRef} className="h-full text-sm hide-r custom-scroll flex flex-col p-2 overflow-y-auto gap-2 bg-rose-50">
						{messages.map((m) => (
						<div key={m.id} className={m.role === "user" ? "flex flex-col items-end" : "flex flex-col items-start"}>
							<div className={`${m.role === "user" ? "bg-rose-500 text-white rounded-l-md rounded-br-md shadow max-w-[75%] mt-4" : "w-full"} px-4 py-2 overflow-auto custom-scroll`}>
								<Response text={m.text}/>
								{m.role == "bot" && <p className="py-1 text-xs text-zinc-500/70">{new Date(m.id).toLocaleString()}</p>}
							</div>
							
							<div>
								{data.map((i, index) => (
									<div key={index}>
										{i.reply == m.text &&
										<PostData data={i} disabled={disabled} userData={userData}/>
										}
									</div>
								))}
							</div>
						
						</div>
						))}
						{loading &&
						<div className="px-2 w-fit flex flex-row gap-1 animate-pulse">
							<div className="p-1 bg-rose-500 rounded-full animate-bounce"></div>
							<div className="p-1 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
							<div className="p-1 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
						</div>
						}
						{actionDetails && !disabled &&
						<div>
							<Action actions={actionDetails} userData={userData} setActionDetails={setActionDetails} selectPost={selectPost} setSelectPost={setSelectPost}/>
						</div>
						}
						{!disabled &&
						<div className="px-4 w-full flex flex-col text-xs">
							{suggests?.map((i, index) => (
								<div key={index}>
									<p className="">- {i}</p>
								</div>
							))}
						</div>
						}
					</div>
				</div>
				
				<form 
					onSubmit={(e) => {
						e.preventDefault();
						if (!disabled) handleSend(input, e);
					}} 
					className="shrink-0 p-2 bg-rose-50 flex items-center gap-3"
				>	
					<div
						className={`${disabled && "cursor-not-allowed"} p-2 w-full bg-rose-200 flex flex-col gap-2 rounded-2xl border-1 border-rose-300 overflow-hidden`}
					>
						<textarea
							disabled={disabled}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Write a message..."
							className={`${disabled && "cursor-not-allowed"} custom-scroll text-sm p-1 max-h-40 min-h-10 w-full hide-scrollbar rounded-md outline-none`}
							spellCheck={false}
							onKeyDown={handleKeyDown}
						></textarea>
						<div className="flex flex-row gap-1">
							<div className="max-h-30 custom-scroll overflow-auto px-2 flex flex-wrap text-xs">
								{suggests?.map((i, index) => (
									<div key={index}>
										<p className="w-fit line-clamp-2 text-rose-500 bg-rose-100 px-2 py-1 rounded-md cursor-pointer border-2 border-rose-200 hover:underline hover:shadow-md hover:border-rose-400 hover:text-rose-600 hover:bg-rose-200 duration-500"
											onClick={() => {
												handleSend(i);
											}}
										>{i}</p>
									</div>
								))}
							</div>
							{input.trim() != "" &&
							<button 
								disabled={disabled}
								type="submit" className="w-fit h-fit flex flex-col items-center ml-auto p-2 rounded-2xl bg-rose-500 text-white text-sm cursor-pointer"
							>
								<FaArrowUp/>
							</button>
							}
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
