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
            <p v-if="error" class="text-danger mt-2">{{ error }}</p>
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
import { LOGIN_USER } from '../../graphql/mutations'

const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

const router = useRouter()
const store = useStore()

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
      error.value = result.errors[0].message
      return
    }

    const loginResult = result.data?.loginUser

    if (!loginResult) {
      error.value = 'Unexpected server response'
      return
    }

    if (loginResult.errors && loginResult.errors.length > 0) {
      error.value = loginResult.errors[0]
      return
    }


    if (!loginResult.token || !loginResult.user) {
      error.value = 'Login failed'
      return
    }

    const token = loginResult.token
    const user = loginResult.user

    localStorage.setItem('authToken', token)
    store.commit('auth/setToken', token)
    store.commit('auth/setUser', user)

    router.push('/tickets')

  } catch (err) {
    console.error('GraphQL mutation error:', err)
    error.value = err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}

</script>
