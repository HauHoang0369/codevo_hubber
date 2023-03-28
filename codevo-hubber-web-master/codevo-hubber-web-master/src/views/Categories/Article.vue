<script setup>
import ArticleBlock from '@/components/Article/ArticleBlock'
import RelatedArticleCard from '@/components/Article/RelatedArticleCard'
import RelatedProductCard from '@/components/Article/RelatedProductCard'
import RelatedSolutionCard from '@/components/Article/RelatedSolutionCard'
import ArticleComment from '@/components/Article/ArticleComment'
import CategoriesService from '@/services/Categories/CategoriesService'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import BaseIcon from '@/components/base/icons/BaseIcon.vue'
import BaseDropdown from '@/components/base/inputs/BaseDropdown.vue'
import CategoryAndChannelPopup from '@/components/Article/CategoryAndChannelPopup.vue'

const route = useRoute()
const store = useStore()
const router = useRouter()

const article = ref({})
const relatedArticles = ref([])
const relatedProducts = ref([])
const relatedSolutions = ref([])

const articleId = Number(route.params.id)
const code = route.params.code
const marketId = store.state.user.market.id

const getRelatedArticles = async () => {
  relatedArticles.value =
    (await CategoriesService().getRelatedArticles(articleId)) ?? []
}

const getRelatedProducts = async () => {
  relatedProducts.value =
    (await CategoriesService().getRelatedProducts(articleId, marketId)) ?? []
}

const getRelatedSolutions = async () => {
  relatedSolutions.value =
    (await CategoriesService().getRelatedSolutions(articleId, marketId)) ?? []
}

onMounted(async () => {
  article.value = await store.dispatch('articles/callArticle', articleId)

  await getRelatedArticles()
  await getRelatedProducts()
  await getRelatedSolutions()
})

function deletePopup() {
  Swal.fire({
    titleText: 'Delete Post',
    text: 'Do you want to delete a discussion?',
    showCloseButton: true,
    closeButtonHtml:
      '<svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><path d="M27.228 2.272a1.5 1.5 0 0 1 0 2.121L16.62 15l10.607 10.607a1.5 1.5 0 0 1 .103 2.007l-.103.114a1.5 1.5 0 0 1-2.121 0L14.5 17.12 3.893 27.728a1.5 1.5 0 0 1-2.12-2.121L12.377 15 1.772 4.393a1.5 1.5 0 0 1-.103-2.007l.103-.114a1.5 1.5 0 0 1 2.121 0L14.5 12.878 25.107 2.272a1.5 1.5 0 0 1 2.12 0z" fill="#A6ACB5" fill-rule="evenodd"></path></svg>',
    confirmButtonText: 'Confirm',
    customClass: {
      popup: 'hubber-swal-popup',
    },
    preConfirm: async () => {
      const deleted = await store.dispatch(
        'articles/deleteArticle',
        article.value.id
      )
      if (deleted) {
        Swal.fire({
          icon: 'success',
          iconColor: '#00604b',
          titleText: 'Deleted post',
          customClass: {
            popup: 'hubber-swal-popup',
          },
          didClose: () => {
            router.push('/categories/ARTICLE')
          },
        })
      } else {
        Swal.fire({
          icon: 'error',
          titleText: 'Something went wrong!',
          customClass: {
            popup: 'hubber-swal-popup',
          },
        })
      }
    },
    preDeny: (val) => {
      console.log(val)
    },
  })
}

const goToEditArticle = () => {
  router.push({
    name: 'EditArticle',
    params: {
      code,
      id: articleId,
    },
    query: route.query,
  })
}

// Handle dropdown
const menuItems = [
  {
    title: 'Cambia il canale del post e la categoria',
    value: 'popup',
  },
]
const showCategoryAndChannelPopup = ref(false)
const onDropdownSelect = ({ value }) => {
  if (value === 'popup') onOpenPopup()
}
const onOpenPopup = () => (showCategoryAndChannelPopup.value = true)

// Article comments
onMounted(async () => {
  store.dispatch('articles/callArticleComments', articleId)
})
const comments = computed(
  () => store.getters['articles/getCommentsArticle'] || []
)
const seeMore = ref(false)
const getComments = computed(() =>
  seeMore.value ? comments.value : comments.value.slice(0, 1)
)
</script>

