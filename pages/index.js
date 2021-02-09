import { useQuery, gql,readQuery } from "@apollo/client";
import { initializeApollo } from "../src/apollo";
import { useRouter } from 'next/router'
import {useEffect,useState} from 'react'
import jwt_decode from "jwt-decode";
import cookie from "js-cookie";
import jwtDecode from "jwt-decode";
import Link from 'next/link'
 
export const MyQuery = gql`
  query MyQuery {
  posts{
    id
    title
    content
    author{
      id
      name
    }
    comments{
      id
      comment
    }
  }
}
`;
export const NoUserQuery = gql`
  query NoUserQuery {
  posts{
    id
    title
    content
  }
}
`;
export default function Home({token,initialApolloState}) {
 
  const router = useRouter()
  const { data, loading,error } = useQuery( MyQuery );
 const decoded=token && jwtDecode(token)
 console.log(decoded)
  console.log(data)
 console.log(token)
  console.log(initialApolloState)
  const handleLogout=()=>{
    cookie.remove('token')
    router.push('/login')
  }
  console.log(loading)
  // const {trial}=initialApolloState.readQuery({
  //   query:
  // })
  return (
    <div>
      {loading && <span>loading...</span>}
      {error && <span>error...</span>}
      <p>{token}</p>
    
    
      {data.posts.map(i=>{
        return(
          <div key={i.id}>
            <h1>{i.title}</h1>
            <p>{i.content}</p>
            <p>Author {i.author.name}</p>
            {decoded.id ===  i.author.id &&  <Link href={`/updatepost/${i.id}`}>Update</Link>}
          </div>

        )
      })}
      {
        token &&<button onClick={handleLogout}>Logout</button>
      }

    </div>
  );
}

// export async function getStaticProps() {
  
//   const apolloClient = initializeApollo();
//   await apolloClient.query({
//     query: MyQuery 
//   });


 
//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
    
//     }, revalidate:1
  
//   };
// }
export async function getServerSideProps({ req, res }) {
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: MyQuery 
  });
  const token = req.cookies.token || ""
  const initialApolloState=apolloClient.cache.extract()
  return { props: {token ,initialApolloState } };
}
