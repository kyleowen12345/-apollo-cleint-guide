import { useMutation, gql,useQuery } from "@apollo/client"
import { useRouter } from 'next/router'
import { initializeApollo } from "../src/apollo";
import {useState} from 'react'
import Link from 'next/link'
import jwtDecode from "jwt-decode";


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

const DELETE_POST=gql`
mutation DeletePost ($id:ID!){
  deletePost(id:$id){
    id
  }
}
`
export default function CreatePost({token}) {
  const decoded=token && jwtDecode(token)
  const [title,setTitle]=useState()
  const [content,setContent]=useState()
  const { data } = useQuery( MyQuery);
  // creating a post
  const [CreatePost,{ loading,error }] = useMutation(CREATE_POST,{context:{
      headers:{
        token: token
      }
  },update(cache,{data}){
    const newPostFromResponse=data?.createPost
    const existingPost=cache.readQuery({query:MyQuery})
     if(existingPost && newPostFromResponse) {
       cache.writeQuery({
         query:MyQuery,
         data:{
           posts:[
             ...existingPost?.posts,
             newPostFromResponse
           ]
         }
       })
     }
  }

}
);
   console.log(token)
  //  Deleting A post
  const [DeletePost,{DeleteLoading,DeleteData,DeleteError}]=useMutation(DELETE_POST,{context:{
    headers:{
      token:token
    }
  }})
  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
        console.log(token)
   const {data}= await  CreatePost({variables:{title:title,content:content}})
   console.log(data)

  
    } catch (error) {
      console.log(error)
    }
    
  }
console.log(decoded)
console.log(DeleteData)
  return (
    <div>
      <form onSubmit={handleSubmit}>
     <input onChange={e=>setTitle(e.target.value)}/>
     <input onChange={e=>setContent(e.target.value)}/>
     { error && <p>Error</p> }
     {loading ? <p>Loading...</p>:<button type="submit">
       CreatePost
     </button>}
  
      </form>
     
      {data?.posts.map(i=>{
        
        return(
          <div key={i.id}>
            <h1>{i.title}</h1>
            <p>{i.content}</p>
            <p>Author {i.author.name}</p>
            <p>{i.author.id}</p>
         {decoded.id ===  i.author.id &&  <Link href="/updatepost">Update</Link>}
            {DeleteLoading && <p>Nag loading</p>}
            {decoded.id ===  i.author.id && <button onClick={()=>{
              DeletePost({variables:{id:i.id},update(cache){
                // cache.evict({id:"ROOT_QUERY",args:{id:i.id}})
                // cache.readQuery({query:MyQuery})
                cache.modify({
                  fields:{
                    posts(existingPostsRefs,{readField}){
                      return existingPostsRefs.filter(
                        postRef => i.id !== readField('id',postRef)
                      )
                    }
                  }
                })
              }})
            }}>Delete</button>}
           
          </div>
        )
      })}
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
    const apolloClient = initializeApollo();
    await apolloClient.query({
      query: MyQuery 
    });
    const token = req.cookies.token || ""
    const initialApolloState=apolloClient.cache.extract()
    return { props: {token,initialApolloState  } };
  }
  