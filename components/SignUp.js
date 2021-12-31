import React from 'react';
import Credentials from "./Credentials";

function SignUp ({firstTime, setFirstTime}) {
	return (
		<Credentials firstTime={firstTime} setFirstTime={setFirstTime}/>
	);
}

export default SignUp;