import { FaArrowLeft, FaArrowRight, FaPause, FaPlay } from "react-icons/fa";
import image from "../../images/image.png";
import image2 from '../../images/image2.png';
import image3 from '../../images/image3.png';
import { useState } from "react";
import { useEffect } from "react";

const Frames = function({image}){
	const [images, setImages] = useState([]);
	const [play, setPlay] = useState(false);
	const [current, setCurrent] = useState(0);
	
	const handleFrame = function(direction){
		let frame = images.length;
		if(direction == "left"){
			const index = (frame + current -1)%frame;
			setCurrent(index);
		}else if(direction == "right"){
			const index = (current+1)%frame;
			setCurrent(index);
		}
	}


	useEffect(() => {
		if(image.length > 0){
			setImages(image);
		}
	}, [image])

	useEffect(() => {
		let interval;
		if (play) {
		interval = setInterval(() => {
			setCurrent((prev) => (prev + 1) % images.length);
		}, 2000);
		}
		return () => clearInterval(interval);
	}, [play, images.length]);

	return(
		<div className="">
			<div className="h-full border-t border-b border-zinc-200">

				{images.length > 1 ? 
				<div className="relative min-h-55 flex items-center justify-center overflow-">
					{images.map((img, index) => (
						<img
							key={index}
							src={img}
							alt=""
							className={`absolute h-full w-fit object-cover transition-opacity duration-700 ease-in-out ${
							index === current ? "opacity-100" : "opacity-0"
							}`}
						/>
					))}				
				</div>
				:
			
				<div className="w-full h-full flex items-center justify-center">
					<img
						src={images[current]}
						alt=""
						className={`h-fit w-fit object-cover transition-opacity duration-700 ease-in-out`}
					/>
					
				</div>
				}

				{images.length > 1 &&
				<div className="h-1 flex w-full bg-rose-200 overflow-hidden">
					{images.map((_, index) => (
						<div
						key={index}
						className={`h-full transition-all duration-300 ${
							index === current ? "bg-rose-400" : "bg-rose-200"
						}`}
						style={{ width: `${100 / images.length}%` }}
						></div>
					))}
				</div>
				}

				{images.length > 1 &&
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
						{current+1}/{images.length}
					</div>
				</div>
				}

				
			</div>
		</div>
	)
}

export default Frames;