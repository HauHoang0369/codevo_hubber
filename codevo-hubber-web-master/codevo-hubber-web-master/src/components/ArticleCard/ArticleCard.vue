<script setup>
import AuthImage from '@/components/base/AuthImage/AuthImage'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
// components
import Chip from '@/components/base/buttons/Chip.vue'
// icons
import IconComment from '@/assets/icons/icon-system-comment@2x.png'
import IconPublic from '@/assets/icons/icon-system-public@2x.png'
import IconFriendSel from '@/assets/icons/icon-system-friends-sel.png'
import IconFriend from '@/assets/icons/icon-system-friends.png'
import IconMarket from '@/assets/icons/icon-system-market@2x.png'
import IconGroup from '@/assets/icons/visibility-3people.svg'
import StarIcon from '@/components/base/icons/StarIcon.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()

const props = defineProps({
  article: Object
})

const date = computed(() => (seconds) => {
  const date = new Date(seconds)
  return `${date.getUTCDate()} ${date.toLocaleString('default', {
    month: 'long'
  })} ${date.getFullYear()}`
})

const goArticlePage = () => {
  router.push({
    name: 'Article',
    params: {
      code: route.params.code,
      id: props.article.id
    },
    query: {
      channel: store.state.articles.channelId
    }
  })
}
</script>

<template>
  <div class='article-card'>
    <div class='article-image position-relative'>
      <auth-image :path='article.coverImage.url' />
      <h1 :class="{ 'text-cover': !!article.coverImage?.url }" class='article-card-title' @click='goArticlePage'>{{
        article.title
      }}</h1>
      <StarIcon v-if='article.highlighted' class='article-card-favorite' />
    </div>

    <div class='article-content'>
      <div class='article-content-info d-flex justify-space-between'>
        <div class='article-card-user'>
          <div class='article-card-user-avatar'>
            <auth-image :height='74' :path='article.user.imageUrl' :width='74' />
          </div>

          <div class='article-card-user-info'>
            <p class='article-card-user-info-name'>
              {{ article.user.shownName }}
            </p>
            <div class='article-card-user-info-date'>
              {{ date(article.date) }}
              <div class='d-flex article-visibility'>
                <img v-if="article.visibility === 'PUBLIC'" :src='IconPublic' alt='Public' />
                <img v-else-if="article.visibility === 'FRIENDS'" :src='IconFriend' alt='Friends' />
                <img v-else-if="article.visibility === 'SELECTEDUSERS'" :src='IconFriendSel' alt='Selected users' />
                <img v-else-if="article.visibility === 'GROUPS'" :src='IconGroup' alt='Groups' />
                <img v-else-if="article.visibility === 'MARKETS'" :src='IconMarket' alt='Markets' />
              </div>
            </div>
          </div>
        </div>
        <div class='d-flex align-center'>
          <div>
            <svg :class="{ 'svg-active': article.like }" height='30' viewBox='0 0 32 30' width='31'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                d='m14.659 27.954-.872-.793C5.93 20.035.741 15.335.741 9.567c0-4.7 3.693-8.392 8.393-8.392 2.655 0 5.203 1.236 6.866 3.19 1.663-1.954 4.211-3.19 6.866-3.19 4.7 0 8.393 3.693 8.393 8.392 0 5.768-5.188 10.468-13.046 17.61l-.867.782a2 2 0 0 1-2.687-.005z'
                fill='#E2E4E7' fill-rule='evenodd' />
            </svg>
            <span class='ml-2'>
              {{ article.totalLikes }}
            </span>
          </div>
          <div class='ml-5'>
            <img :src='IconComment' alt='Comment' height='30' width='30' />
            <span class='ml-2'>
              {{ article.totalComments }}
            </span>
          </div>
        </div>
      </div>
      <div v-if='article.text' class='article-text' v-html='article.text'></div>
      <v-container class='d-sm-flex pa-0'>
        <v-row class='article-card-footer justify-space-between align-center'>
          <v-col class='article-tags pa-0' sm='10'>
            <div v-if='article.tags?.length > 0' class='d-flex flex-wrap'>
              <Chip v-for='(tag, index) in article.tags' :key='index' class='pa-2 elevation-5 rounded-pill mx-1 my-1'>
                <span class='type-chip-label'>{{ tag.name }}</span>
              </Chip>
            </div>
          </v-col>
          <v-col class='article-read-more pa-0 text-no-wrap text-right flex-grow-0 flex-shrink-0' sm='2'
            @click='goArticlePage'>Leggi di più
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.svg-active path {
  fill: var(--primary-dark);
}

.article-card {
  width: 100%;
  margin-bottom: 30px;
  border-radius: 20px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);

  h1.article-card-title {
    cursor: pointer;
    color: var(--primary) !important;
    margin: 0 30px;
    top: 25%;
    font-size: 50px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;

    &.text-cover {
      position: absolute;
      color: var(--white) !important;
    }
  }

  .article-image {
    display: flex;
    align-items: center;
    max-height: 453px;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    overflow: hidden;

    .article-card-favorite {
      width: 40px;
      height: 40px;
      position: absolute;
      top: 30px;
      right: 30px;
    }
  }

  .article-content {
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;

    .article-content-info {
      padding: 30px;
    }

    .article-card-user {
      display: flex;
      align-items: center;
    }

    .article-card-user-avatar {
      overflow: hidden;
      width: 74px;
      border-radius: 20px;
    }

    .article-card-user-avatar img {
      display: block;
    }

    .article-card-user-info {
      margin-left: 19px;
    }

    .article-card-user-info-name {
      font-size: 16px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: var(--text);
    }

    .article-card-user-info-date {
      margin-top: 7px;
      font-size: 14px;
      color: var(--text);
      font-weight: 300;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      display: flex;
      align-items: center;

      .article-visibility {
        margin-left: 16px;

        img {
          width: 20px;
          height: 20px;
        }
      }
    }

    .article-text {
      margin-bottom: 20px;
      padding: 0 30px;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: var(--text);
      display: -webkit-box;
      -webkit-line-clamp: 6;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .article-card-footer {
      border-top: solid 1px rgba(165, 165, 165, 0.2);
      padding: 20px 0;
      margin: 0 30px;

      .article-read-more {
        cursor: pointer;
        width: 75px;
        font-size: 14px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        color: var(--primary-dark);
      }
    }
  }


}
</style>
