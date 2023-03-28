<script setup>
import ArticleForm from '@/components/NewArticle/ArticleForm'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const sendData = (fd) => {
  store.dispatch('articles/createArticle', fd).then(() => {
    router.push('/categories/ARTICLE')
  })
}
</script>

<template>
  <ArticleForm @send-data="sendData" />
</template>
