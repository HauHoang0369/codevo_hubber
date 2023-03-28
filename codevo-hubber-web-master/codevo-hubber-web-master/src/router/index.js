import { createRouter, createWebHistory } from 'vue-router'

import DashboardLayout from '../components/Layout/DashboardLayout'
import ProductLayout from '../components/Layout/ProductLayout'
import CloudLayout from '../components/Layout/CloudLayout'
import Login from '../views/Auth/Login/Login'
import Register from '../views/Auth/Register/Register'
import AppIndex from '../views/AppIndex'
import Privacy from '../views/Privacy'
import CloudList from '../views/Cloud/CloudList'
import ProductList from '../views/Products/ProductList'
import ProductDetails from '../views/Products/ProductDetails'
import GlobalProductList from '../views/GlobalProducts/GlobalProductList'
import GlobalProductNew from '@/views/GlobalProducts/GlobalProductNew.vue'
import DashBoard from '../views/DashBoard/DashBoard'
import Error from '../views/Errors/MainError'
import CategoriesLayout from '../components/Layout/CategoriesLayout'
import Categories from '../views/Categories/Categories'
import Category from '../views/Categories/Category'
import Article from '../views/Categories/Article'
import NewArticle from '../views/Categories/NewArticle'
import EditArticle from '../views/Categories/EditArticle'
import MyActivitiesLayout from '../components/Layout/MyActivitiesLayout'
import MyActivities from '../views/MyActivities/MyActivities'

import store from '../store'
import SolutionList from '@/views/Solutions/SolutionList'
import SolutionLayout from '@/components/Layout/SolutionLayout'
import SolutionDetails from '@/views/Solutions/SolutionDetails'

import TankMixSelection from '@/views/TankMix/TankMixSelection'
import TankMixList from '@/views/TankMix/TankMixList'
import TankMixDetails from '@/views/TankMix/TankMixDetails'
import TankMixAdvanceSearch from '@/views/TankMix/TankMixAdvanceSearch.vue'
import TankMixLayout from '@/components/Layout/TankMixLayout'

import SocialWallLayout from '@/components/Layout/SocialWallLayout'
import SocialWall from '@/views/SocialWall/SocialWall'
import SocialWallProfile from '@/views/SocialWall/SocialWallProfile'

import ProducerLayout from '@/components/Layout/ProducerLayout'
import ProducersList from '@/views/Producers/ProducersList'
import ProducerDetail from '@/views/Producers/ProducerDetail'
import ProducerCreate from '@/views/Producers/ProducerCreate'

import SettingsLayout from '@/components/Layout/SettingsLayout'
import Settings from '@/views/Settings/Settings'

import { I18nUtil } from '@/I18nUtil'
import ProductNew from '@/views/Products/ProductNew.vue'
import GlobalSolutionsList from '@/views/GlobalSolutions/GlobalSolutionsList.vue'
import CompetitorProductDetail from '@/views/CompetitorProducts/CompetitorProductDetail.vue'
import {ROUTE_NAMES} from "@/config/constants";

