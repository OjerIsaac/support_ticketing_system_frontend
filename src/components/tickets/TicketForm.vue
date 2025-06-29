<template>
  <div class="card mb-4">
    <div class="card-header">Create New Ticket</div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="subject" class="form-label">Subject</label>
          <input type="text" class="form-control" id="subject" v-model="form.subject" required>
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea class="form-control" id="description" rows="5" v-model="form.description" required></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Attachments</label>
          <FileUpload @files-selected="handleFilesSelected" />
          <div v-if="form.attachments.length > 0" class="mt-2">
            <div v-for="(file, index) in form.attachments" :key="index" class="d-flex align-items-center mb-2">
              <span class="me-2">{{ file.name }}</span>
              <button type="button" class="btn btn-sm btn-danger" @click="removeAttachment(index)">
                &times;
              </button>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-secondary me-2" @click="$emit('cancel')">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Submit Ticket
          </button>
        </div>
        <p v-if="error" class="text-danger mt-2">{{ error }}</p>
        <p v-if="error" class="text-danger mt-2">{{ error }}</p>
        <p v-if="success" class="text-success mt-2">{{ success }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { CREATE_TICKET } from '../../graphql/mutations'
import FileUpload from '../shared/FileUpload.vue'
import { useRouter } from 'vue-router'

const form = ref({
  subject: '',
  description: '',
  attachments: []
})

const loading = ref(false)
const error = ref(null)
const success = ref(null)

const router = useRouter()

const { mutate } = useMutation(CREATE_TICKET)

function handleFilesSelected(files) {
  form.value.attachments = [...form.value.attachments, ...files]
}

function removeAttachment(index) {
  form.value.attachments.splice(index, 1)
}

async function handleSubmit() {
  loading.value = true
  error.value = null
  success.value = null

  try {
    const response = await mutate({
      input: {
        title: form.value.subject,
        description: form.value.description,
        attachmentIds:
          form.value.attachments.length > 0
            ? form.value.attachments.map((f) => f.id)
            : []
      }
    })

    // Top-level GraphQL errors
    if (response.errors && response.errors.length > 0) {
      error.value = response.errors[0].message
      return
    }

    const result = response.data?.createTicket

    if (!result) {
      error.value = 'Unexpected server response (no ticket data)'
      return
    }
    
    if (result.errors && result.errors.length > 0) {
      error.value = result.errors[0]
      return
    }

    // Success
    success.value = 'Ticket created successfully!'

    // Option 1: Navigate to TicketList
    router.push('/tickets')

    // Option 2: Emit an event (uncomment if you prefer)
    // emit('created', result.ticket)

    // Reset form
    form.value = {
      subject: '',
      description: '',
      attachments: []
    }

  } catch (err) {
    console.error('Mutation error:', err)
    error.value = err.message || 'Failed to create ticket'
  } finally {
    loading.value = false
  }
}
</script>


