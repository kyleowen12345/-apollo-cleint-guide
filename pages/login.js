import { useMutation, gql } from "@apollo/client"
import { useRouter } from 'next/router'
import {useState} from 'react'
import cookie from "js-cookie";
import Link from 'next/link'
import Head from 'next/head'


const LOGIN = gql`
   mutation Login($name:String!,$password:String!) {
  login(name:$name,password:$password){
    token
  }
}
`;
export default function Login() {
  const router = useRouter()
  const [name,setName]=useState()
  const [password,setPassword]=useState()
  const [login,{ loading,error }] = useMutation(LOGIN,{ errorPolicy: 'all' });

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
   const {data}= await  login({variables:{name:name,password:password}})
   if(data){
    cookie.set("token", (data?.login.token), { expires: 1 / 24 });
    router.push('/')
   }
  
    } catch (err) {
      console.log(error)
    }
    
  }
console.log(error?.message)

  return (
    <div className="flex justify-center">
       <Head>
        <title>Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <form onSubmit={handleSubmit} className="m-8 p-12 w-3/4 text-center rounded-2xl bg-black text-black max-w-lg border border-white">
        <div className="flex justify-center flex-col items-center">
        <h1 className="p-5 text-3xl text-white font-mono">Vercel</h1>
        <input onChange={e=>setName(e.target.value)} className="m-3 p-3 w-2/3 font-mono min-w-full md:min-w-0  rounded-2xl" placeholder={"Name"}/>
     <input type="password" onChange={e=>setPassword(e.target.value)} className="m-3 p-3 w-2/3 font-mono min-w-full md:min-w-0  rounded-2xl" placeholder={"Password"} />
     { error && <p  className="p-2 text-white font-mono">error</p> }
     {loading ? <p  className="p-2 text-white font-mono">Loading...</p>:<button type="submit" className="text-black p-2 m-3 p-2 rounded-2xl bg-white w-1/3 font-mono min-w-full md:min-w-0">
       Login
     </button>}
     <p  className="text-white font-mono">Create Account? </p>
     <p className="underline  text-white font-mono"><Link href="/signup" >Sign-up</Link></p>
        </div>
     
  
      </form>
     

    </div>
  );
}
