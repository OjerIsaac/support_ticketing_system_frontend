import gql from "graphql-tag";

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      token
      user {
        id
        name
        email
        role
      }
      errors
    }
  }
`;

export const CREATE_TICKET = gql`
  mutation CreateTicket($input: CreateTicketInput!) {
    createTicket(input: $input) {
      ticket {
        id
        title
        description
        status
        createdAt
      }
      errors
    }
  }
`;

export const UPDATE_TICKET_STATUS = gql`
  mutation UpdateTicketStatus($id: ID!, $status: TicketStatus!) {
    updateTicketStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      comment {
        id
        content
        createdAt
        user {
          id
          name
          role
        }
      }
      errors
    }
  }
`;

export const ADD_ATTACHMENT = gql`
  mutation AddAttachment($ticketId: ID!, $file: Upload!) {
    addAttachment(ticketId: $ticketId, file: $file) {
      id
      filename
      url
    }
  }
`;

export const GET_TICKETS = gql`
  query GetTickets($page: Int!, $perPage: Int!, $isAgent: Boolean!) {
    tickets(page: $page, perPage: $perPage, isAgent: $isAgent) {
      items {
        id
        title
        description
        status
        createdAt
      }
      totalCount
    }
  }
`;
