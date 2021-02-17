import {
    ApolloClient,
    InMemoryCache,
    NormalizedCacheObject,
    makeVar
  } from "@apollo/client";
  import { useMemo } from "react";
  
  
  let apolloClient: ApolloClient<NormalizedCacheObject>;
  
  
  
  function createApolloClient() {
    return new ApolloClient({
      ssrMode: typeof window === "undefined",
      uri:  'https://apollo-cleint-guide-734hxeh7b.vercel.app/api/graphql',
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
          },
          getPostsWithPagination:{
            fields:{
              Post:{
                merge(existing: any[], incoming: any[], { args }) {
                  const merged = existing ? existing.slice(0) : [];
                  // Insert the incoming elements in the right places, according to args.
                  const end = args.offset + Math.min(args.limit, incoming.length);
                  for (let i = args.offset; i < end; ++i) {
                    merged[i] = incoming[i - args.offset];
                  }
                  return merged;
                },
                
                
                read(existing: any[], { args }) {
                  // If we read the field before any data has been written to the
                  // cache, this function will return undefined, which correctly
                  // indicates that the field is missing.
                  const page = existing && existing.slice(
                    args.offset,
                    args.offset + args.limit,
                  );
                  // If we ask for a page outside the bounds of the existing array,
                  // page.length will be 0, and we should return undefined instead of
                  // the empty array.
                  if (page && page.length > 0) {
                    return page;
                  }
                  
                },
              }
            }
          },
          
          
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
  export const PageNumber = makeVar([]);
  export function useApollo(initialState) {
    const store = useMemo(() => initializeApollo(initialState), [initialState]);
    return store;
  }