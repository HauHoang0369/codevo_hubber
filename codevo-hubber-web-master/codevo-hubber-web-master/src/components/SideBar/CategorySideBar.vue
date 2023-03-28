<script>
export default {
  name: 'CategorySideBar'
}
</script>

<template>
  <ul class='mt-12 sidebar-links submenu'>
    <li v-for='(link, idx) in currentLinks' :key='idx'>
      <router-link :to='link.to' class='router-link'>
        <div class='menu-item'>
          <span class='menu-item-title'>{{ link.translate ? $t(link.translate) : link.text }}</span>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const listCategories = computed(() => store.getters['categories/getCategories'])
const currentLinks = ref([])

onMounted(async () => {
  if (!listCategories.value.length) {
    await store.dispatch('categories/callCategories')
  }

  listCategories.value.forEach((v) => {
    currentLinks.value.push({
      to: `/Categories/${v.code}`,
      text: v.name
    })
  })
})

</script>

<style lang='scss'>

</style>
