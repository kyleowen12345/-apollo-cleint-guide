import { useMutation, gql } from "@apollo/client"
import { useRouter } from 'next/router'
import {useState} from 'react'
import cookie from "js-cookie";


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
  
    } catch (error) {
      console.log(error)
    }
    
  }
console.log(error?.message)

  return (
    <div>
      <form onSubmit={handleSubmit}>
     <input onChange={e=>setName(e.target.value)}/>
     <input onChange={e=>setPassword(e.target.value)}/>
     { error && <p>error</p> }
     {loading ? <p>Loading...</p>:<button type="submit">
       Login
     </button>}
  
      </form>
     

    </div>
  );
}
// export async function getStaticProps() {
//   const apolloClient = initializeApollo();

//   await apolloClient.query({
//     query: MyQuery,
//   });

//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//   };
// }