import {
    ApolloClient,
    InMemoryCache,
    NormalizedCacheObject,
  } from "@apollo/client";
  import { useMemo } from "react";
  
  
  let apolloClient: ApolloClient<NormalizedCacheObject>;
  
  
  
  function createApolloClient() {
    return new ApolloClient({
      ssrMode: typeof window === "undefined",
      uri:  'http://localhost:3000/api/graphql',
      cache: new InMemoryCache({
        typePolicies:{
          Post:{
            fields:{
              title:{
                read(title){
                  return title.toUpperCase()
                }
              }
            }
          }
        }
      }),
    });
  }
  
  export function initializeApollo(initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient();
  
    if (initialState) {
      _apolloClient.cache.restore(initialState);
    }
  
    if (typeof window === "undefined") return _apolloClient;
    apolloClient = apolloClient ?? _apolloClient;
  
    return apolloClient;
  }
  
  export function useApollo(initialState) {
    const store = useMemo(() => initializeApollo(initialState), [initialState]);
    return store;
  }