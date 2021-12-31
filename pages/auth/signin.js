import React, {useState} from 'react';
import {getProviders, signIn} from "next-auth/react";
import Header from "../../components/Header";
import bgLogo from '../../public/Camagru.png';
import Image from "next/image";
import Credentials from "../../components/Credentials";
import SignUp from "../../components/SignUp";

function Signin ( {providers} ) {

	const [firstTime, setFirstTime] = useState(false)

	return (
		<>
			<Header/>
			<div className='flex flex-col items-center justify-center min-h-screen py-2 text-center -mt-26 px-14 '>
				<Image
					className='w-80 z-20'
					src={bgLogo} alt={'App logo'}/>
				{ firstTime ?
					(
						<SignUp firstTime={firstTime} setFirstTime={setFirstTime}/>
					)
						:
					(<>
							<div>
								{Object.values(providers).map((provider) => {
									if (provider.name !== 'Credentials') {
										return (
											<div key={provider.name}>
												<button
													className='p-3 bg-blue-500 rounded-lg text-white'
													onClick={() => signIn(provider.id, {callbackUrl: '/'})}>
													Sign in with {provider.name}
												</button>
											</div>
										)}
								})}
							</div>
							<p className='my-7'> OR </p>
							<Credentials firstTime={firstTime} setFirstTime={setFirstTime}/>
						</>)
				}
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