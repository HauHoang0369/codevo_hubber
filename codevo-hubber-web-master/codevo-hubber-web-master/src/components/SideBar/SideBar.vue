<template>
  <div
    ref="sidebar"
    :class="{ 'sidebar-opened': isOpened }"
    class="side-bar"
    v-click-outside="onClickOutside"
  >
    <ul>
      <li v-if="submenu.active">
        <button @click="backToMenu" class="text-primary d-flex align-center">
          <SystemBackIcon class="menu-icon" />
          <span class="ml-4">{{
            submenu.titleTranslate ? $t(submenu.titleTranslate) : submenu.title
          }}</span>
        </button>
      </li>
      <li v-else>
        <button @click="toggleMenu">
          <MenuIcon class="menu-icon" />
        </button>
      </li>
    </ul>
    <!--    <component v-if='submenu.component' :is='submenu.component' />-->
    <CategorySideBar
      v-if="submenu.component && submenu.component?.name === 'CategorySideBar'"
    />

    <ul v-else class="mt-12 sidebar-links" :class="{ submenu: submenu.active }">
      <li v-for="(link, idx) in currentLinks" :key="idx">
        <router-link v-if="link.to" :to="link.to" class="router-link">
          <div class="menu-item">
            <component v-if="link.icon" :is="link.icon" />
            <span class="menu-item-title">{{
              link.translate ? $t(link.translate) : link.text
            }}</span>
          </div>
        </router-link>
        <div
          v-if="link.subLinks"
          class="router-link pa-0"
          @click="showMenu(link)"
        >
          <div
            class="menu-item"
            :class="{ 'd-flex justify-space-between': submenu.active }"
          >
            <component :is="link.icon" />
            <span class="menu-item-title">{{
              link.translate ? $t(link.translate) : link.text
            }}</span>
            <img
              v-if="submenu.active"
              :src="require('@/assets/icons/icon-system-chevron-right@2x.png')"
              class=""
              style="height: 10px; width: 10px"
              alt="Chevron Right"
            />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
// Components
import MenuIcon from '@/components/base/icons/MenuIcon.vue'
import HomeIcon from '@/components/base/icons/HomeIcon.vue'
import SolutionsIcon from '@/components/base/icons/SolutionsIcon.vue'
import SystemOtherIcon from '@/components/base/icons/SystemOtherIcon.vue'
import SettingsIcon from '@/components/base/icons/SettingsIcon.vue'
import ProductIcon from '@/components/base/icons/ProductIcon.vue'
import TankMixIcon from '@/components/base/icons/TankMixIcon.vue'
import GlobalIcon from '@/components/base/icons/GlobalIcon.vue'

// state
import { computed, reactive, shallowRef } from 'vue'
import { useStore } from 'vuex'
import SystemBackIcon from '@/components/base/icons/SystemBackIcon.vue'
import CategorySideBar from '@/components/SideBar/CategorySideBar.vue'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { t } = useI18n()
const isOpened = computed(() => store.getters['getUserSettings'].menuOpened)
const links = [
  {
    to: '/Dashboard',
    icon: HomeIcon,
    text: 'Dashboard',
  },
  {
    to: '/Products',
    icon: ProductIcon,
    translate: 'MAIN_MENU_PRODUCT_TITLE',
  },
  {
    to: '/GlobalProducts',
    icon: ProductIcon,
    translate: 'MAIN_MENU_GLOBAL_PRODUCT_TITLE',
  },
  {
    to: '/Solutions',
    icon: SolutionsIcon,
    translate: 'MAIN_MENU_SOLUTIONS_TITLE',
  },
  {
    to: '/Crops',
    icon: GlobalIcon,
    text: t('MAIN_MENU_EXPERIENCE_TITLE'),
  },
  {
    to: '/tank-mix',
    icon: TankMixIcon,
    translate: 'MAIN_MENU_TANK_MIX_TITLE',
  },
  {
    icon: SystemOtherIcon,
    text: 'Altro',
    current: 1, // Current index (used for child)
    subLinks: {
      title: 'Altro', // or titleTranslate: 'MAIN_MENU_xxx',
      links: [
        {
          to: '/SocialWall',
          translate: 'MAIN_MENU_HOME_TITLE',
        },
        {
          translate: 'MAIN_MENU_EXPERTCLUB_TITLE',
          parent: 1, // Parent id for subLinks
          component: CategorySideBar,
          subLinks: {
            title: 'Ag-articles',
          },
        },
        {
          to: '/ehub-cloud',
          translate: 'MAIN_MENU_GLOBAL_DOCUMENTS_TITLE',
        },
        {
          text: 'Utilities',
          parent: 1, // Parent id for subLinks
          subLinks: {
            title: 'Utilities',
            links: [
              {
                to: '/TankMix',
                text: 'Articoli',
              },
            ],
          },
        },
        {
          to: '/competitor-products',
          text: "Prodotti per l'agricoltura",
        },
        {
          to: '/producers',
          translate: 'PARTY_VIEW_COMPETITORS_TITLE',
        },
        {
          to: '/corporateOverview',
          translate: 'MAIN_MENU_CORPORATE_MATERIAL_TITLE',
        },
        {
          to: 'selezionePrivacy',
          text: 'Selezione Privacy',
        },
      ],
    },
  },
  {
    to: '/settings',
    icon: SettingsIcon,
    translate: 'MAIN_MENU_SETTINGS_TITLE',
  },
]

