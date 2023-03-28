<script setup>
import {computed} from "vue";
import {includesLowStr} from "@/utils/util";

const props = defineProps({
  label: String,
  type: String,
})

const colour = computed(() => {
  // in case type and class names do not match in the future
  switch (props.type) {
    case 'feasible':
      return 'feasible'
    case 'feasible-with-caution':
      return 'feasible-with-caution'
    case 'not-feasible':
      return 'not-feasible'
  }
  return ''
})

</script>

<template>
  <div class="background d-flex flex-row justify-start align-start">

    <div class="oval" :class="colour">
    </div>
    <div class="label">
      <slot></slot>
    </div>
  </div>
</template>


<style scoped>


.background {
  /*width: 131px;
  height: 34px; */
  //margin: 22px 20px 20px;
  padding: 5px 6px;
  border-radius: 17px;
  box-shadow: 0 6px 25px -6px rgba(192, 210, 247, 0.3);
  border: solid 1px rgba(221, 233, 255, 0.27);
  background-color: var(--white);
  overflow: hidden;
}

.oval {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.label {
  /* width: 85px;
  height: 18px;*/
  margin: 3px 0 3px 10px;
  font-family: Ubuntu;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: var(--primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.feasible {
  background-color: var(--verde-acqua);
}

.feasible-with-caution {
  background-color: var(--ambra);
}

.not-feasible {
  background-color: var(--rosso);
}

</style>
