import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'

function MyApp({ Component, pageProps }: AppProps) {
  return <ChakraProvider>
    <Component {...pageProps} />
    <style jsx global>{`
          html,
          body {
            height: 100% !important;
            width: 100% !important;
            background-image: url(/bkg.jpg) !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
            background-size: cover !important;
          }

          * {
            box-sizing: border-box;
          }
        `}</style>
  </ChakraProvider>
}

export default MyApp
