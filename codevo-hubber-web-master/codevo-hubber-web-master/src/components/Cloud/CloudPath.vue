<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  path: Object
});

const onPathElementClick = (pathElement) => {
  if (pathElement) {
    router.push({name: 'ehubCloud', params: {folderId: pathElement.id}})
  } else {
    router.push({name: 'ehubCloud'})
  }
}
</script>

<template>
  <div class="cloud-path w-100" v-if="path">
    <div class="cloud-path-list w-100">
      <div class="d-flex align-center max-w-100 w-100">
        <template
          v-for="(pathElement, index) in path"
        >
          <span :key="index" class="cloud-path-item-home text-ellipsis" v-if="index === 0" v-on:click="onPathElementClick(null)">
            {{pathElement.name}}
          </span>
          <img v-if="index !== 0"
               :key="index"
               class="cloud-path-item-slag"
               :src="require('@/assets/icons/icon-system-chevron-right@2x.png')"
               alt=""
          />
          <span :key="index" class="cloud-path-item text-ellipsis" v-if="index !== 0" v-on:click="onPathElementClick(pathElement)">
            {{pathElement.name}}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cloud-path {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.cloud-path-list {
  display: flex;
  justify-content: start;
  background-color: var(--white);
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  padding: 10px 20px;
  border-radius: 21px;
  max-width: 100%;
}

.cloud-path-item {
  cursor: pointer;
  margin-left: 20px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: normal;
  color: var(--primary);

  @media (max-width: 800px) {

  }
}


.cloud-path-item-home {
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: var(--grey-dark);
}


.cloud-path-item a {
  text-decoration: none;
  display: inline-flex;
}

.cloud-path-item-slag {
  height: 9px;
  margin-left: 20px;
  flex-shrink: 0;
}

.cloud-path-item span {
  text-transform: capitalize;
}

@media (max-width: 800px) {
  .cloud-path-item-slag {
  }
  .cloud-path-list {
    padding: 4px;
  }
  .cloud-path-item {
    margin: 0 5px;
  }
}

.cloud-path-item {
  @media (max-width: 800px) {

  }
}




</style>
