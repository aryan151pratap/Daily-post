import {postsData} from './postData.js';
import { useEffect, useState } from 'react';
import Post from './post.jsx';
import Media from './home_component/media.jsx';

const VITE_BACKEND = import.meta.env.VITE_BACKEND;

const Home = function({ setLoading, userData }){
	const [data, setData]  = useState(null);
	const [post, setPost] = useState(false);
	const [counter, setCounter] = useState(0);

	useEffect( () => {
		try{
			const getPost = async function(){
				const storedEmail = localStorage.getItem("daily-post-email");
				if(!storedEmail) return;
				const res = await fetch(`${VITE_BACKEND}/getPost/${storedEmail}`,{
					method: 'GET'
				});
				const result = await res.json();
				if(res.ok){
					setData(result.result);
				}
			}
	
			getPost();
		} catch (err){
			console.log(err);
		} finally{
			setLoading(false);
		}
	}, [counter])
	
	return(
		<div className='sm:w-fit w-full flex flex-col gap-4 sm:p-4 p-2'>
			{post &&
				<Post setShowPost={setPost} setCounter={setCounter} userData={userData}/>
			}

			<div className='w-full shadow-sm flex flex-row gap-2 justify-between items-center p-1 px-2 bg-white rounded-md border border-zinc-200'>
				<p className='text-sm font-serif '>Add Post</p>
				<button className='py-1 px-2 bg-rose-600 font-semibold border text-sm text-rose-50 hover:bg-rose-700 focus:bg-rose-500 rounded-md cursor-pointer'
					onClick={() => setPost(true)}
				>
					Post
				</button>
			</div>
			{data?.map((i, index) => (
				<Media key={index} data={i} setData={setData} userData={userData}/>
			))}
		</div>
	)
}

export default Home;