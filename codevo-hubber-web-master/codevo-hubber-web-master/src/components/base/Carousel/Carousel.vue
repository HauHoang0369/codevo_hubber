<script setup>
import AuthImage from "@/components/base/AuthImage/AuthImage";

const props = defineProps({
  data: Array,
  height: {
    type: Number,
    default: 40
  },
  width: {
    type: Number,
    default: 40
  }
})

</script>

<template>
  <v-slide-group
    class="pt-4 pb-4"
    active-class="success"
    show-arrows
  >
    <template v-slot:prev>
      <img :src="require('@/assets/icons/icon-system-chevron-left@2x.png')" class=""
           style="height: 30px; width: 30px;"/>
    </template>
    <template v-slot:next>
      <img :src="require('@/assets/icons/icon-system-chevron-right@2x.png')" class=""
           style="height: 30px; width: 30px;"/>
    </template>


    <div
      v-for="(item,index) in data" :key="index"
      class="d-flex flex-column justify-space-between align-center mr-5 ml-5"
    >
      <AuthImage :path="item?.imageUrl"
                 v-if="item?.imageUrl!==''"
                 :height=height
                 :width=width
                 :style="{
        'height': height+'px',
        'width':width+'px'
      }"
      ></AuthImage>
      <div class="text-center description">
        {{ item.description }}
      </div>
    </div>

  </v-slide-group>
</template>


<style type="text/css" >
.v-slide-group__next--disabled, .v-slide-group__prev--disabled {
  display: none;
}

.v-slide-group .v-slide-group__container {
  /*contain: content;*/
  /*display: flex;*/
  /*flex: 1 1 auto;*/
  /*overflow: hidden;*/
  -webkit-mask-image: linear-gradient(90deg, #000 95%, transparent) !important;
}

/*.item-image {*/
/*  width: 40px;*/
/*  height: 40px;*/
/*}*/

</style>

<style type="text/css" scoped>
.description {
  margin-top: 16px;
}
</style>
