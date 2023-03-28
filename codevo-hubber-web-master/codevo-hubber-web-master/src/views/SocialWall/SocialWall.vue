<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { NewPost, SocialWallFriends, SocialWallPost } from '@/components/SocialWall/index'
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import Observer from '@/components/base/Observer/Observer'
import { PlusIcon } from '@/components/base/icons'
import SocialWallService from '@/services/SocialWall/SocialWallService'

const store = useStore()
const router = useRouter()

const posts = computed(() => store.state.social_wall.posts)
const SIZE = 10

let dialog = ref(false)
let isLoading = ref(false)

const getPosts = async () => {
  if (isLoading.value) {
    // Prevent load more post again
    return
  }

  if ((store.getters['social_wall/getDataPost'].number ?? -1) + 1 === 0) {
    // First load
    isLoading.value = true
    await store.dispatch('social_wall/getPosts', { page: 0, hideLoader: true })
    isLoading.value = false
    return
  }

  if (store.getters['social_wall/getDataPost'].numberOfElements === SIZE) {
    // Not last page
    isLoading.value = true
    await store.dispatch('social_wall/getPosts', { page: store.getters['social_wall/getDataPost'].number + 1 })
    isLoading.value = false

  }
}

const onPostClick = (postId) => {
  console.log('onPostClick: ' + postId)
}

const onLikePost = async (post) => {
  if (!post.like) {
    post.totalLikes++
  } else {
    post.totalLikes--
  }
  post.like = !post.like

  const fd = new FormData()
  fd.append('id', post.id)

  await new SocialWallService().likePost(post.id, fd)
}

const onProfileClick = (userId) => {
  router.push('/SocialWall/Profile/' + userId)
}

const onNewPost = () => {
  dialog.value = true
}

const onCloseNewPost = () => {
  dialog.value = false
}
</script>

<template>
  <div class='content'>
    <v-dialog v-model='dialog' width='612'>
      <template v-slot:activator='{ on, attrs }'>
        <v-container class=''>
          <v-row no-gutters>
            <v-col class='pr-lg-10' lg='8'>
              <div class='text-h3 mb-10'>Social Wall</div>
              <div class='posts'>
                <SocialWallPost v-for='(item, index) in posts' :key='index' :data='item' class='post'
                  @like='onLikePost(item)' v-on:click='onPostClick' v-on:profile='onProfileClick(item.user.id)'>
                </SocialWallPost>

                <div v-if='isLoading' class='posts-loading'>
                  <v-progress-circular indeterminate size='64' />
                </div>
                <Observer @intersect='getPosts' />

              </div>
            </v-col>
            <v-col class='hidden-md-and-down' lg='4'>
              <div class='mb-10 text-right'>
                <ButtonPrimaryDesktop :bg-style="{
                  'background': 'linear-gradient(to top, var(--primary), var(--primary-dark))',
                }" v-on:click='onNewPost'>
                  <div class='d-flex align-center btn-add-post'>
                    <span class='mr-2'>Aggiungi post</span>
                    <PlusIcon path-color='#fff' />
                  </div>
                </ButtonPrimaryDesktop>
              </div>

              <div>
                <SocialWallFriends />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <NewPost v-on:close='onCloseNewPost' />
    </v-dialog>
  </div>
</template>

<style lang='scss' scoped>
.btn-add-post * {
  color: white;
}

.posts {
  .post {
    margin-bottom: 20px;
  }

  .posts-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
  }
}
</style>
