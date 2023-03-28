import { ref } from 'vue'

export const useLoadMore = () => {
  const page = ref(0)
  const content = ref([])

  const setContent = ({ first, last, content: data }) => {
    if (first) {
      content.value = data
    } else {
      content.value = [...content.value, ...data]
    }

    if (!last) {
      // not last page
      page.value++
    }
  }

  return {
    page,
    content,
    setContent,
  }
}
