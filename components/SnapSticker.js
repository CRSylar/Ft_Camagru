import React, {useEffect, useRef, useState} from 'react';
import {useSession} from "next-auth/react";
import {CameraIcon} from "@heroicons/react/solid";
import Image from "next/image";
import {constant} from "../common/Stickers";
import Baloon from '/public/Stickers/Baloon.png';

function SnapSticker ({recent, setRecent}) {

	const {data: session} = useSession()
	const videoRef = useRef(null)
	const photoRef = useRef(null)
	const stickerRef = useRef(null)
	const testRef = useRef(null)
	const [draggedItem, setDraggedItem] = useState(null)

	useEffect(() => {
			getVideo();
		}, [videoRef]
	);

	const getVideo = () => {
		navigator.mediaDevices
			.getUserMedia({video: {width: 300, height:300}})
			.then( stream => {
				let video = videoRef.current
				video.srcObject = stream
				video.play()
			})
			.catch( e => console.log('Error : ', e))
	}

	const paintToCanvas = () => {
		const video = videoRef.current;
		const photo = photoRef.current;
		const ctx = photo?.getContext("2d");

		photo?.width  = 300;
		photo?.height = 300;

		return setInterval(() => {
			ctx.drawImage(video, 0, 0, photo?.width, photo?.height);
		},30);
	};

	function takeSnap () {
		const video = videoRef.current
		const stickerCanvas = stickerRef.current
		const canvas = testRef.current

		if (video && canvas) {
			const ctx = canvas.getContext('2d')
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
			ctx.drawImage(stickerCanvas, 0, 0, canvas.width, canvas.height)
			const dataUrl = canvas.toDataURL('image/jpeg')
			setRecent([...recent, {key: Date.now(), data: dataUrl}])
			session.recentSnap.push( {key: Date.now(), data: dataUrl})
		}
	}

	function startDragging (e) {
		const imagePos = e.target.getBoundingClientRect()
		const x = e.clientX - imagePos.left
		const y = e.clientY - imagePos.top

		setDraggedItem({
			src: document.getElementById(e.target.id),
			x,
			y,
		})
	}


	function endDragging (e) {
		e.preventDefault()

		if (draggedItem) {
			const canvas = stickerRef.current
			const canvasPos = canvas.getBoundingClientRect()

			const newElement =  {
				img: draggedItem.src,
				x: e.clientX - canvasPos.left - draggedItem.x,
				y: e.clientY - canvasPos.top - draggedItem.y,
			}

			canvas.getContext('2d').drawImage(newElement.img, newElement.x, newElement.y)
			setDraggedItem(null)
		}
	}

	return (
		<div>
			{/* Camera Section */}
			<video ref={videoRef}
			       className='hidden'
			       onPlay={paintToCanvas}/>
			<div className='relative h-[300px] items-center '>
				<canvas ref={photoRef}
				        className='absolute left-0 top-0 right-0 mr-auto ml-auto w-[300px]' />
				<canvas ref={stickerRef}
				        width={'300px'}
				        height={'300px'}
				        onDrop={endDragging}
				        onDragOver={e => e.preventDefault()}
				        className='absolute left-0 top-0 right-0 mr-auto ml-auto w-[300px] z-10' />
				<canvas ref={testRef} width={150} height={150} className='hidden'/>
			</div>
			<div
				onClick={takeSnap}
				className='mx-auto flex mt-5 items-center justify-center h-12 w-12 rounded-full
																		bg-blue-100 cursor-pointer'  >
				<CameraIcon
					className='h-6 w-6 text-blue-600'
					aria-hidden='true'  />
			</div>

			{/* Filter Selector */}
			<div className='flex bg-white mt-8 border-y border-gray-300 overflow-x-scroll scrollbar-thin
    scrollbar-thumb-black'>
				{
					Object.keys(constant.STICKERS).map( (sticker) => (
						<div className=' h-[150px] w-[150px] overflow-x-auto overflow-y-hidden '>
							<Image id={sticker}
						       key={sticker}
						       width={150}
						       height={150}
						       src={constant.STICKERS[Number(sticker)]}
						       alt={'x'}
						       draggable={"true"}
						       onDragStart={startDragging}/>
						</div>
					))
				}
			</div>
		</div>
	);
}

export default SnapSticker;