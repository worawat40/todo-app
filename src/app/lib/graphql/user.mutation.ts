export const REGISTER_USER = `
  mutation Register($email: String!, $password_hash: String!, $name: String!) {
    insert_users_one(object: {
      email: $email,
      password_hash: $password_hash,
      name: $name
    }) {
      id
      email
      name
    }
  }
`;

export const UPDATE_USER = `
    mutation UpdatePassword($id: uuid!, $password_hash: String!) {
      update_users_by_pk(pk_columns: { id: $id }, _set: { password_hash: $password_hash }) {
        id
        email
      }
    }
  `;
