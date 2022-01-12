import Head from 'next/head'
import Header from "../components/Header";
import Feed from "../components/Feed";
import Modal from "../components/Modal";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className='bg-gray-50 h-screen overflow-y-scroll'>
      <Head>
        <title>{'Camagru'}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>

      {/* Feed */}
      <Feed/>

      {/* Footer */}
      <Footer/>
      {/* Modal */}
      <Modal/>
    </div>
  )
}
