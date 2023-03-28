<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add-comment', 'hide-comment'])

const comment = ref('')
const addComment = () => {
  emit('add-comment', comment.value)
  comment.value = ''
}
</script>

<template>
  <div class="comment-add-block">
    <textarea
      rows="4"
      cols="50"
      v-model="comment"
      placeholder="Scrivi un commento"
    ></textarea>
    <div class="comment-send">
      <button class="btn-send" @click="addComment" :disabled="!comment">
        Invia
      </button>
      <button class="btn-hide" @click="$emit('hide-comment')">Annulla</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment-add-block {
  display: flex;
  margin: 30px 0;
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
  width: 181px;
  text-align: center;
  padding: 16px 0px;
  border-radius: 24px;
  box-shadow: 0 18px 40px -6px rgba(0, 96, 75, 0.3);
  background: linear-gradient(to top, var(--primary), var(--primary-dark));

  &:disabled,
  &[disabled] {
    opacity: 0.5;
  }
}

.btn-hide {
  margin-top: 16px;
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: var(--primary);
  width: 181px;
  text-align: center;
  padding: 16px 0px;
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
  .btn-hide,
  .btn-send {
    padding: 7px 5px;
    min-width: 90px;
  }
}
</style>
