export const GET_LIST = `
  query GetTodos($user_id: uuid!) {
    todos(where: { user_id: { _eq: $user_id } }, order_by: { created_at: desc }) {
      id
      title
      description
      priority
      completed
      created_at
    }
  }
`;
