<template>
  <button class="btn btn-secondary" @click="exportClosedTickets" :disabled="loading">
    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Export Closed Tickets
  </button>
</template>

<script>
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
        const response = await axios.get('/export/closed_tickets', {
          responseType: 'blob'
        })
        
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'closed_tickets.csv')
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
      } catch (err) {
        console.error('Export failed:', err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>