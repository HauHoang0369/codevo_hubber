<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import IconShare from '@/assets/icons/icon-system-share@2x.png'
import IconPublic from '@/assets/icons/icon-system-public@2x.png'
import IconFriendSel from '@/assets/icons/icon-system-friends-sel.png'
import IconFriend from '@/assets/icons/icon-system-friends.png'
import IconMarket from '@/assets/icons/icon-system-market@2x.png'
import IconGroup from '@/assets/icons/visibility-3people.svg'
import AuthImage from '@/components/base/AuthImage/AuthImage.vue'
import { CommentIcon, StarIcon } from '@/components/base/icons'
import { format } from '@/utils/day.util'
import Chip from '@/components/base/buttons/Chip.vue'
import {
  CommentForm,
  DropdownActions,
  SocialWallPostComment,
} from '@/components/SocialWall'
import BaseIcon from '../base/icons/BaseIcon.vue'

const emit = defineEmits(['click', 'profile', 'like', 'comments', 'share'])

const store = useStore()
const props = defineProps({
  data: Object,
  permissions: Object,
})

const openComment = ref(false)
const seeMore = ref(false)

const user = computed(() => store.state.user)
// eslint-disable-next-line vue/no-side-effects-in-computed-properties
const comments = computed(() =>
  store.state.social_wall.comments.sort((a, b) => b.id - a.id)
)
const commentPostId = computed(() => store.state.social_wall.commentPostId)
const post = computed(() => props.data)

const onClick = () => {
  emit('click', post.id)
}

const onLike = () => {
  emit('like')
}

const onShare = () => {
  emit('share', post.id)
}

const onProfile = () => {
  emit('profile', post.username)
}

const showComments = async (postId) => {
  seeMore.value = false
  if (commentPostId.value !== postId) {
    // Open different post comment
    openComment.value = true
    store.commit('setLoading', true)
    await store.dispatch('social_wall/getComments', { postId })
    store.commit('social_wall/setCommentPostId', postId)
    store.commit('setLoading', false)
  } else {
    // Toggle opening post comment (same post)
    openComment.value = !openComment.value
  }
}
</script>

