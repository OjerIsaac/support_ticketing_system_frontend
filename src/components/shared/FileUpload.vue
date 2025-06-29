<template>
  <div>
    <input type="file" class="form-control" multiple @change="handleFileChange" ref="fileInput" />
    <small class="text-muted">Max file size: 5MB. Allowed types: images and PDFs.</small>
  </div>
</template>

<script>
export default {
  name: 'FileUpload',
  methods: {
    handleFileChange(event) {
      const files = Array.from(event.target.files)
      const validFiles = files.filter(file => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
        const maxSize = 5 * 1024 * 1024 // 5MB
        return validTypes.includes(file.type) && file.size <= maxSize
      })
      
      if (validFiles.length !== files.length) {
        alert('Some files were invalid. Only images and PDFs under 5MB are allowed.')
      }
      
      if (validFiles.length > 0) {
        this.$emit('files-selected', validFiles)
      }
      
      this.$refs.fileInput.value = '' // Reset input
    }
  }
}
</script>