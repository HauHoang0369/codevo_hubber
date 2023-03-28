<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import AuthImage from '@/components/base/AuthImage/AuthImage'
import Swal from 'sweetalert2';

const router = useRouter()
const store = useStore()
const categories = ref([])

onMounted(async () => {
  await store.dispatch('categories/callCategories')
  const _categories = await store.getters['categories/getCategories']

  if (_categories.length === 0) {
    Swal.fire({
      icon: 'warning',
      titleText: 'Nessun canale disponibile',
      customClass: {
        popup: 'hubber-swal-popup'
      },
    })
  } else {
    categories.value = _categories
  }
})

const goCategoryPage = (code) => {
  router.push(`Categories/${code}`)
}
</script>

<template>
  <div class="categories">
    <div
      v-for="category in categories"
      :key="category.id"
      class="category"
      @click="goCategoryPage(category.code)"
    >
      <div class="category-content">
        <AuthImage
          v-if="category.backgroundImageUrl"
          :path="category.backgroundImageUrl"
          :width="260"
          :height="190"
        />
        <img
          v-else
          class="category-image"
          src="https://via.placeholder.com/150"
          :alt="category.name"
          width="260"
          height="190"
        />
      </div>

      <div class="category-block">
        <div>
          <AuthImage
            v-if="category.smallIconUrl"
            :path="category.smallIconUrl"
            :width="25"
            :height="25"
          />
          <img
            v-else
            src="https://via.placeholder.com/150"
            :alt="category.name"
            width="25"
            height="25"
          />
        </div>
        <p class="text-white ml-2 text-16">{{ category.name }}</p>
      </div>
    </div>
  </div>
</template>

<style type="text/css" scoped>
.categories {
  display: grid;
  grid-template-columns: 260px 260px 260px;
  padding-bottom: 105px;
  align-items: center;
  width: 908px;
  margin: 0 auto;
  gap: 64px;
}
.category {
  overflow: hidden;
  border-radius: 40px;
  cursor: pointer;
  width: 260px;
  height: 260px;
}
.category-image {
  border-radius: 40px 40px 0 0;
}
.category-block {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  background: var(--green);
}
.category-block > p {
  font-size: 18px;
}
.category-block > div {
  width: 25px;
  height: 25px;
}
.category-content {
  height: 190px;
}

@media (max-width: 1150px) {
  .categories {
    width: 552px;
    gap: 32px;
    grid-template-columns: repeat(auto-fill, 260px);
  }
}

@media (max-width: 699px) {
  .categories {
    width: fit-content;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, 240px);
  }
  .category {
    width: 240px;
  }
}
</style>
