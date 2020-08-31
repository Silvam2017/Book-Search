import gql from 'graphql-tag';

export const GET_ME = gql`
    query user($username: String!) {
        user(username: $username) {
            _id
            username
            email
            savedBooks {
                title
            }
        }
    }
`;