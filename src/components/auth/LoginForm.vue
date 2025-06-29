<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">Login</div>
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" v-model="email" required>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" v-model="password" required>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'     
import { LOGIN_USER } from '../../graphql/mutations'

const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

const router = useRouter()
const store = useStore()
const toast = useToast()  

const { mutate } = useMutation(LOGIN_USER)

async function handleSubmit() {
  loading.value = true
  error.value = null
  try {
    const result = await mutate({
      input: {
        email: email.value,
        password: password.value
      }
    })

    console.log('GraphQL mutation result:', result)

    if (result.errors && result.errors.length > 0) {
      const msg = result.errors[0].message || 'Login failed'
      error.value = msg
      toast.error(msg)         
      return
    }

    const loginResult = result.data?.loginUser

    if (!loginResult) {
      error.value = 'Unexpected server response'
      toast.error('Unexpected server response')
      return
    }

    if (loginResult.errors && loginResult.errors.length > 0) {
      const msg = loginResult.errors[0] || 'Login failed'
      error.value = msg
      toast.error(msg)
      return
    }

    if (!loginResult.token || !loginResult.user) {
      error.value = 'Login failed'
      toast.error('Login failed')
      return
    }

    const token = loginResult.token
    const user = loginResult.user

    localStorage.setItem('authToken', token)
    store.commit('auth/setToken', token)
    store.commit('auth/setUser', user)

    toast.success(`Welcome back, ${user.name}!`) 

    router.push('/dashboard')

  } catch (err) {
    console.error('GraphQL mutation error:', err)
    const msg = err.message || 'Login failed'
    error.value = msg
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

