import { createStore } from 'vuex'
import auth from './auth'
import tickets from './tickets'

export default createStore({
  modules: {
    auth,
    tickets
  }
})