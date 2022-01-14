import React from 'react';
import Logo from "../public/Camagru_Small.png";
import Image from "next/image";
import Footer from "../components/Footer";

function Custom404(props)
{
	return (
		<div className='items-center text-center'>
			<Image
				className='z-20'
				src={Logo} alt={'App logo'}/>
			<h1 className='font-bold text-2xl'>
				404
				<p className='font-semibold text-lg'>
					Page Not Found
				</p>
			</h1>
			<div className='tall:absolute tall:bottom-0 tall:inset-x-0'>
				<Footer/>
			</div>
		</div>
	)
}

export default Custom404;