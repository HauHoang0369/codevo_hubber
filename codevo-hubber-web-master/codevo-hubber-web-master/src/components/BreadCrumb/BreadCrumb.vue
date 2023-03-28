<script setup>
import HomeIcon from '@/components/base/icons/HomeIcon.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  title: {
    default: null,
    type: String
  },
  links: {
    default: null,
    type: Array
  }
})

const breadcrumbs = computed({
  get() {
    if (props.links !== null && props.links.length > 0) {
      return props.links
    }
    route.meta.breadcrumbs.map((r) => {
      if (r.path.indexOf(':code')) {
        r.path = r.path.replace(':code', route.params.code)
      }
      return r
    })

    return route.meta.breadcrumbs.concat([
      {
        name: route.name,
        path: route.path,
      },
    ])
  },
})
</script>

<template>
  <div class="breadcrumb">
    <div class="breadcrumb-list">
      <ul style="display: flex; list-style: none">
        <li class="breadcrumb-item">
          <router-link to="/dashboard">
            <HomeIcon class="breadcrumb-item-home" />
          </router-link>
        </li>
        <li
          class="breadcrumb-item"
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="index"
        >
          <img
            class="breadcrumb-item-slag"
            :src="require('@/assets/icons/icon-system-chevron-right@2x.png')"
          />
          <router-link
            :to="'/' + breadcrumb.path"
            v-if="index !== Object.keys(breadcrumbs).length - 1"
            class="Label-grey-dark"
          >
            {{ $t(breadcrumb.name) }}
          </router-link>
          <span
            v-else-if='!links?.length || !breadcrumb?.path'
            class="Label-primary breadcrumb-primary-label"
          >
            {{ title !== null ? $t(title) : $t(breadcrumb.name) }}
          </span>
          <router-link v-else :to='breadcrumb.path'>
            {{ $t(breadcrumb.name) }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style type="text/css" scoped>
.breadcrumb {
  position: relative;
  display: inline-block;
}

.breadcrumb-list {
  display: flex;
  justify-content: start;
  background-color: var(--white);
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  padding: 8px 10px;
  border-radius: 21px;
}

.breadcrumb-item {
  margin: 0 10px;
  font-weight: bolder;
  display: flex;
  align-items: center;
}

.breadcrumb-item .breadcrumb-item-home {
  height: 26px;
}

.breadcrumb-item a {
  text-decoration: none;
  display: inline-flex;
}

.breadcrumb-item-slag {
  margin-right: 15px;
  height: 9px;
}

.breadcrumb-item span {
  text-transform: capitalize;
}

@media (max-width: 800px) {
  .breadcrumb-item-slag {
    margin-right: 3px !important;
  }
  .breadcrumb-list {
    padding: 4px;
  }
  .breadcrumb-item {
    margin: 0 5px;
  }
}
</style>
