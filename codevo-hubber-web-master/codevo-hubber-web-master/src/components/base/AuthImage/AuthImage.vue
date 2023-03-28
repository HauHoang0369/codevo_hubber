// TODO: Show image. Currently just trying to fetch the url
<script setup>
import { computed, ref, watchEffect } from 'vue'
import AppService from '@/services/App/AppService'

// TODO: Default values from config file
const props = defineProps({
  path: String,
  filename: String,
  width: {
    type: Number,
    default: 100,
  },
  height: {
    type: Number,
    default: 100,
  },
  showAvatar: {
    type: Boolean,
    default: false,
  }
})

const image = ref(null)

const fetchImage = async () => {
  try {
    let path = props.path.replaceAll('/', '!')
    const data = await new AppService().service.getAuthImage({
      path: path,
      width: props.width,
      height: props.height,
      hideLoader: true,
    })
    let base64String = btoa(
      String.fromCharCode.apply(null, new Uint8Array(data))
    )
    image.value = 'data:image/jpg;base64,' + base64String
  } catch (e) {
    image.value = null
  }
}

const abbreviation = computed(() => {
  if (!props.filename) {
    return 'UN'
  }

  const words = props.filename.split(' ');
  return ((words[0]?.charAt(0) || '') + (words[1]?.charAt(0) || '')).toUpperCase();
});

watchEffect(() => {
  fetchImage();
}, [props.path, props.width, props.height]);
</script>

<template>
  <img :src="image" v-if="image !== null" alt="" />
<!--  <div class="bg-grey" v-else></div>-->
  <div class="" v-else>
    <div v-if="showAvatar" class="avtar-card">
      {{abbreviation}}
    </div>
  </div>
</template>

<style lang="scss" scoped>
img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.avtar-card {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color:  rgba($color-primary, 0.2);
  font-size: 20px;
  color: $color-primary;
}
</style>
