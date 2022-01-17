import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import theme from '../theme'

import {createClient, Provider as URLQProvider} from "urql"

const client = createClient({
  url:"http://localhost:5000/graphql",
  fetchOptions:{
    credentials:"include",
  }
})

function MyApp({ Component, pageProps } : any) {
  return (
    <URLQProvider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider options={{useSystemColorMode: true}}>
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </URLQProvider>
  )
}

export default MyApp
