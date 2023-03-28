<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import {
  DeleteIcon,
  EditIcon,
  SystemDropdownIcon,
  SystemInfoIcon,
} from '@/components/base/icons'

const props = defineProps({
  index: Number,
})

const emit = defineEmits(['showObjective', 'removeObjective'])
const store = useStore()

const isOpen = ref(false)

const hideActions = () => {
  isOpen.value = false
}

const deleteItem = () => {
  hideActions()
  emit('removeObjective', props.index)
}

const itemInfo = () => {
  hideActions()
  emit('showObjective', props.index)
}

const editItem = () => {
  hideActions()
  emit('showObjective', props.index)
}
</script>

<template>
  <div>
    <div v-click-outside="hideActions" class="option-show">
      <span class="icon-dropdown" @click.prevent="isOpen = !isOpen">
        <SystemDropdownIcon path-color="#e2e4e7" />
      </span>
      <div v-show="isOpen" class="list-actions">
        <ul>
          <li class="d-flex align-center" @click.prevent="editItem()">
            <EditIcon class="mr-1 icon" />
            Modifica
          </li>
          <li class="d-flex align-center" @click.prevent="deleteItem()">
            <DeleteIcon class="mr-1 icon" />
            Elimina
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;

      &:hover {
        background-color: var(--background-blue);
      }

      .icon {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