<template>
  <div class="article-main-size">
    <div class="article-visibility d-flex justify-end mb-8">
      <base-icon name="public" width="16" height="16"> Pubblico </base-icon>
    </div>

    <div class="article-actions d-flex justify-end mb-15">
      <base-dropdown :items="menuItems" @change="onDropdownSelect" />

      <category-and-channel-popup
        v-if="showCategoryAndChannelPopup"
        @modal-close="showCategoryAndChannelPopup = false"
      />
    </div>

    <article-block />

    <div class="article-comments-block">
      <h1 class="article-comments-title">Commenti</h1>
      <article-comment
        class="article-comment-block"
        v-for="comment in getComments"
        :key="comment.id"
        :comment="comment"
      />

      <div class="article-comments-block-see-more-main">
        <div
          class="article-comments-block-see-more"
          @click="seeMore = !seeMore"
        >
          <p class="see-more-text">
            <base-icon
              name="ChevronUp"
              width="20"
              height="20"
              color="#00604b"
              v-if="seeMore"
            >
              <template #left>Meno</template>
            </base-icon>

            <base-icon
              name="ChevronDown"
              width="20"
              height="20"
              color="#00604b"
              v-else
            >
              <template #left>Leggi di più</template>
            </base-icon>
          </p>
        </div>
      </div>
    </div>

    <div v-if="relatedArticles.length">
      <h1 class="article-title">Articoli correlati</h1>
      <div class="related-articles">
        <related-article-card
          v-for="article in relatedArticles"
          :key="article.id"
          :article="article"
        />
      </div>
    </div>

    <div class="product-and-solution">
      <div>
        <h1 class="article-title">Prodotti correlati</h1>
        <div class="article-products">
          <related-product-card
            v-for="product in relatedProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>

      <div class="article-solutions">
        <h1 class="article-title">Soluzioni</h1>
        <related-solution-card
          v-for="solution in relatedSolutions"
          :key="solution.id"
          :solution="solution"
        />
      </div>
    </div>

    <div class="article-footer">
      <p class="article-discard" @click="deletePopup">
        Elimia
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.333 1.167a1 1 0 0 1 .943.666h2.39a1 1 0 0 1 0 2H4.334a1 1 0 1 1 0-2h2.39a1 1 0 0 1 .944-.666h4.666zM16 4.5v13a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-13h12zM7.333 5.833a.667.667 0 0 0-.666.667v10.667a.667.667 0 0 0 1.333 0V6.5a.667.667 0 0 0-.667-.667zm2.667 0a.667.667 0 0 0-.667.667v10.667a.667.667 0 0 0 1.334 0V6.5A.667.667 0 0 0 10 5.833zm2.667 0A.667.667 0 0 0 12 6.5v10.667a.667.667 0 0 0 1.333 0V6.5a.667.667 0 0 0-.666-.667z"
            fill="#00604B"
            fill-rule="evenodd"
          />
        </svg>
      </p>

      <button type="submit" class="article-btn" @click="goToEditArticle">
        Modifica
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.swal2-container {
  z-index: 2410 !important;
}
// SweetAlert buttons
.hubber-swal-popup.swal2-popup {
  padding: 50px 20px;
  border-radius: 30px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);
  .swal2-close {
    width: 30px;
    height: 30px;
    margin: 20px;
  }
  .swal2-styled.swal2-confirm {
    margin-top: 30px;
    width: 183px;
    height: 48px;
    border-radius: 24px;
    box-shadow: 0 18px 40px -6px rgba(0, 96, 75, 0.3);
    background-image: linear-gradient(
      to top,
      var(--primary),
      var(--primary-dark)
    );
    &:hover,
    &:active {
      background-image: linear-gradient(
        to top,
        var(--primary),
        var(--primary-dark)
      ) !important;
    }
  }
}
</style>

<style scoped lang="scss">
.article-main-size {
  width: 1156px;
  margin: 0 auto 21px auto;
}

.article-comments-block {
  margin-top: 60px;
  padding: 30px 30px 21px;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba($color-grey-teal, 0.3);
  background-color: var(--white);
}

.article-comment-block {
  margin-top: 30px;
}

.article-comments-title {
  margin-bottom: 30px;
  font-size: 30px;
  font-weight: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: var(--primary);
}

.article-comments-block-see-more-main {
  margin-top: 10px;
  display: flex;
  flex-direction: row-reverse;
}

.article-comments-block-see-more {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.article-comments-block-see-more svg {
  margin-left: 5px;
}

.article-title {
  margin-top: 60px;
  margin-bottom: 30px;
  font-size: 30px;
  font-weight: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: var(--primary);
}

.related-articles {
  display: grid;
  grid-template-columns: 360px 360px 360px;
  grid-gap: 40px;
}

.article-products {
  display: grid;
  grid-template-columns: 360px 360px;
  grid-gap: 40px;
}

.article-solutions {
  width: 360px;
}

.article-solutions > div {
  margin-bottom: 28px;
}

.product-and-solution {
  margin-bottom: 61.5px;
  display: flex;
  justify-content: space-between;
}

.article-footer {
  display: flex;
  margin-top: 170px;
  justify-content: space-between;
  padding: 22px 33px;
  align-items: center;
  width: 100%;
  object-fit: contain;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba($color-grey-teal, 0.3);
  background-color: var(--white);
}

.article-discard {
  display: flex;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: var(--primary);
  svg {
    width: 20px;
    height: 20px;
    margin: 2px 0 1px 2px;
    object-fit: contain;
  }
}

button.article-btn {
  text-align: center;
  width: 166px;
  font-size: 16px;
  font-weight: bold;
  padding: 12px;
  color: var(--white);
  border-radius: 24px;
  box-shadow: 0 18px 40px -6px rgba(0, 96, 75, 0.3);
  background-image: linear-gradient(
    to top,
    var(--primary),
    var(--primary-dark)
  );
}

.see-more-text .base-icon {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-actions {
  .popup-main {
    max-width: 590px;
  }
}

.article-visibility {
  font-size: 14px;
}

@media (max-width: 1360px) {
  .article-main-size {
    width: 100%;
  }
  .related-articles {
    display: grid;
    grid-template-columns: 360px 360px;
    justify-content: space-between;
    grid-gap: 40px;
  }
  .article-products {
    display: grid;
    grid-template-columns: 360px 360px;
    justify-content: space-between;
    grid-gap: 40px;
  }
  .product-and-solution {
    display: block;
  }
}

@media (max-width: 960px) {
  .article-main-size {
    width: 100%;
  }
  .related-articles {
    display: grid;
    grid-template-columns: auto;
    justify-content: space-between;
    grid-gap: 20px;
  }

  .article-products {
    display: grid;
    grid-template-columns: auto;
    justify-content: space-between;
    grid-gap: 20px;
  }
}

@media (max-width: 500px) {
  .article-solutions {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .article-comments-title,
  .article-title {
    font-size: 25px;
  }
}

.see-more-text {
  display: flex;
  align-items: center;
}
</style>
