import image from '../../images/image4.png';

const News = function(){
	return(
		<div className="p-4 w-full h-full">
			<div className="w-full h-full bg-white border border-zinc-200 rounded-md">
				<div className="p-2 flex justify-between items-center border-b border-zinc-200">
					<p className='text-sm italic'>Daily News</p>
				</div>

				<div className=''>
					<div className='p-2 text-sm font-serif flex flex-col gap-1'>
						<p className='text-md'>Lorem ipsum dolor sit amet.</p>
						<p className='p-1'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores fugiat nostrum nesciunt alias, dolor dolorem iure repellat praesentium deserunt consectetur mollitia nemo soluta minus deleniti a veniam voluptatum enim blanditiis?</p>
						<a href="" className='text-xs border-2 border-rose-400 text-rose-600 bg-rose-100 py-1 px-2 w-fit rounded-full '>click here</a>
					</div>
					<div className='border-t border-b border-zinc-200 p-2'>
						<img src={image} alt="" className=''/>
					</div>
					<div className='flex justify-end p-1 text-xs text-zinc-400'>
						<p className='flex flex-col'>By -<p className='hover:underline cursor-pointer'>Aryan Pratap</p></p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default News;