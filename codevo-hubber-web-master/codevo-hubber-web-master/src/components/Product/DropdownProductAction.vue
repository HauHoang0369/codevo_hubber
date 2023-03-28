<script setup>
import {computed, ref} from 'vue'
import SystemDropdownIcon from '@/components/base/icons/SystemDropdownIcon.vue'
import DeleteProduct from '@/components/Product/DeleteProduct'
import {useRoute, useRouter} from 'vue-router'

const router = useRouter()
const route = useRoute();
const props = defineProps({
  product: Object
})

// const productToDelete = ref(props.product)
const isOpen = ref(false)
const onEdit = ref(false)
const onDelete = ref(false)

const isGlobalProduct = computed(() => route.name === 'GlobalProduct')

const hideActions = () => {
  isOpen.value = false
}

const showDelete = (show = true) => {
  onDelete.value = show
}

const showEdit = (status = false) => {
  onEdit.value = status
  let id;
  if (props.product.length > 0) { // product is an array
    id = props.product[0].id
  } else {
    id = props.product.id
  }
  router.push({ name: isGlobalProduct.value ? 'EditGlobalProduct' : 'EditProduct', params: { id } })
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
          <li @click.prevent='showEdit(true)'>Modifica</li>
          <li @click.prevent='showDelete(true)'>Elimina</li>
        </ul>
      </div>
    </div>
    <!-- <v-dialog v-model='onNewPost' scrollable persistent v-on:click:outside="showEdit(false)" max-width='612'>
      <v-card style='border-radius: 30px'>
        <NewPost :post="post" v-on:close='showEditPost(false)' />
      </v-card>
    </v-dialog> -->
    <v-dialog v-model="onDelete" v-on:click:outside="showDelete(false)" max-width='534'>
      <DeleteProduct :product="product" v-on:close='showDelete(false)' />
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
