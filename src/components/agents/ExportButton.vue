<template>
  <button class="btn btn-secondary" @click="exportClosedTickets" :disabled="loading">
    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Export Closed Tickets
  </button>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async exportClosedTickets() {
  this.loading = true
  try {
    const token = localStorage.getItem('authToken')
    console.log('Using token:', token) // Debug log
    const response = await axios.get('/export/closed_tickets', {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log('Export response:', response) // Debug log
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `closed_tickets_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  } catch (err) {
    console.error('Export failed:', err.response) // More detailed error logging
    alert(`Export failed: ${err.response?.data?.error || err.message}`)
  } finally {
    this.loading = false
  }
}
  }
}
</script>
