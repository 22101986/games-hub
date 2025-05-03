import Head from 'next/head'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
      </Head>  
    <div className="min-h-screen bg-primary"> {/* Ou bg-gradient-to-r from-rose-400 to-orange-300 */}
      <Component {...pageProps} />
    </div>
    </>
  )
}

export default MyApp