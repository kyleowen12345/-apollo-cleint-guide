import { useMutation, gql } from "@apollo/client"
import {useState} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const UPDATE_POST=gql`
mutation UpdatePost($title:String!,$content:String!,$id:ID!){
  updatePost(title:$title,content:$content,id:$id){
    id
    title
    content
    author{
      id
      name
    }
  }
}
`


export default function UpdatePost({token}){
  const router = useRouter()
  const {id}=router.query
    const [UpdatePost,{loading,error}]=useMutation(UPDATE_POST,{context:{
      headers:{
        token:token
      }
    }})
const [title,setTitle]=useState()
const [content,setContent]=useState()

const handleSubmit=async(e)=>{
  e.preventDefault()
    try {
        const {data}=await UpdatePost({variables:{title,content,id:id}})
        console.log(data)
    } catch (error) {
        console.log(error)
    }
   }

    return(
        <div className="flex justify-center">
         <form onSubmit={handleSubmit} className="m-8 p-12 w-3/4 text-center rounded-2xl bg-black text-black max-w-lg  border-white">
         <p className="p-5 text-white"><Link href={`/`}>Home</Link> </p>
         <div className="flex justify-center flex-col items-center">
         <h1 className="p-5 text-3xl text-white font-mono">Update Post</h1>
            <input onChange={(e)=>setTitle(e.target.value)} placeholder={"title"}  className="m-3 p-3 w-2/3 font-mono min-w-full md:min-w-0  rounded-2xl"/>
            <input  onChange={(e)=>setContent(e.target.value)} placeholder={"content"}  className="m-3 p-3 w-2/3 font-mono min-w-full md:min-w-0  rounded-2xl"/>
            {loading && <p className="p-2 text-white font-mono">Loading</p>}
            {error && <p className="p-2 text-white font-mono">error</p>}
            <button type={"submit"} className="text-black p-2 m-3 p-2 rounded-2xl bg-white w-1/3 font-mono min-w-full md:min-w-0">Update</button>
            </div>
         </form>
        </div>
    )
}
export async function getServerSideProps({ req, res }) {
    
    const token = req.cookies.token || ""
    
    return { props: {token  } };
  }