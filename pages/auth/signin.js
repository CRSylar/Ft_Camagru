import React from 'react';
import {getProviders, signIn} from "next-auth/react";
import Header from "../../components/Header";
import bgLogo from '../../public/Camagru.png';
import Image from "next/image";

function Signin ( {providers} ) {
	return (
		<>
			<Header/>
			<div className='flex flex-col items-center justify-center min-h-screen py-2 text-center -mt-26 px-14 '>
				<Image
					className='w-80 z-20'
					src={bgLogo} alt={'App logo'}/>
			<div>
			{Object.values(providers).map((provider) => (
				<div key={provider.name}>
					<button
						className='p-3 bg-blue-500 rounded-lg text-white'
						onClick={() => signIn(provider.id, { callbackUrl: '/'})}>
						Sign in with {provider.name}
					</button>
				</div>
			))}
		</div>
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const providers =  await getProviders()

	return {
		props: {
			providers
		}
	}
}

export default Signin;