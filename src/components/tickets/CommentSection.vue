<template>
  <div class="card">
    <div class="card-header">Comments</div>
    <div class="card-body">
      <div v-if="comments.length === 0" class="text-muted">
        No comments yet.
      </div>
      <div v-else>
        <div v-for="comment in comments" :key="comment.id" class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <strong>{{ comment.user.name }}</strong>
            <small class="text-muted">{{ formatDate(comment.createdAt) }}</small>
          </div>
          <div class="card">
            <div class="card-body">
              <p class="mb-0">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="canComment" class="mt-4">
        <form @submit.prevent="submitComment">
          <div class="mb-3">
            <label for="comment" class="form-label">Add Comment</label>
            <textarea
              class="form-control"
              id="comment"
              rows="3"
              v-model="newComment"
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Post Comment
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { CREATE_COMMENT } from '../../graphql/mutations'

const props = defineProps({
  ticketId: {
    type: String,
    required: true
  },
  comments: {
    type: Array,
    default: () => []
  },
  canComment: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['comment-added'])

const newComment = ref('')
const loading = ref(false)
const toast = useToast() // Optional toast

function formatDate(dateString) {
  return new Date(dateString).toLocaleString()
}

const { mutate } = useMutation(CREATE_COMMENT)

async function submitComment() {
  if (!newComment.value.trim()) return
  loading.value = true
  try {
    const result = await mutate({
      ticketId: props.ticketId,
      content: newComment.value
    })

    const created = result?.data?.createComment?.comment
    if (created) {
      emit('comment-added', created)
      newComment.value = ''
      toast.success('Comment posted successfully')
    } else {
      toast.error('Failed to post comment')
    }
  } catch (err) {
    console.error('Failed to add comment:', err)
    toast.error('Error posting comment')
  } finally {
    loading.value = false
  }
}
</script>