export function setupRouter(i18n) {
  const PAGE_TYPES = {
    FREE: 'FREE',
    AUTH: 'AUTH',
    PRIVATE: 'PRIVATE',
  }

  const routes = [
    {
      path: '/',
      name: 'Home',
      component: AppIndex,
      meta: {
        authType: PAGE_TYPES.FREE,
      },
      redirect: '/login',
    },
    {
      path: '/privacy',
      name: 'Privacy',
      component: Privacy,
      meta: {
        authType: PAGE_TYPES.FREE,
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        authType: PAGE_TYPES.AUTH,
      },
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        authType: PAGE_TYPES.AUTH,
      },
    },
    {
      path: '/',
      redirect: 'login',
      name: 'CloudLayout',
      component: CloudLayout,
      children: [
        {
          path: 'ehub-cloud/:folderId?',
          name: 'ehubCloud',
          component: CloudList,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [],
          },
        },
      ],
    },
    {
      path: '/',
      redirect: 'login',
      name: 'ProductLayout',
      component: ProductLayout,
      children: [
        {
          path: 'products',
          name: 'Products',
          component: ProductList,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [],
          },
        },
        {
          path: 'products/new',
          name: 'New product',
          component: ProductNew,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                name: 'Products',
                path: 'products',
              },
            ],
          },
        },
        {
          path: 'products/:id',
          name: 'Product',
          component: ProductDetails,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                name: 'Products',
                path: 'products',
              },
            ],
          },
        },
        {
          path: 'products/:id/edit',
          name: 'EditProduct',
          component: ProductNew,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                name: 'Products',
                path: 'products',
              },
            ],
          },
        },
        {
          path: 'globalproducts',
          name: 'Global Products',
          component: GlobalProductList,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [],
          },
        },
        {
          path: 'GlobalProducts/new',
          name: 'New Global Product',
          component: GlobalProductNew,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                name: 'Global Products',
                path: 'GlobalProducts',
              },
            ],
          },
        },
        {
          path: 'GlobalProducts/:id',
          name: 'GlobalProduct',
          component: ProductDetails,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                name: 'GlobalProducts',
                path: 'GlobalProducts',
              },
            ],
          },
        },
        {
          path: 'GlobalProducts/:id/edit',
          name: 'EditGlobalProduct',
          component: GlobalProductNew,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                name: 'Global Products',
                path: 'GlobalProducts',
              },
            ],
          },
        },
        {
          path: 'competitor-products/:id',
          name: 'Competitor Product',
          component: CompetitorProductDetail,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                name: 'Competitor Products',
                path: 'competitor-products',
              },
            ],
          },
        },
        {
          path: 'competitor-products',
          name: 'Competitor Products',
          component: () =>
            import('../views/CompetitorProducts/CompetitorProductList'),
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [],
          },
        },
      ],
    },
    {
      path: '/',
      redirect: 'login',
      name: 'SolutionLayout',
      component: SolutionLayout,
      children: [
        {
          path: 'solutions',
          name: 'Solutions',
          component: SolutionList,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [],
          },
        },
        {
          path: 'solutions/:id',
          name: 'Solution',
          component: SolutionDetails,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                name: 'Solution',
                path: 'solutions',
              },
            ],
          },
        },
        {
          path: 'crops',
          name: 'Esperienza Globale',
          component: () => import('../views/Crops/CropList'),
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [],
          },
        },
        {
          path: 'global-solutions',
          name: 'Soluzioni Globali',
          component: GlobalSolutionsList,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [],
          },
        },
      ],
    },
    {
      path: '/',
      redirect: 'login',
      name: 'TankMixLayout',
      component: TankMixLayout,
      children: [
        {
          path: 'tank-mix',
          name: ROUTE_NAMES.TANK_MIX_SELECTION,
          component: TankMixSelection,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [],
          },
        },
        {
          path: 'tank-mix/list',
          name: ROUTE_NAMES.TANK_MIX_COMBINATION,
          component: TankMixList,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                name: 'TankMix',
                path: '',
              },
            ],
          },
        },
        {
          path: 'tank-mix/advance-search',
          name: ROUTE_NAMES.TANK_MIX_ADVANCE_SEARCH,
          component: TankMixAdvanceSearch,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                name: 'TankMix',
                path: '',
              },
            ],
          },
        },
        {
          path: 'tank-mix/:id',
          name: ROUTE_NAMES.TANK_MIX_DETAIL,
          component: TankMixDetails,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                path: '',
                name: 'TankMix',
              },
              {
                path: 'tank-mix/list',
                name: 'Combinazioni',
              },
            ],
          },
        },
      ],
    },

    {
      path: '/',
      redirect: 'login',
      name: 'MyActivitiesLayout',
      component: MyActivitiesLayout,
      children: [
        {
          path: 'myActivities',
          name: 'myActvities',
          component: MyActivities,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [],
          },
        },
      ],
      meta: {
        authType: PAGE_TYPES.PRIVATE,
        breadcrumbs: [],
      },
    },

    {
      path: '/',
      redirect: 'login',
      name: 'SocialWallLayout',
      component: SocialWallLayout,
      children: [
        {
          path: 'socialwall',
          name: 'Social Wall',
          component: SocialWall,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [],
          },
        },
        {
          path: 'socialwall/profile/:id',
          name: 'Social Wall Profilo',
          component: SocialWallProfile,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                name: 'Social Wall',
                path: 'SocialWall',
              },
            ],
          },
        },
      ],
    },

    {
      path: '/',
      redirect: 'login',
      name: 'ProducerLayout',
      component: ProducerLayout,
      children: [
        {
          path: 'producers',
          name: ROUTE_NAMES.PRODUCER_LIST,
          component: ProducersList,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [],
          },
        },
        {
          path: 'producers/create',
          name: ROUTE_NAMES.PRODUCER_CREATE,
          component: ProducerCreate,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                path: 'producers',
                name: 'PARTY_VIEW_COMPETITORS_TITLE',
              },
            ],
          },
        },
        {
          path: 'producers/:id',
          name: ROUTE_NAMES.PRODUCER_DETAIL,
          component: ProducerDetail,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                path: 'producers',
                name: 'PARTY_VIEW_COMPETITORS_TITLE',
              },
            ],
          },
        },
      ],
    },

    {
      path: '/',
      redirect: 'login',
      name: 'DashboardLayout',
      component: DashboardLayout,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: DashBoard,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [],
          },
        },
      ],
    },
    {
      path: '/',
      redirect: 'login',
      name: 'CategoriesLayout',
      component: CategoriesLayout,
      children: [
        {
          path: 'categories',
          name: 'Categories',
          component: Categories,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [],
          },
        },
        {
          path: 'categories/:code',
          name: 'Category',
          component: Category,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                name: 'Categories',
                path: 'categories',
              },
            ],
          },
        },
        {
          path: 'categories/:code/new-article',
          name: 'NewArticle',
          component: NewArticle,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                name: 'Categories',
                path: 'categories',
              },
              {
                name: 'Articles',
                path: 'categories/:code',
              },
            ],
          },
        },
        {
          path: 'categories/:code/:id',
          name: 'Article',
          component: Article,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                name: 'Categories',
                path: 'categories',
              },
              {
                name: 'Articles',
                path: 'categories/:code',
              },
            ],
          },
        },
        {
          path: 'categories/:code/:id/edit',
          name: 'EditArticle',
          component: EditArticle,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [
              {
                name: 'Categories',
                path: 'categories',
              },
              {
                name: 'Articles',
                path: 'categories/:code',
              },
            ],
          },
        },
      ],
    },
    {
      path: '/',
      redirect: 'login',
      name: 'SettingsLayout',
      component: SettingsLayout,
      children: [
        {
          path: 'settings',
          name: 'Settings',
          component: Settings,
          meta: {
            authType: PAGE_TYPES.PRIVATE,
            breadcrumbs: [],
          },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Error',
      component: Error,
    },
  ]

  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
  })

  // Authentication Guard
  router.beforeEach((to, from, next) => {
    // make sure scroll to top on each route change
    window.scrollTo(0, 0)

    const user = store.getters.getUser
    if (user) {
      const language = user.systemLanguage.isoCode
      console.debug('User language is ', language)
      if (language !== i18n.global.locale) {
        console.debug('Set new language ', i18n.global.locale)
        I18nUtil.setI18nLanguage(i18n.global, language)
      }
    }

    // Authenticated pages
    if (to.meta.authType === PAGE_TYPES.PRIVATE) {
      // if logged in
      if (store.state.user) {
        next()
      } else {
        next({ name: 'Login' })
      }
    } else if (to.meta.authType === PAGE_TYPES.AUTH) {
      // if logged in
      if (store.state.user) {
        next({ name: 'Dashboard' })
      } else {
        next()
      }
    } else {
      next()
    }
  })

  return router
}