<template>
  <div>
    <v-card class="post-card" v-on:click.prevent="onClick">
      <div
        class="post-card-header d-flex flex-row justify-space-between align-center"
      >
        <div class="flex-row d-flex align-center">
          <div class="post-sender-image" v-on:click.stop="onProfile">
            <AuthImage :path="post.user?.imageUrl" />
          </div>
          <div class="d-flex flex-column ml-5">
            <div class="post-sender">
              {{ post.user?.shownName }}
            </div>
            <div class="post-visibility mt-2 d-flex flex-row align-center">
              <div class="post-time">
                {{ format(post.date, 'DD MMM YYYY, HH:mm') }}
              </div>
              <div class="d-flex">
                <img
                  v-if="post.visibility === 'PUBLIC'"
                  :src="IconPublic"
                  alt="Public"
                  class="small-icon ml-2"
                />
                <img
                  v-else-if="post.visibility === 'FRIENDS'"
                  :src="IconFriend"
                  alt="Friends"
                  class="small-icon ml-2"
                />
                <img
                  v-else-if="post.visibility === 'SELECTEDUSERS'"
                  :src="IconFriendSel"
                  alt="Selected users"
                  class="small-icon ml-2"
                />
                <img
                  v-else-if="post.visibility === 'GROUPS'"
                  :src="IconGroup"
                  alt="Groups"
                  class="small-icon ml-2"
                />
                <img
                  v-else-if="post.visibility === 'MARKETS'"
                  :src="IconMarket"
                  alt="Markets"
                  class="small-icon ml-2"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="icon-system-dropdown d-flex align-center">
          <StarIcon v-if="post.highlighted" class="mr-2" :starred="true" />
          <DropdownActions :post="data" />
        </div>
      </div>
      <div
        v-if="post.coverImage && post.coverImage.url"
        class="post-card-image"
      >
        <AuthImage :path="post.coverImage.url" :width="700" :height="700" />
      </div>
      <div v-if="post.text" class="post-card-text">
        <div v-html="post.text"></div>
      </div>
      <div v-if="post.tags?.length > 0" class="post-card-tags">
        <Chip
          v-for="(tag, index) in post.tags"
          :key="index"
          class="pa-2 elevation-5 rounded-pill ml-3"
        >
          <span class="type-chip-label">{{ tag.name }}</span>
        </Chip>
      </div>
      <div
        class="post-card-actions d-flex flex-row justify-space-between align-center"
      >
        <div class="flex-row d-flex align-center">
          <div v-on:click.stop="onLike">
            <svg
              :class="{ 'svg-active': post.like }"
              width="32"
              height="30"
              viewBox="0 0 32 30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m14.659 27.954-.872-.793C5.93 20.035.741 15.335.741 9.567c0-4.7 3.693-8.392 8.393-8.392 2.655 0 5.203 1.236 6.866 3.19 1.663-1.954 4.211-3.19 6.866-3.19 4.7 0 8.393 3.693 8.393 8.392 0 5.768-5.188 10.468-13.046 17.61l-.867.782a2 2 0 0 1-2.687-.005z"
                fill="#E2E4E7"
                fill-rule="evenodd"
              />
            </svg>
            <span class="ml-2 text-text">
              {{ post.totalLikes }}
            </span>
          </div>
          <div class="ml-5" @click="showComments(post.id)">
            <CommentIcon
              :path-color="
                openComment && commentPostId === post.id
                  ? 'var(--primary)'
                  : 'var(--grey-dark)'
              "
            />
            <span class="ml-2 text-text">
              {{ post.totalComments }}
            </span>
          </div>
        </div>
        <div v-if="user?.id !== post.user?.id" v-on:click.stop="onShare">
          <img :src="IconShare" alt="Share" class="icon" />
        </div>
      </div>
      <div v-if="openComment && post.id === commentPostId" class="comment-form">
        <CommentForm :post-id="post.id" @hide-comment="openComment = false" />
      </div>
    </v-card>
    <div
      v-if="openComment && post.id === commentPostId && comments.length"
      class="comments-block"
    >
      <div class="d-flex justify-space-between align-center">
        <h1 class="comments-title">Commenti</h1>
        <p class="see-more-text" @click="seeMore = !seeMore">
          <BaseIcon
            v-if="seeMore"
            color="var(--primary)"
            height="20"
            name="ChevronUp"
            width="20"
          >
            <template #left>Mostra meno</template>
          </BaseIcon>

          <BaseIcon
            v-else
            color="var(--primary)"
            height="20"
            name="ChevronDown"
            width="20"
          >
            <template #left>Vedi altri</template>
          </BaseIcon>
        </p>
      </div>
      <div class="comment-list">
        <div v-if="seeMore">
          <SocialWallPostComment
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            class="comment-content-block"
          />
        </div>
        <div v-else>
          <SocialWallPostComment
            v-for="comment in [comments[0]]"
            :key="comment.id"
            :comment="comment"
            class="comment-content-block"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.svg-active path {
  fill: var(--primary-dark);
}

.icon {
  height: 30px;
  width: 30px;
}

svg.icon > path {
  fill: red;
}

.post-card {
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
}

.post-card-header {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
}

.post-sender-image {
  width: 74px;
  height: 74px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 17px;
  }
}

.post-visibility {
  div {
    line-height: normal;
  }

  .post-time {
    font-size: 12px;
    color: var(--text);
  }
}

.post-sender {
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--primary);
}

.post-card-image {
  width: 100%;
  min-height: 468px;
  background-color: var(--alto);
  margin-top: 20px;
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.post-card-image img {
  object-fit: cover;
  display: block;
  position: absolute;
  min-height: 100%;
  min-width: 100%;
}

.post-card-text {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;

  div {
    color: var(--text);
    font-size: 16px;
  }
}

.post-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 20px 20px 0;

  .type-chip-label {
    white-space: nowrap;
  }
}

.post-card-actions {
  padding: 20px;
}

.small-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.comment-form {
  margin-top: 6px;
  padding: 0 21px 19px 24px;
}

.comments-block {
  margin-top: 16px;
  margin-bottom: 40px;
  padding: 30px 20px 21px 30px;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba($color-grey-teal, 0.3);
  background-color: var(--white);

  h1.comments-title {
    color: var(--primary);
    font-size: 30px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
  }

  .comment-list {
    padding-right: 10px;
    margin-top: 30px;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 7.5px;
      background-color: var(--grey);
    }
  }

  .article-comments-title {
    margin-bottom: 30px;
    font-size: 30px;
    font-weight: normal;
    line-height: 40px;
    letter-spacing: normal;
    color: var(--primary);
  }

  .see-more-text {
    height: 19px;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: right;
    color: var(--primary);
  }

  .comment-content-block:not(:last-child) {
    padding-bottom: 32px;
    margin-bottom: 32px;
    border-bottom: solid 1px rgba(165, 165, 165, 0.2);
  }
}
</style>
