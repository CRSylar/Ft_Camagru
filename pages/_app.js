import '../styles/globals.css'
import { SessionProvider} from "next-auth/react";
import {RecoilRoot} from "recoil";
import {transitions, positions, Provider as AlertProvider} from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const alertOptions = {
  position : positions.MIDDLE,
  timeout: 4000,
  offset: '30px',
  transitions: transitions.FADE
}

function MyApp({ Component, pageProps: {session, ...pageProps} }) {
  return (
    <SessionProvider session={session}>
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </AlertProvider>
    </SessionProvider>
  )
}

export default MyApp