const submenu = reactive({
  active: false,
  title: '',
  parent: 0,
})
const currentLinks = shallowRef(links)

const toggleMenu = () => {
  const current = store.getters['getUserSettings']
  const opened = current.menuOpened
  store.commit('saveUserSettings', {
    ...current,
    menuOpened: !opened,
  })
}

const showMenu = (link) => {
  if (link.subLinks) {
    // submenu
    currentLinks.value = link.subLinks.links
    submenu.active = true
    submenu.title = link.subLinks.title || ''
    submenu.titleTranslate = link.subLinks.titleTranslate || ''
    submenu.parent = link.parent
    submenu.component = link.component || null
  } else {
    currentLinks.value = link
    submenu.active = false
    submenu.title = ''
    submenu.titleTranslate = ''
    submenu.parent = 0
  }

  if (submenu.active && !isOpened.value) {
    toggleMenu()
  }
}

const getMenuById = (currentId, item) => {
  for (let i = 0; i < item.length; i++) {
    if (item[i].current === currentId) {
      return item[i]
    }

    if (item[i].subLinks) {
      return getMenuById(currentId, item[i].subLinks)
    }
  }
}

const backToMenu = () => {
  if (submenu.parent) {
    const newMenu = getMenuById(submenu.parent, links)
    showMenu(newMenu)
  } else {
    showMenu(links)
  }
}

const onClickOutside = () => {
  if (isOpened) {
    const current = store.getters['getUserSettings']
    store.commit('saveUserSettings', {
      ...current,
      menuOpened: false,
    })
  }
}
</script>

<style lang="scss">
.menu-icon {
  margin-left: 10px;
}

.side-bar {
  position: fixed;
  left: 0;
  top: 137px;
  padding: 20px 10px 25px 27px;
  border-radius: 0 26px 26px 0;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
  z-index: 1000;
  max-height: 600px;
  overflow-y: auto;

  svg {
    width: 30px;
    height: 30px;
  }

  ul {
    list-style-type: none;
  }

  div {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    color: var(--primary);
    margin: 10px 0;

    .active-icon {
      display: none;
    }
  }

  &.sidebar-opened .menu-item-title {
    display: flex;
  }

  .router-link-exact-active > div {
    background: var(--background-active);

    .menu-item-title {
      color: var(--primary);
    }

    svg path {
      fill: var(--primary);
    }

    img {
      -webkit-filter: opacity(0.5) drop-shadow(0 0 0 var(--primary-dark));
    }

    .active-icon {
      display: block;
    }

    .icon {
      display: none;
    }
  }
}

.sidebar-links {
  overflow: auto;
  padding-right: 17px;
}

::-webkit-scrollbar {
  width: 3px;
}

.sidebar-links::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 100px;
}

.sidebar-links::-webkit-scrollbar-track {
  background: linear-gradient(
    90deg,
    rgba(10, 61, 49, 0) 40%,
    var(--primary) 60%,
    rgba(10, 61, 49, 0) 0
  );
  margin-bottom: 5px;
}

.router-link {
  text-decoration: none;
}

.sidebar-opened div {
  padding: 10px;
  justify-content: unset;
  width: 218px;
}

.menu-item {
  display: flex;
  cursor: pointer;
}

.menu-item-title {
  margin-left: 17px;
  font-size: 16px;
  font-weight: 500;
  display: none;
  color: var(--text);
}

.submenu {
  .menu-item {
    padding: 10px 0 10px 40px;
    height: 40px;
  }
}
</style>
