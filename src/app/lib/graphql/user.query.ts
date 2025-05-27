export const LOGIN_USER = `
  query Login($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      email
      name
      password_hash
    }
  }
`;

export const GET_LIST = `
    query GetUser($email: String!) {
      users(where: { email: { _eq: $email } }) {
        id
        password_hash
      }
    }
  `;
