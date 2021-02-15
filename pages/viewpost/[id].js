import {useQuery, gql } from "@apollo/client";
import { initializeApollo } from "../../src/apollo";
import { useRouter } from 'next/router'
import Link from 'next/link'

export const POST = gql`
  query post($id:ID!){
   post(id:$id){
    id
    title
    content
    author{
      id
      name
    }
   }
  }
`;
export const MyQuery=gql`
{
  posts{
    id
    
  }
}
`


export default function ViewPost({initialApolloState}){
    const router = useRouter()
    const {id}=router.query
    const {data,error}=useQuery(POST,{variables:{id:id}})
    console.log(initialApolloState)
  const {title,content}=data.post
    return (
        <div>
            <p className="p-5 text-white"><Link href={`/`}>Home</Link> </p>
            <p className="p-5 text-white">{title}</p>
            <p className="p-5 text-white">{content}</p>
        </div>
    )
}

export async function getStaticProps({params}) {
    const apolloClient = initializeApollo();
    await apolloClient.query({
        query:POST,
        variables:{id:params.id}
      });
      const initialApolloState=apolloClient.cache.extract()
    return {
      props: {initialApolloState},
      revalidate: 1,
    }
  }
  export async function getStaticPaths() {
    const apolloClient = initializeApollo();
   const {data}= await apolloClient.query({
        query:MyQuery,
      });
      
      const paths=data?.posts.map(i=>({
         params :{id:i.id}}))
         return { paths, fallback: false }
  }
  
