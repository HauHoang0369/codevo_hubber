<script setup>
import FilterIcon from '@/components/base/icons/FilterIcon.vue'

const props = defineProps({
  total: Number,
  value: Number,
  type: String,
  isFilterEnabled: { type: Boolean, default: true },
})

const emit = defineEmits(['toggle'])

const toggleFilterCard = () => {
  emit('toggle')
}
</script>

<template>
  <div>
    <div class="top-filters-menu">
      <span class="top-filters-item top-filters-item__title">
        <p class="filter-message">
          Stai vedendo {{ value || 0 }} di {{ total || 0 }}
          {{ type || 'prodotti' }}
        </p>
      </span>
      <span v-if="isFilterEnabled" class="top-filters-item">
        <span class="filter-button" @click="toggleFilterCard">
          <FilterIcon />
        </span>
      </span>
    </div>
  </div>
  <!--  <div class="filters-container" >-->
  <!--    <h4>Filtra per</h4>-->
  <!--    <div class="filters-inner">-->
  <!--      <div class="filter-list">-->
  <!--        <div class="filter-list-item">-->
  <!--          <span class="filter-list-item-title">Mostra solo i preferiti</span>-->
  <!--          <span><v-switch inset hide-details></v-switch></span>-->
  <!--        </div>-->
  <!--        <div class="filter-list-item">-->
  <!--          <span class="filter-list-item-title">Mostra solo ne novità</span>-->
  <!--          <span><v-switch inset hide-details></v-switch></span>-->
  <!--        </div>-->
  <!--        <div class="my-3">-->
  <!--          <span class="filter-list-item-title">Filtra per categoria di prodotto</span>-->
  <!--          <div class="mt-3">-->
  <!--            <v-chip size="small" class="product-tag product-tag-green mx-1">Bio</v-chip>-->
  <!--            <v-chip size="small" class="product-tag product-tag-green mx-1">Bio</v-chip>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<style type="text/css">
.top-filters-menu {
  margin-top: 15px;
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
}

.top-filters-item {
  font-size: 0.7em;
  font-weight: bolder;
  color: var(--primary);
}

.filter-button {
  width: 35px;
  height: 35px;
  background-color: white;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  border-radius: 13px;
  padding: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.filter-message {
  color: var(--text);
}

.filters-container {
  width: 100%;
  margin-top: 20px;
  padding: 20px 35px;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
  display: none;
}

.filters-container.filters-opened {
  display: inline-block;
}

.filters-inner {
  margin-top: 15px;
}

.filter-list-item {
  display: flex;
  align-items: center;
}

.filter-list-item-title {
  margin-right: 50px;
}
</style>
