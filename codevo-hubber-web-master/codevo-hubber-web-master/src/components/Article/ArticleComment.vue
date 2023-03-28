<script>
export default {
  name: 'ArticleComment',
}
</script>

<script setup>
import AuthImage from '@/components/base/AuthImage/AuthImage'
import CommentAdd from '@/components/Article/CommentAdd'
import { ref } from 'vue'
import { format } from '@/utils/day.util'
import { useReaction } from '@/views/Categories/composables/use-reaction'
import BaseIcon from '@/components/base/icons/BaseIcon.vue'
import { useStore } from 'vuex'

const props = defineProps({
  comment: Object,
})

const store = useStore()

const openComment = ref(false)

const { addComment, toggleLike } = useReaction()
const replyComment = (com) => addComment({ id: props.comment.id, comment: com })

const likeArticle = () => {
  toggleLike(props.comment.id).then(() => {
    const article = store.getters['articles/getCurrentArticle']
    return store.dispatch('articles/callArticleComments', article.id)
  })
}
</script>

<template>
  <div>
    <div class="comment-main">
      <div>
        <div class="comment-user">
          <div class="comment-user-avatar">
            <auth-image
              :path="comment.user.imageUrl"
              :width="74"
              :height="74"
            />
          </div>

          <div class="comment-user-info">
            <p class="comment-user-info-name">
              {{ comment.user.shownName }}
            </p>
            <p class="comment-user-info-date">
              {{ format(comment.date) }}
            </p>
          </div>
        </div>

        <div class="comment-reaction">
          <div>
            <base-icon
              @click="likeArticle"
              name="heart"
              :color="comment.totalLikes ? '#00604b' : '#A6ACB5'"
            >
              <p class="comment-reaction-status">{{ comment.totalLikes }}</p>
            </base-icon>
          </div>

          <div
            @click="openComment = !openComment"
            class="ml-20 comment-message-icon"
          >
            <base-icon
              name="comment"
              :color="openComment ? '#00604b' : '#A6ACB5'"
            >
              <p class="comment-reaction-status">
                {{ comment.answers.length }}
              </p>
            </base-icon>
          </div>
        </div>
      </div>

      <div class="comment-text">{{ comment.text }}</div>
    </div>
    <div class="comment-answers" v-if="comment.answers && openComment">
      <CommentAdd
        @add-comment="replyComment"
        @hide-comment="openComment = false"
      />
      <ArticleComment
        v-for="com in comment.answers"
        :key="com.id"
        :comment="com"
      />
    </div>
  </div>
</template>

<style type="text/css" scoped>
.comment-main {
  display: flex;
}

.comment-user {
  display: flex;
  align-items: center;
}

.comment-user-avatar {
  width: 74px;
  height: 74px;
  overflow: hidden;
  border-radius: 17px;
  margin-right: 19px;
}

.comment-answers .comment-user-avatar {
  min-width: 56px;
  max-width: 56px;
  height: 56px;
}

.comment-answers .comment-message-icon {
  display: none;
}

.comment-user-info-name {
  font-size: 16px;
  font-weight: bold;
  color: var(--text);
}

.comment-user-info-date {
  font-size: 14px;
  font-weight: normal;
  margin-top: 7px;
  color: var(--text);
}

.comment-reaction {
  display: flex;
  align-items: center;
  margin-bottom: auto;
  margin-top: 10px;
}

.comment-reaction > div {
  display: flex;
  align-items: center;
}

.comment-reaction svg {
  cursor: pointer;
}

.comment-reaction-status {
  font-size: 14px;
  font-weight: normal;
  color: var(--text);
  margin-left: 9px;
}
.ml-20 {
  margin-left: 20px;
}

.comment-text {
  margin-bottom: auto;
  width: 100%;
  max-width: 822px;
  margin-left: 40px;
  padding: 21px 30px;
  border-radius: 20px;
  background-color: var(--background-green);
  color: var(--text);
}

.comment-answers {
  margin-top: 30px;
  margin-left: 60px;
}
@media (max-width: 1360px) {
  .comment-text {
    width: 60%;
  }
}
@media (max-width: 850px) {
  .comment-main {
    display: block;
  }
  .comment-text {
    margin-top: 10px;
    margin-left: 0;
    width: 100%;
  }
}

@media (max-width: 500px) {
  .comment-answers {
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .comment-user-avatar {
    min-width: 56px;
    max-width: 56px;
    height: 56px;
    margin-right: 7px;
  }
}

.comment-reaction svg path:hover {
  fill: #a6acb5;
}

.svg-active path {
  fill: var(--primary-dark);
}
</style>
