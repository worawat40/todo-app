'use client';
import { gql, useQuery } from '@apollo/client';
import client from './lib/apolloClient';

const GET_TODOS = gql`
  query {
    todos {
      id
      title
      completed
    }
  }
`;

export default function Home() {
  const { data, loading, error } = useQuery(GET_TODOS, { client });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">TODOs</h1>
      <ul>
        {data.todos.map((todo: any) => (
          <li key={todo.id} className="mt-2">
            ✅ {todo.title} {todo.completed ? '(done)' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
