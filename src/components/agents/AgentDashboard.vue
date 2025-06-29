<template>
  <div>
    <h2 class="mb-4">Agent Dashboard</h2>
    
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card text-white bg-danger">
          <div class="card-body">
            <h5 class="card-title">Open Tickets</h5>
            <p class="card-text display-4">{{ stats.open }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-white bg-warning">
          <div class="card-body">
            <h5 class="card-title">In Progress</h5>
            <p class="card-text display-4">{{ stats.in_progress }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-white bg-success">
          <div class="card-body">
            <h5 class="card-title">Closed (Last 30 days)</h5>
            <p class="card-text display-4">{{ stats.closed }}</p>
          </div>
        </div>
      </div>
    </div>

    <TicketList />
  </div>
</template>

<script>
import { GET_AGENT_STATS } from '../../graphql/queries'
import { useQuery } from '@vue/apollo-composable'
import TicketList from '../tickets/TicketList.vue'

export default {
  components: {
    TicketList
  },
  setup() {
    const { result } = useQuery(GET_AGENT_STATS)
    const stats = computed(() => result.value?.agentStats || {
      open: 0,
      in_progress: 0,
      closed: 0
    })

    return {
      stats
    }
  }
}
</script>