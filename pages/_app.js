import '../styles/globals.css'
import { SessionProvider} from "next-auth/react";
import {RecoilRoot} from "recoil";
import {alertOptions, AlertTemplate} from "../common/AlertSetting";
import { Provider as AlertProvider } from 'react-alert'

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
