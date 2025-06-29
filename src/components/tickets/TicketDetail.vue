<template>
  <div>
    <LoadingSpinner v-if="loading" />

    <div v-else-if="ticket" class="ticket-details">
      <h1>{{ ticket.title }}</h1>
      <p>{{ ticket.description }}</p>
      <p>
        <strong>Status:</strong>
        <span :class="statusBadgeClass">{{ ticket.status }}</span>
      </p>
      <p><strong>Created at:</strong> {{ formatDate(ticket.createdAt) }}</p>

      <div class="actions" v-if="userRole === 'agent'">
        <button @click="updateStatus('in_progress')">Mark In Progress</button>
        <button @click="updateStatus('closed')">Close Ticket</button>
      </div>

      <CommentSection
        v-if="canComment"
        :ticketId="ticket.id"
        :comments="ticket.comments"
      />
    </div>

    <div v-else>
      <p>No ticket found.</p>
    </div>
  </div>
</template>

<script>
import { GET_TICKET } from '../../graphql/queries'
import { UPDATE_TICKET_STATUS } from '../../graphql/mutations'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import CommentSection from './CommentSection.vue'
import LoadingSpinner from '../shared/LoadingSpinner.vue'

export default {
  components: {
    CommentSection,
    LoadingSpinner
  },
  setup() {
  const route = useRoute();
  const store = useStore();
  const ticketId = route.params.id;

  const { result, loading } = useQuery(GET_TICKET, { id: ticketId });
  const ticket = computed(() => result.value?.ticket || null);

  const userRole = computed(() => store.getters["auth/userRole"]);
  const userId = computed(() => store.getters["auth/userId"]);

  const canComment = computed(() => {
    if (!ticket.value) return false;
    console.log("DEBUG userRole =", userRole.value);
    if (userRole.value === "agent") return true;
    return ticket.value.comments.some(comment => comment.user.role === "agent");
  });

  const statusBadgeClass = computed(() => {
    if (!ticket.value) return "";
    return {
      "bg-success": ticket.value.status === "closed",
      "bg-warning": ticket.value.status === "in_progress",
      "bg-danger": ticket.value.status === "open"
    };
  });

  const { mutate: updateStatusMutation } = useMutation(UPDATE_TICKET_STATUS);

  const formatDate = dateString => new Date(dateString).toLocaleString();

  const updateStatus = async status => {
    try {
      await updateStatusMutation({
        id: ticketId,
        status: status
      });
    } catch (err) {
      console.error("Failed to update ticket status:", err);
    }
  };

  return {
    ticket,
    loading,
    userRole,
    canComment,
    statusBadgeClass,
    formatDate,
    updateStatus
  };
}

}
</script>

<style scoped>
.ticket-details {
  padding: 1rem;
}
.bg-success {
  background-color: #28a745;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}
.bg-warning {
  background-color: #ffc107;
  color: black;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}
.bg-danger {
  background-color: #dc3545;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}
.actions button {
  margin-right: 0.5rem;
}
</style>
