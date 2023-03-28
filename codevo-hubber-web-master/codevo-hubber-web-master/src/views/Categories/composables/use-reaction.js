import { useStore } from 'vuex'

export const useReaction = () => {
  const store = useStore()

  const addComment = ({ id, comment }) =>
    store.dispatch('articles/addComment', { id, comment }).then(() => {
      const article = store.getters['articles/getCurrentArticle']
      return store.dispatch('articles/callArticleComments', article.id)
    })

  const toggleLike = (id) => store.dispatch('articles/like', { id })

  return {
    addComment,
    toggleLike,
  }
}
