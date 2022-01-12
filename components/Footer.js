import React from 'react';
import Image from "next/image";
import logoSm from '../public/Camagru_Small.png';

function Footer () {
	return (
		<div className='items-center justify-center flex flex-row'>
			<Image
				src={logoSm}
				width={40}
				height={40}
				alt={'Camagru'}/>
			<span className='text-xs text-gray-600'>
					{'App realized by Cromalde for Ecole42 Roma'}
			</span>
		</div>
	);
}

export default Footer;