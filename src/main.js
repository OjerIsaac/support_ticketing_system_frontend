import { createApp } from 'vue'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './App.vue'
import router from './router'
import store from './store' 
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
  // credentials: 'same-origin'
})

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: { }
    }
  }
})

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  connectToDevTools: import.meta.env.DEV
})

const app = createApp(App)

app.provide(DefaultApolloClient, apolloClient)

apolloClient.defaultOptions = {
  watchQuery: {
    errorPolicy: 'all'
  },
  query: {
    errorPolicy: 'all'
  },
  mutate: {
    errorPolicy: 'all'
  }
}

app.use(router)
app.use(store) 

app.config.errorHandler = (err) => {
  console.error('Global error:', err)
}

app.mount('#app')
