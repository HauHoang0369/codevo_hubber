<script setup>
import { ref } from 'vue'
import SystemDropdownIcon from '@/components/base/icons/SystemDropdownIcon.vue'
import { DeletePost, NewPost } from '@/components/SocialWall'
import PromotePost from '@/components/SocialWall/PromotePost.vue'

const props = defineProps({
  post: Object
})

const post = ref(props.post)
const isOpen = ref(false)
const onNewPost = ref(false)
const onPromotePost = ref(false)
const onDeletePost = ref(false)

const hideActions = () => {
  isOpen.value = false
}

const showDeletePost = (show = true) => {
  onDeletePost.value = show
}

const showEditPost = (status = false) => {
  onNewPost.value = status
}

const showPromotePost = (status = false) => {
  onPromotePost.value = status
}

</script>

<template>
  <div>
    <div v-click-outside='hideActions' class='option-show'>
      <span class='icon-dropdown' @click.prevent='isOpen = !isOpen'>
        <SystemDropdownIcon />
      </span>
      <div v-show='isOpen' class='list-actions'>
        <ul>
          <li @click.prevent='showEditPost(true)'>Modifica</li>
          <li @click.prevent='showPromotePost(true)'>Promuovi</li>
          <li @click.prevent='showDeletePost(true)'>Elimina</li>
        </ul>
      </div>
    </div>
    <v-dialog v-model='onNewPost' scrollable persistent v-on:click:outside="showEditPost(false)" max-width='612'>
      <v-card style='border-radius: 30px'>
        <NewPost :post="post" v-on:close='showEditPost(false)' />
      </v-card>
    </v-dialog>
    <v-dialog v-model='onPromotePost' v-on:click:outside="showPromotePost(false)" max-width='824'>
      <v-card style='border-radius: 30px'>
        <PromotePost :post="post" v-on:close='showPromotePost(false)' />
      </v-card>
    </v-dialog>
    <v-dialog v-model="onDeletePost" v-on:click:outside="showDeletePost(false)" max-width='534'>
      <DeletePost :post="post" v-on:close='showDeletePost(false)' />
    </v-dialog>
  </div>
</template>

<style lang='scss' scoped>
.option-show {
  position: relative;
  height: 26px;
}

.icon-dropdown {
  cursor: pointer;
}

.list-actions {
  position: absolute;
  z-index: 2;
  top: 100%;
  right: 0;
  padding: 14px 0;
  border-radius: 20px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);

  ul {
    list-style-type: none;

    li {
      cursor: pointer;
      padding: 0 17px;
      line-height: 31px;
      font-size: 14px;
      color: var(--text);
      text-align: center;

      &:hover {
        background-color: var(--background-blue);
      }
    }
  }
}
</style>
