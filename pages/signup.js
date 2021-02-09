import { useMutation, gql } from "@apollo/client"
import { useRouter } from 'next/router'
import {useState} from 'react'


const SIGNUP = gql`
  mutation ($name:String!,$password:String!){
  createUser(name:$name,password:$password){
    id
    name
  }
}
`;
export default function Signup() {
  const router = useRouter()
  const [name,setName]=useState()
  const [password,setPassword]=useState()
  const [signup,{ loading,error }] = useMutation(SIGNUP,{ errorPolicy: 'all' });


  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
   const {data}= await  signup({variables:{name:name,password:password}})
   if(data){
    router.push('/login')
   }else{
     return
   }
  
    } catch (error) {
      console.log(error)
    }
    
  }


  return (
    <div>
      <form onSubmit={handleSubmit}>
     <input onChange={e=>setName(e.target.value)}/>
     <input onChange={e=>setPassword(e.target.value)}/>
     { error && <p>Error</p> }
     {loading ? <p>Loading...</p>:<button type="submit">
       Signup
     </button>}
  
      </form>
     

    </div>
  );
}