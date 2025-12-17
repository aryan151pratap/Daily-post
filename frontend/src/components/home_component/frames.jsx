import { FaArrowLeft, FaArrowRight, FaPause, FaPlay } from "react-icons/fa";
import image from "../../images/image.png";
import image2 from '../../images/image2.png';
import image3 from '../../images/image3.png';
import { useState } from "react";
import { useEffect } from "react";

const VITE_BACKEND = import.meta.env.VITE_BACKEND;

const Frames = function({image, setfullFrame, imageCount, postId}){
	const [images, setImages] = useState([]);
	const [play, setPlay] = useState(false);
	const [current, setCurrent] = useState(0);

	const getPostImage = async function(postId, index){		
		if(images[index]) return;
		try{
			const res = await fetch(`${VITE_BACKEND}/getPostImage/${postId}/${index}`);
			const result = await res.json();
			if (res.ok && result.image) {
                setImages(prev => {
                    const arr = [...prev];
                    arr[index] = result.image;
                    return arr;
                });
            }
		} catch(err){
			console.log(err);
		}
	}
	
	const handleFrame = function(direction){
		let frame = imageCount;
		if(direction == "left"){
			const index = (frame + current -1)%frame;
			setCurrent(index);
			getPostImage(postId, index);
		}else if(direction == "right"){
			const index = (current+1)%frame;
			setCurrent(index);
			getPostImage(postId, index);
		}
	}


	useEffect(() => {
		if(image.length > 0){
			const arr = new Array(imageCount);
            arr[0] = image[0];
            setImages(arr);
		}else {
			setImages([]);
		}
	}, [image])

	useEffect(() => {
		let interval;
		if (play) {
			interval = setInterval(() => {
				setCurrent((prev) => (prev + 1) % imageCount);
			}, 2000);
		}
		return () => clearInterval(interval);
	}, [play, images.length]);

	return(
		<div className="w-full">
			<div className="h-full border-t border-b border-zinc-200">

				{imageCount > 1 ? 
				<div className="relative min-h-55 flex items-center justify-center overflow-"
					onClick={() => setfullFrame(true)}
				>
					{images.map((img, index) => (
						<img
							key={index}
							src={img}
							alt="no image"
							className={`absolute h-full w-fit object-cover transition-opacity duration-700 ease-in-out ${
							index === current ? "opacity-100" : "opacity-0"
							}`}
						/>
					))}
					{!images[current] &&
					<div className="">
						<div className="relative p-4 border-2 rounded-full animate-spin border-t-transparent border-rose-500">
							<div className="absolute bg-zinc-100 inset-0 border-2 border-rose-200 rounded-full"></div>
						</div>
					</div>
					}			
				</div>
				:
				imageCount == 1 &&
				<div className="h-[400px] w-full flex items-center justify-center overflow-hidden"
					onClick={() => setfullFrame(true)}
				>
					<img
						src={images[current]}
						alt=""
						className={`max-h-full w-fit object-cover transition-opacity duration-700 ease-in-out`}
					/>
					
				</div>
				}

				{imageCount > 1 &&
				<div className="h-1 flex w-full bg-rose-200 overflow-hidden">
					{[...Array(imageCount)].map((_, index) => (
						<div
						key={index}
						className={`h-full transition-all duration-300 ${
							index === current ? "bg-rose-400" : "bg-rose-200"
						}`}
						style={{ width: `${100 / imageCount}%` }}
						></div>
					))}
				</div>
				}

				{imageCount > 1 &&
				<div className="w-full p-1 text-sm text-zinc-500 flex flex-row gap-5 items-center">
					<div className="w-full flex flex-row gap-5 justify-center">
						<FaArrowLeft  className="focus:text-zinc-700 cursor-pointer hover:text-zinc-600"
							onClick={() => handleFrame("left")}
						/>
						<div className="cursor-pointer"
							onClick={() => setPlay(!play)}
						>
							{play ? 
							<FaPause/>
							:
							<FaPlay/>
							}
						</div>
						<FaArrowRight className="focus:text-zinc-700 cursor-pointer hover:text-zinc-600"
							onClick={() => handleFrame("right")}
						/>
					</div>
					<div className="ml-auto">
						{current+1}/{imageCount}
					</div>
				</div>
				}

				
			</div>
		</div>
	)
}

export default Frames;