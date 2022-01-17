import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import theme from '../theme'
import {createClient, dedupExchange, fetchExchange, Provider as URLQProvider} from "urql"
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache'
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql'

function betterUpdateQuery<Result, Query>(cache: Cache, qi: QueryInput, result:any, fn: (r:Result, q:Query) => Query){
  return cache.updateQuery(qi, data => fn(result, data as  any) as any)
}

const client = createClient({
  url:"http://localhost:5000/graphql",
  fetchOptions:{
    credentials:"include",
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      // Custom data updates
      updates: {
        Mutation:{
          // @ts-ignore unused args
          login: (_result, args, cache, info ) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              {query:MeDocument},
              _result,
              (result, query) => {
                if(result.login.errors) return query;
                else return {me:result.login.user}
              });
          },
          // @ts-ignore unused args
          register: (_result, args, cache, info ) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              {query:MeDocument},
              _result,
              (result, query) => {
                if(result.register.errors) return query;
                else return {me:result.register.user}
              });
          }
        }
      }
    }),
    fetchExchange
  ]
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
