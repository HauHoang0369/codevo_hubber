<script>
export default {
  name: 'SocialWallPostComment',
}
</script>

<script setup>
import AuthImage from '@/components/base/AuthImage/AuthImage'
import CommentForm from '@/components/SocialWall/CommentForm'
import { ref } from 'vue'
import { format } from '@/utils/day.util'
import SocialWallService from '@/services/SocialWall/SocialWallService'

const props = defineProps({
  comment: Object,
})

const comment = ref(props.comment)
const openComment = ref(false)

const toggleLike = async () => {
  comment.value.like = !comment.value.like
  if (comment.value.like) {
    comment.value.totalLikes += 1
  } else {
    comment.value.totalLikes -= 1
  }

  const fd = new FormData()
  fd.append('id', comment.value.id)

  await new SocialWallService().likeComment(comment.value.id, fd)
}

</script>

<template>
  <div>
    <div class="comment-main">
      <div>
        <div class="comment-user">
          <div class="comment-user-avatar">
            <auth-image :path="comment.user?.imageUrl" :width="74" :height="74" />
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
            <svg @click='toggleLike' :class="{ 'svg-active': comment.like }" width="32" height="30" viewBox="0 0 32 30"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="m14.659 27.954-.872-.793C5.93 20.035.741 15.335.741 9.567c0-4.7 3.693-8.392 8.393-8.392 2.655 0 5.203 1.236 6.866 3.19 1.663-1.954 4.211-3.19 6.866-3.19 4.7 0 8.393 3.693 8.393 8.392 0 5.768-5.188 10.468-13.046 17.61l-.867.782a2 2 0 0 1-2.687-.005z"
                fill="#E2E4E7" fill-rule="evenodd" />
            </svg>
            <p class="comment-reaction-status">{{ comment.totalLikes }}</p>
          </div>

          <div @click="openComment = !openComment" class="ml-20 comment-message-icon">
            <svg :class="{ 'svg-active': openComment }" width="30" height="30" viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 2c8.284 0 15 4.925 15 11 0 3.873-2.73 7.279-6.855 9.239-.021.07-.045.144-.07.22-1.73 5.056-6.639 8.666-5.84 6.015.532-1.767-.592-3.274-3.372-4.52l.038.017C6.13 23.558 0 18.804 0 13 0 6.925 6.716 2 15 2z"
                fill="#A6ACB5" fill-rule="evenodd" />
            </svg>
            <p class="comment-reaction-status">{{ comment.answers.length }}</p>
          </div>
        </div>
      </div>

      <div class="comment-text">{{ comment.text }}</div>
    </div>
    <div class="comment-answers" v-if="comment.answers.sort((a, b) => b.id - a.id) && openComment">
      <CommentForm :comment-id='comment.id' @hide-comment="openComment = false" />
      <SocialWallPostComment v-for="com in comment.answers" :key="com.id" :comment="com" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
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

.comment-user-info {
  width: 181px;
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
  margin-top: 30px;
}

.comment-reaction>div {
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
  padding: 21px 15px;
  border-radius: 20px;
  background-color: var(--background-green);
  color: var(--text);
}

.comment-answers {
  margin-top: 20px;
  margin-left: 93px;

  .comment-text {
    background-color: var(--background-blue);
  }

  .comment-main {
    margin-bottom: 20px;
  }
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
