import { createApp } from 'vue'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL,
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('authToken')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {}
      }
    }
  }),
  connectToDevTools: import.meta.env.DEV,
  defaultOptions: {
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
})

const app = createApp(App)

app.provide(DefaultApolloClient, apolloClient)

app.use(router)
app.use(store)
app.use(Toast);

app.config.errorHandler = (err) => {
  console.error('Global error:', err)
}

app.mount('#app')
