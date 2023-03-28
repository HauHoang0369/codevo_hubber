<script setup>
import ArticleCard from '@/components/ArticleCard/ArticleCard'
import TopMenu from '@/components/TopMenu/TopMenu'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()

const page = ref(-1)
const articles = ref([])
const more = ref(true)
const isLoading = ref(false)
const channels = computed({
  get() {
    return store.state.articles.channels
  },
})
const channelId = computed({
  get() {
    return store.state.articles.channelId
  },
})

const isFetchingData = computed(() => store.state.loading)

onMounted(async () => {
  await store.dispatch('articles/getChannels', route.params.code)
  store.commit('categories/setPrevCategoryCode', route.params.code)
  if (store.state.articles.channels.length) {
    await getMoreArticles()
  }

  window.onscroll = () => {
    let bottomOfWindow =
      Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
      ) +
      window.innerHeight ===
      document.documentElement.offsetHeight

    if (bottomOfWindow) {
      const cards = document.querySelectorAll('.article-card')
      cards[4]?.scrollIntoView()
      setTimeout(() => {
        getMoreArticles()
      }, 300)
    }
  }
})

watch(
  () => route.path,
  async () => {
    await selectCategory(channelId.value)
  }
)

onUnmounted(() => {
  window.onscroll = null
})

const selectCategory = async (channelId) => {
  store.commit('articles/setChannelId', channelId)
  articles.value = []
  page.value = -1

  await getMoreArticles()
}

const getMoreArticles = async () => {
  if (isLoading.value) return

  if (more) {
    isLoading.value = true
    page.value = page.value + 1

    const moreArticles = await store.dispatch('articles/getArticles', {
      page: page.value,
      hideLoader: true,
    })

    if (moreArticles.length > 0) {
      articles.value = articles.value.concat(moreArticles)
      more.value = moreArticles.length > 9
    }

    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <top-menu :categories="channels" :selectedCategoryId="channelId" @selectCategory="selectCategory" />

    <div class="articles">
      <div v-if='!articles.length && !isLoading && !isFetchingData'>No channel for the chosen category</div>
      <article-card v-else v-for="article in articles" :key="article.id" :article="article" />

      <div class="articles-loading" v-if="isLoading">
        <v-progress-circular indeterminate size="64" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.articles {
  width: 100%;
  margin: 85px auto 20px;
}

.articles .articles-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
