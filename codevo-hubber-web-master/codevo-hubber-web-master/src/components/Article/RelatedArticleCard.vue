<script setup>
import AuthImage from '@/components/base/AuthImage/AuthImage'
import Tag from '@/components/Article/Tag'
import {computed} from 'vue'
import {useRouter} from "vue-router";

const router = useRouter()

const props = defineProps({
  article: Object,
})

const date = computed(() => (seconds) => {
  const date = new Date(seconds)
  return `${date.getUTCDate()} ${date.toLocaleString('default', {
    month: 'long',
  })} ${date.getFullYear()} ${date.toISOString().substr(11, 5)}`
})

const onArticleDetails = (article) => {
  router.push('/articles/' + article?.id)
}

</script>

<template>
  <div class="related-article-card" v-on:click="onArticleDetails(article)">
    <div class="related-article-card-header">
      <div class="related-article-card-header-tags">
        <tag v-for="tag in article?.tags" :key="tag?.id" :text="tag?.name"/>
      </div>
      <svg
        v-if="article?.attachments?.length > 0"
        class="related-article-card-header-document-icon"
        width="30"
        height="31"
        viewBox="0 0 30 31"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.105 30.684c-1.472 0-3.056-.51-4.48-1.983-2.001-2.071-2.048-4.361-1.735-5.918.349-1.734 1.265-3.16 1.796-3.695l17.04-17.186c1.051-1.055 3.752-2.312 6.444.474 2.695 2.79 1.428 5.53.382 6.589l-11.93 12.031c-.835.843-3.032 3.055-5.181.83-.924-.954-1.147-2.077-.648-3.244.375-.876 1.068-1.575 1.526-2.037L21.556 6.221a.657.657 0 0 1 .944.006c.259.268.256.7-.007.964L12.259 17.514c-.387.39-.97.979-1.243 1.614-.277.648-.162 1.186.375 1.741 1.015 1.051 1.973.49 3.284-.833l11.94-12.04c.207-.216 1.985-2.198-.395-4.661-2.44-2.525-4.473-.547-4.558-.46L4.622 20.058c-.336.34-1.128 1.52-1.425 2.998-.36 1.79.103 3.367 1.377 4.686 3.087 3.195 6.9.677 7.523.05l12.848-12.96a.657.657 0 0 1 .944.007c.259.268.256.7-.006.964l-12.849 12.96c-.76.765-2.716 1.92-4.93 1.92z"
          fill="#A6ACB5"
          fill-rule="evenodd"
        />
      </svg>
    </div>

    <p class="related-article-card-context">
      {{ article?.title }}
    </p>

    <div class="related-article-user">
      <div class="related-article-user-avatar">
        <auth-image :path="article.user.imageUrl" :width="45" :height="45"/>
      </div>

      <div class="related-article-user-info">
        <p class="related-article-user-info-name">
          {{ article.user.shownName }}
        </p>
        <p class="related-article-user-info-date">
          {{ date(article.date) }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.related-article-card {
  padding: 5px 15px 15px 15px;
  border-radius: 20px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
  cursor: pointer;
}

.related-article-card-header {
  display: flex;
  justify-content: space-between;
}

.related-article-card-header-document-icon {
  min-width: 30px;
  min-height: 30px;
  margin-top: 10px;
  margin-bottom: auto;
}

.related-article-card-header-tags > div {
  margin-top: 10px;
  margin-right: 10px;
}

.related-article-card-context {
  margin-top: 17px;
  font-size: 24px;
  font-weight: normal;
  color: var(--primary);
}

.related-article-user {
  display: flex;
  align-items: center;
  margin-top: 17px;
}

.related-article-user-avatar {
  width: 74px;
  height: 74px;
  overflow: hidden;
  border-radius: 17px;
  margin-right: 19px;
}

.related-article-user-info-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text);
}

.related-article-user-info-date {
  font-size: 14px;
  font-weight: 300;
  color: var(--text);
}

@media (max-width: 480px) {
  .related-article-user-avatar {
    min-width: 56px;
    max-width: 56px;
    height: 56px;
  }

  .related-article-card-context {
    font-size: 20px;
  }
}
</style>
