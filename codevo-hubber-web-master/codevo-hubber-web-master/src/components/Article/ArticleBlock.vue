<script setup>
import AuthImage from '@/components/base/AuthImage/AuthImage'
import Tag from '@/components/Article/Tag'
import CommentAdd from '@/components/Article/CommentAdd'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { format } from '@/utils/day.util'
import BaseIcon from '@/components/base/icons/BaseIcon.vue'
import { useReaction } from '@/views/Categories/composables/use-reaction'

const openComment = ref(false)

const route = useRoute()
const store = useStore()

const article = computed(() => store.getters['articles/getCurrentArticle'])

const createdDate = computed(() => format(article.date))

const { addComment, toggleLike } = useReaction()
const onAddComment = (comment) => addComment({ id: route.params.id, comment })

const likeArticle = () =>
  toggleLike(article.value.id).then(() =>
    store.dispatch('articles/callArticle', article.value.id)
  )

const totalComments = computed(
  () => (store.getters['articles/getCommentsArticle'] || []).length
)
</script>

<template>
  <div class="article-detail" v-if="article.title">
    <div class="article-detail-title">
      <h1>{{ article.title }}</h1>

      <auth-image
        class="article-detail-title-cover-image"
        :path="article.coverImage.url"
      />
    </div>

    <div class="p-30">
      <div class="article-detail-header">
        <div class="article-detail-user">
          <div class="article-detail-user-avatar">
            <auth-image
              :path="article.user.imageUrl"
              :width="74"
              :height="74"
            />
          </div>

          <div class="article-detail-user-info">
            <p class="article-detail-user-info-name">
              {{ article.user.shownName }}
            </p>
            <p class="article-detail-user-info-date">
              {{ createdDate }}
            </p>
          </div>
        </div>
      </div>

      <div class="article-detail-text" v-html="article.text" />

      <div class="article-detail-line" />

      <div class="article-detail-documents">documents</div>

      <div class="flex-justify-between pb-30">
        <div class="article-detail-tags">
          <tag v-for="tag in article.tags" :key="tag.id" :text="tag.name" />
        </div>

        <div class="article-detail-reaction">
          <base-icon
            name="heart"
            @click="likeArticle"
            :color="article.totalLikes ? '#00604b' : '#A6ACB5'"
          >
            <p class="article-detail-reaction-status">
              {{ article.totalLikes }}
            </p>
          </base-icon>

          <base-icon
            name="comment"
            @click="openComment = !openComment"
            class="ml-20"
            :color="openComment ? '#00604b' : '#A6ACB5'"
          >
            <p class="article-detail-reaction-status">
              {{ totalComments }}
            </p>
          </base-icon>

          <base-icon name="share" class="ml-20"></base-icon>
        </div>
      </div>

      <comment-add
        v-if="openComment"
        @hide-comment="openComment = false"
        @add-comment="onAddComment"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-detail {
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);

  .article-detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .article-detail-title {
    position: relative;
    height: 392px;
    max-height: 392px;
    overflow: hidden;
    border-radius: 30px 30px 0 0;

    > h1 {
      position: absolute;
      top: 30px;
      left: 30px;
      z-index: 10;
      font-size: 50px;
      font-weight: bold;
      line-height: 1.2;
      letter-spacing: normal;
      color: var(--white);
    }

    .article-detail-title-cover-image {
      width: 100%;
      object-fit: cover;
    }
  }

  .article-detail-user {
    display: flex;
    align-items: center;

    .article-detail-user-avatar {
      width: 74px;
      height: 74px;
      overflow: hidden;
      border-radius: 17px;
      margin-right: 19px;
    }

    .article-detail-user-info-name {
      font-size: 16px;
      font-weight: bold;
      color: var(--text);
    }

    .article-detail-user-info-date {
      font-size: 14px;
      font-weight: normal;
      margin-top: 7px;
      color: var(--text);
    }
  }

  .article-detail-text {
    overflow: hidden;
    margin: 30px 0 60px 0;
  }

  .article-detail-line {
    width: 100%;
    height: 1px;
    margin: 0 0 29px;
    border: solid 1px rgba(165, 165, 165, 0.2);
  }

  .article-detail-documents {
    margin-bottom: 15px;
  }

  .flex-justify-between {
    display: flex;
    justify-content: space-between;
  }

  .article-detail-tags > div {
    margin-top: 10px;
    margin-right: 9.6px;
  }

  .article-detail-reaction {
    display: flex;
    align-items: center;
  }

  .article-detail-reaction > div {
    display: flex;
    align-items: center;
  }

  .article-detail-reaction svg {
    cursor: pointer;
  }

  .article-detail-reaction-status {
    font-size: 14px;
    font-weight: normal;
    color: var(--text);
    margin-left: 9px;
  }

  .pb-30 {
    padding-bottom: 30px;
  }

  .p-30 {
    padding: 30px;
  }

  .ml-20 {
    margin-left: 20px;
  }

  @media (max-width: 800px) {
    .article-detail-title > h1 {
      font-size: 40px;
    }
  }

  @media (max-width: 480px) {
    .flex-justify-between {
      display: block;
    }
    .article-detail-reaction {
      margin-top: 20px;
    }
    .article-detail-title > h1 {
      font-size: 30px;
    }
    .article-detail-user-avatar {
      height: 56px;
      width: 56px;
    }
  }

  .article-detail-reaction svg path:hover {
    fill: var(--grey-dark);
  }

  .svg-active path {
    fill: var(--primary-dark);
  }
}
</style>
