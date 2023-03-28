<script setup>
// https://github.com/vuetifyjs/vuetify/issues/15187
import {ref, onMounted} from 'vue'
import Chip from "@/components/base/buttons/Chip";
import TabItem from "@/components/TabBar/TabItem";

const props = defineProps({
  items: Array,
  selected: Number
})

const emit = defineEmits(['change'])

// const selectedItem = ref('')

onMounted(() => {
  // selectedItem.value = props.items.findIndex(x => x !== undefined)// select first one
})

function onTabSelect(index) {
  emit('change', index)
}

</script>

<template>
  <div class="tab-bar d-flex flex-row align-center justify-start">
    <TabItem
      v-for="(item,index) in items"
      :key="index"
      :selected="selected===index"
      :value="item"
      @click="onTabSelect(index)"
    >
      {{ item }}
    </TabItem>
    <!--    <v-chip-group-->
    <!--      v-model="selectedItem"-->
    <!--      center-active-->
    <!--      mandatory-->
    <!--      light-->
    <!--    >-->
    <!--      <v-chip-->
    <!--        v-for="(item,index) in items"-->
    <!--        :key="index"-->
    <!--        :value="item"-->
    <!--        @click="onTabSelect(item)"-->
    <!--      >-->
    <!--        {{ item }}-->
    <!--      </v-chip>-->
    <!--    </v-chip-group>-->
  </div>
</template>

<style lang="css" scoped>
.tab-bar {
  height: 64px;
  border-top-left-radius: 32px;
  border-bottom-left-radius: 32px;
  column-gap: 65px;
  width: 100%;
  padding: 14px 17px 14px 17px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
}
</style>
