export default {
  state: {
    tickets: [],
    currentTicket: null
  },
  mutations: {
    setTickets(state, tickets) {
      state.tickets = tickets
    },
    setCurrentTicket(state, ticket) {
      state.currentTicket = ticket
    },
    addComment(state, comment) {
      if (state.currentTicket) {
        state.currentTicket.comments.push(comment)
      }
    }
  },
  getters: {
    allTickets(state) {
      return state.tickets
    },
    currentTicket(state) {
      return state.currentTicket
    }
  }
}