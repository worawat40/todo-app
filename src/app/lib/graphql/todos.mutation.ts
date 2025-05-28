export const ADD_TODO = ` mutation AddTodo($title: String!, $description: String, $priority: String, $user_id: uuid!) {
      insert_todos_one(object: {
        title: $title,
        description: $description,
        priority: $priority,
        user_id: $user_id,
        completed: false
      }) {
        id
        title
        description
        priority
        completed
      }
    }
  `;

export const UPDATE_TODO = `
   mutation UpdateTodo($id: uuid!, $title: String, $description: String, $priority: String, $completed: Boolean) {
      update_todos_by_pk(pk_columns: { id: $id }, _set: {
        title: $title,
        description: $description,
        priority: $priority,
        completed: $completed
      }) {
        id
        title
        completed
      }
    }
  `;

export const DELETE_TODO = ` mutation DeleteTodo($id: uuid!) {
      delete_todos_by_pk(id: $id) {
        id
      }
    }
  `;
