import { useMutation, gql } from "@apollo/client"
import {useState} from 'react'
import { useRouter } from 'next/router'


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
        <div>
         <form onSubmit={handleSubmit}>
            <input onChange={(e)=>setTitle(e.target.value)} placeholder={"title"}/>
            <input  onChange={(e)=>setContent(e.target.value)} placeholder={"content"}/>
            {loading && <p>Loading</p>}
            {error && <p>error</p>}
            <button type={"submit"}>Update</button>
         </form>
        </div>
    )
}
export async function getServerSideProps({ req, res }) {
    
    const token = req.cookies.token || ""
    
    return { props: {token  } };
  }