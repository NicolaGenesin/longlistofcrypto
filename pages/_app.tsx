import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    heading: "Montserrat",
    body: "Montserrat",
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return <ChakraProvider theme={theme}>
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
