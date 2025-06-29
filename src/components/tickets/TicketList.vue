<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Tickets</h2>
      <button
        v-if="!isAgent"
        class="btn btn-primary"
        @click="showCreateForm = true"
      >
        Create New Ticket
      </button>
      <ExportButton v-if="isAgent" />
    </div>

    <TicketForm
      v-if="showCreateForm"
      @cancel="showCreateForm = false"
      @created="handleTicketCreated"
    />

    <div class="list-group">
      <div v-if="loading" class="text-center my-4">
        <LoadingSpinner />
      </div>
      <router-link
        v-for="ticket in tickets"
        :key="ticket.id"
        :to="`/tickets/${ticket.id}`"
        class="list-group-item list-group-item-action"
      >
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{ ticket.title }}</h5>
          <small :class="statusClass(ticket.status)">{{ ticket.status }}</small>
        </div>
        <p class="mb-1">{{ ticket.description.substring(0, 100) }}...</p>
        <small>Created: {{ formatDate(ticket.createdAt) }}</small>
      </router-link>
    </div>

    <nav v-if="totalPages > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="changePage(currentPage - 1)">
            Previous
          </button>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="changePage(page)">
            {{ page }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="changePage(currentPage + 1)">
            Next
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { GET_TICKETS } from "../../graphql/queries";
import { useQuery } from "@vue/apollo-composable";
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import TicketForm from "./TicketForm.vue";
import ExportButton from "../agents/ExportButton.vue";
import LoadingSpinner from "../shared/LoadingSpinner.vue";

export default {
  components: {
    TicketForm,
    ExportButton,
    LoadingSpinner,
  },
  setup() {
    const store = useStore();
    const showCreateForm = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = 10;

    const isAgent = computed(() => store.getters["auth/userRole"] === "agent");

    const { result, loading, refetch } = useQuery(GET_TICKETS, () => ({
      page: currentPage.value,
      perPage: itemsPerPage,
      isAgent: isAgent.value,
    }));

    const tickets = computed(() => result.value?.tickets.items || []);
    const totalCount = computed(() => result.value?.tickets.totalCount || 0);
    const totalPages = computed(() =>
      Math.ceil(totalCount.value / itemsPerPage)
    );

    watch(isAgent, () => {
      refetch();
    });

    const statusClass = (status) => {
      return {
        "text-success": status === "closed",
        "text-warning": status === "in_progress",
        "text-danger": status === "open",
      };
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString();
    };

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const handleTicketCreated = () => {
      showCreateForm.value = false;
      refetch();
    };

    watch(result, (newVal) => {
      console.log("GraphQL GET_TICKETS result:", newVal);
    });

    watch(loading, (isLoading) => {
      console.log("Loading state:", isLoading);
    });

    return {
      tickets,
      loading,
      totalPages,
      currentPage,
      isAgent,
      showCreateForm,
      statusClass,
      formatDate,
      changePage,
      handleTicketCreated,
    };
  },
};
</script>
