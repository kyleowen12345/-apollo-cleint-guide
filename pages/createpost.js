import { useMutation, gql,useQuery } from "@apollo/client"
import { useRouter } from 'next/router'
import { initializeApollo } from "../src/apollo";
import {useState} from 'react'
import Link from 'next/link'
import jwtDecode from "jwt-decode";
import Head from 'next/head'
import {NoUserQuery} from './index'


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
const CREATE_POST = gql`
  mutation CreatePost($title:String!,$content:String!){
  createPost(title:$title,content:$content){
    id
    title
    content
    author{
      id
      name
    }
    comments{
      comment
    }
  }
}
`;

export const DELETE_POST=gql`
mutation DeletePost ($id:ID!){
  deletePost(id:$id){
    id
  }
}
`
export default function CreatePost({token}) {
  const router = useRouter()
  const decoded=token && jwtDecode(token)
  const [title,setTitle]=useState()
  const [content,setContent]=useState()
  const { data } = useQuery( NoUserQuery);
  // creating a post
  const [CreatePost,{ loading,error }] = useMutation(CREATE_POST,{context:{
      headers:{
        token: token
      }
  }
  ,update(cache,{data}){
    const newPostFromResponse=data?.createPost
    const existingPost=cache.readQuery({query:NoUserQuery})
     if(existingPost && newPostFromResponse) {
       cache.writeQuery({
         query:NoUserQuery,
         getPostsWithPagination:{
         posts:{...existingPost?.posts,
              newPostFromResponse} 
          
         }
       })
     }
  }

}
);
   
  
  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
        console.log(token)
   const {data}= await  CreatePost({variables:{title:title,content:content}})
   router.push('/')
   console.log(data)

  
    } catch (error) {
      console.log(error)
    }
    
  }
console.log(decoded)
  return (
    <div className="flex justify-center">
       <p className="p-5 text-white"><Link href={`/`}>Home</Link> </p> 
       <Head>
        <title>CreatePost</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <form onSubmit={handleSubmit} className="m-8 p-12 w-3/4 text-center rounded-2xl bg-black text-black max-w-lg border border-white">
      <div className="flex justify-center flex-col items-center">
      <h1 className="p-5 text-3xl text-white font-mono">Create Post</h1>
     <input onChange={e=>setTitle(e.target.value)} placeholder={"title"}  className="m-3 p-3 w-2/3 font-mono min-w-full md:min-w-0  rounded-2xl"/>
     <input onChange={e=>setContent(e.target.value)} placeholder={"content"}  className="m-3 p-3 w-2/3 font-mono min-w-full md:min-w-0  rounded-2xl"/>
     { error && <p className="p-2 text-white font-mono">Error</p> }
     {loading ? <p className="p-2 text-white font-mono">Loading...</p>:<button type="submit"  className="text-black p-2 m-3 p-2 rounded-2xl bg-white w-1/3 font-mono min-w-full md:min-w-0">
       CreatePost
     </button>}
  </div>
      </form>
    </div>
  );
}
// change this tommorow
export async function getServerSideProps({ req, res }) {
    const apolloClient = initializeApollo();
    await apolloClient.query({
      query: NoUserQuery 
    });
    const token = req.cookies.token || ""
    const initialApolloState=apolloClient.cache.extract()
    return { props: {token,initialApolloState  } };
  }
  