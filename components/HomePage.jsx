import React from 'react'
import Link from 'next/link'
import { useQuery,useMutation } from "@apollo/client";
import { useRouter } from 'next/router'
import {useState} from 'react'
import jwtDecode from "jwt-decode";
import cookie from "js-cookie";
import {NoUserQuery} from '../pages/index'
import {DELETE_POST} from '../pages/createpost'
import {PageNumber} from '../src/apollo'
const HomePage = ({token,initialApolloState}) => {
    const [pageSelector,setPageSelector]=useState(1)
  const router = useRouter()
  const { data, loading,error } = useQuery( NoUserQuery,{variables:{page:pageSelector,limit:2},fetchPolicy:'cache-and-network'} );
 const decoded=token && jwtDecode(token)
 const handleLogout=()=>{
    cookie.remove('token')
    router.push('/login')
  }
  const [DeletePost,{DeleteLoading}]=useMutation(DELETE_POST,{context:{
    headers:{
      token:token
    }
  }})
  console.log(initialApolloState)
  PageNumber([pageSelector])
  console.log(PageNumber().toString())
  const totalPages=data?.getPostsWithPagination.paginator.totalPages
  const currentPage=data?.getPostsWithPagination.paginator.currentPage
    return (
        <div className="flex justify-center flex-col p-5 w-full h-full items-center">
        <p className="p-5 text-white"><Link href={`/createpost`}>Createpost</Link> </p>  
          {loading && <span>loading...</span>}
          {error && <span>error...</span>}
          {data?.getPostsWithPagination.posts.map(i=>{
            return(
              <div key={i.id} className="m-8 p-12 w-3/4 text-center rounded bg-black border-gray-200 shadow-md overflow-hidden text-white border border-white">
                <h1 className=" text-2xl font-mono overflow-ellipsis truncate">{i.title}</h1>
                <p className="p-5 text-white"><Link href={`/viewpost/${i.id}`}>View post</Link> </p>
                <p className="text-base font-mono">{i.content}</p>
                <p className="text-base font-mono">Author {i.author.name} </p>
                {decoded.id ===  i.author.id &&  <Link href={`/updatepost/${i.id}`}>Update</Link>}
                {DeleteLoading && <p className="text-base font-mono">Nag loading</p>}
            {decoded.id ===  i.author.id && <button onClick={()=>{
              DeletePost({variables:{id:i.id}, refetchQueries: [
                { query: NoUserQuery }
              ]})
            }} className="text-black p-2 m-3 p-2 rounded-2xl bg-white w-1/3 font-mono min-w-full md:min-w-0">Delete</button>}
              </div>
    
            )
          })}
          {
            token &&<button onClick={handleLogout}>Logout</button>
          }
          <div className="flex justify-center">
          {data?.getPostsWithPagination.paginator.hasPrevPage && <button onClick={()=>setPageSelector(pageSelector-1)} className="p-5 bg-black text-white text-2xl rounded-2xl">{"<"}</button>}
          {[...Array(totalPages)].map((_,i)=>{
            if(currentPage === i+1) return (
              <h1 key={i+1} onClick={()=>{setPageSelector(i+1)
              }} className="p-5 text-3xl text-white" >{i+1}</h1>
            )
            return (
              <p key={i+1} onClick={()=>{setPageSelector(i+1)
              }} className="p-5 text-white">{i+1}</p>
            )
          })}
          {data?.getPostsWithPagination.paginator.hasNextPage && <button onClick={()=>setPageSelector(pageSelector+1)} className="p-5 bg-black text-white text-2xl rounded-2xl">{">"}</button>}
          </div>
          
        </div>
      );
}

export default HomePage
