import axios from 'axios';
import { useRouter } from 'next/router';
import { User } from '../../../api/User';
import { GetStaticProps, InferGetStaticPropsType, GetStaticPaths  } from 'next'
import { UsersProps } from '../users';

export interface UserProps{
  user: User;
}

function Profile({ user }: InferGetStaticPropsType<typeof getStaticProps> ){

  const router = useRouter();

  if(router.isFallback) return <h1>Carregando...</h1>;

  return <div key={user.id}>
   <p>{ user.id }</p>
   <p>{ user.name }</p>
   <p>{ user.username }</p>
 </div>
}

export const getStaticProps: GetStaticProps<UserProps> = async (context) => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users`, 
    {params: {id: context.params.id}}
  );

  const user = await response.data[0]

  return {
    props: {user}, // will be passed to the page component as props
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  

  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users`, 
  );

  const users = await response.data.slice(0, 5);

  await new Promise((res) => setTimeout(res, 4000));

  const paths = users.map((user) =>{
    return { params: { id: String(user.id) } }
  });

  return {
    paths,
    fallback: true // See the "fallback" section below
  };
}

export default Profile;