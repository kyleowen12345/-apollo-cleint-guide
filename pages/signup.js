import { useMutation, gql } from "@apollo/client"
import { useRouter } from 'next/router'
import {useState} from 'react'
import Link from 'next/link'
import Head from 'next/head'


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
console.log(error)

  return (
    <div className="flex justify-center">
       <Head>
        <title>SignUp</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <form onSubmit={handleSubmit}  className="m-8 p-12 w-3/4 text-center rounded-2xl bg-black text-black max-w-lg border border-white">
     <div className="flex justify-center flex-col items-center">
     <h1 className="p-5 text-3xl text-white font-mono">Vercel</h1>
     
     <input onChange={e=>setName(e.target.value)} className="m-3 p-3 w-2/3 font-mono min-w-full md:min-w-0  rounded-2xl" placeholder={"Name"}/>
     <input onChange={e=>setPassword(e.target.value)} className="m-3 p-3 w-2/3 font-mono min-w-full md:min-w-0  rounded-2xl" placeholder={"Password"}/>
     { error && <p className="p-2 text-white font-mono">Error</p> }
     {loading ? <p className="p-2 text-white font-mono">Loading...</p>:<button type="submit" className="text-black p-2 m-3 p-2 rounded-2xl bg-white w-1/3 font-mono min-w-full md:min-w-0">
       Signup
     </button>}
     <p  className="text-white font-mono">Already have an account? </p>
     <p className="underline text-white font-mono"><Link href="/login" >Login</Link></p>
     </div>
      </form>
     

    </div>
  );
}