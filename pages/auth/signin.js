import React, {useState} from 'react';
import {getCsrfToken, getProviders, signIn} from "next-auth/react";
import Header from "../../components/Header";
import bgLogo from '../../public/Camagru.png';
import Image from "next/image";
import Credentials from "../../components/Credentials";
import SignUp from "../../components/SignUp";
import Footer from "../../components/Footer";

function Signin ( {providers, csrfToken} ) {

	const [firstTime, setFirstTime] = useState(false)

	return (
		<>
			<Header/>
			<div className='flex flex-col items-center justify-center py-2 text-center tall:-mt-10'>
				<Image
					className='z-20'
					src={bgLogo} alt={'App logo'}/>
				{ firstTime ?
					(
						<SignUp firstTime={firstTime} setFirstTime={setFirstTime}/>
					)
						:
					(<>
							<div>
								{Object.values(providers).map((provider) => {
									if (provider.id !== 'Credentials') {
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
							<Credentials firstTime={firstTime} setFirstTime={setFirstTime} token={csrfToken}/>
						</>)
				}
			</div>
			<div className='tall:absolute tall:bottom-0 tall:inset-x-0'>
				<Footer/>
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const providers =  await getProviders()

	return {
		props: {
			providers,
			csrfToken: await getCsrfToken(context),
		}
	}
}

export default Signin;