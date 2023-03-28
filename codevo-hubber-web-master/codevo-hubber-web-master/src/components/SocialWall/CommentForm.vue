<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const comment = ref('')
const isLoading = ref(false)

const props = defineProps({
  postId: Number,
  commentId: String
})

const addComment = async () => {
  const params = {
    id: props.postId || props.commentId,
    text: comment.value
  }

  isLoading.value = true
  comment.value = ''
  const result = await store.dispatch('social_wall/addComment', { params, hideLoader: true })
  // Update post total comment
  if (props.postId) {
    await store.commit('social_wall/setComments', result)
    const objIndex = store.state.social_wall.posts.findIndex((obj) => obj.id === props.postId)
    if (objIndex !== -1) {
      store.state.social_wall.posts[objIndex].totalComments += 1
    }
  } else {
    // Update comment answers
    const objIndex = store.state.social_wall.comments.findIndex((obj) => obj.id === props.commentId)
    if (objIndex !== -1) {
      store.state.social_wall.comments[objIndex]['answers'] = result
    }
  }
  isLoading.value = false
}

</script>

<template>
  <div class='comment-add-block'>
    <textarea v-model='comment' cols='50' placeholder='Scrivi un commento' rows='3'></textarea>
    <div class='comment-send'>
      <button :class="{ disabled: isLoading || comment === '' }" :disabled="isLoading || comment === ''"
        class='btn-send' @click.prevent='addComment'>
        Invia
      </button>
      <button class='btn-hide' @click="$emit('hide-comment')">Annulla</button>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.comment-add-block {
  display: flex;
  margin-bottom: 20px;
}

textarea {
  padding: 20px;
  outline: none;
  border-radius: 17px;
  border: solid 1px rgba(105, 158, 255, 0.8);
  color: var(--text);
  width: 100%;
}

textarea::placeholder {
  color: var(--grey-dark);
}

.comment-send {
  margin-left: 26px;
}

.btn-send {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: var(--white);
  text-align: center;
  width: 120px;
  height: 48px;
  border-radius: 24px;
  box-shadow: 0 18px 40px -6px rgba(0, 96, 75, 0.3);
  background: linear-gradient(to top, var(--primary), var(--primary-dark));

  &:disabled {
    opacity: 0.5;
  }
}

.btn-hide {
  margin-top: 16px;
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: var(--primary);
  width: 120px;
  text-align: center;
  padding: 16px 0;
  border-radius: 24px;
}

@media (max-width: 800px) {
  .comment-add-block {
    display: block;
  }

  .comment-send {
    display: flex;
    margin-top: 10px;
    margin-left: 0;
  }

  .btn-hide {
    margin-top: 0;
  }
}
</style>
