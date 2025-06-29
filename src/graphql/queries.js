import gql from 'graphql-tag'

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

export const GET_TICKET = gql`
query GetTicket($id: ID!) {
  ticket(id: $id) {
    id
    title
    description
    status
    createdAt
    attachments {
      id
      filename
      url
    }
    comments {
      id
      content
      createdAt
      user {
        id
        name
        role
      }
    }
  }
}
`;

export const GET_AGENT_STATS = gql`
  query GetAgentStats {
    agentStats {
      open
      in_progress
      closed
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      name
      email
      role
    }
  }
`;