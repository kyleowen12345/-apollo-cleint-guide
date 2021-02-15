import {  gql } from "@apollo/client";
import { initializeApollo } from "../src/apollo";
import Head from 'next/head'
import HomePage from '../components/HomePage'
import {PageNumber} from '../src/apollo'
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
export const NoUserQuery = gql`
  query NoUserQuery($page:Int) {
  getPostsWithPagination(page:$page){
    posts{
      id
      title
      content
      author{
        id
        name
      }
    }
    paginator{
      totalPosts
      totalPages
      hasPrevPage
      hasNextPage
      next
      prev
      perPage
      slNo
      currentPage
    }
  }
}
`;

export default function Home({token,initialApolloState}) {
  return (
    <>
    <Head>
        <title>Home</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
   <HomePage token={token} initialApolloState={initialApolloState}/>
   </>
  );
}

export async function getServerSideProps({ req, res }) {
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query:NoUserQuery,
  });
  const token = req.cookies.token || ""
  const initialApolloState=apolloClient.cache.extract()
  return { props: {token,initialApolloState  } };
}
