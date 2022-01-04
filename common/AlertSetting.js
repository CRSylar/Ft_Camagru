import {positions, transitions} from "react-alert";
import {BadgeCheckIcon, InformationCircleIcon, XCircleIcon} from "@heroicons/react/solid";

const alertOptions = {
	position : positions.TOP_CENTER,
	timeout: 4000,
	offset: '30px',
	transitions: transitions.FADE
}

const AlertTemplate = ({style, options, message, close}) => (
		<div className='bg-blue-400 text-white px-4 flex flex-col rounded-lg z-100'
		     style={style}>
			<button className='text-sm flex' onClick={close}>{'X'}</button>
			<div className='text-xl text-center'>
				{options.type === 'info' && <InformationCircleIcon className='h-6 w-6 mx-auto'/>}
				{options.type === 'success' && <BadgeCheckIcon className='h-6 w-6 mx-auto'/>}
				{options.type === 'error' && <XCircleIcon className='h-6 w-6 mx-auto'/>}
			</div>
			<div className='px-2 pb-3' >
				{message}
			</div>
		</div>
	)

export {alertOptions, AlertTemplate}