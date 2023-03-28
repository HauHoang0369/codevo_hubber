<script>
// TODO: Find a proper way to get vuetify breakpoint thresholds

import {capitalize} from "vue";

const breakpoints = ['sm', 'md', 'lg', 'xl', 'xxl']; // no xs
const breakpointProps = (() => {
  return breakpoints.reduce((props, val) => {
    props[val] = {
      type: [Boolean, String, Number],
      default: false
    };
    return props
  }, {})
})()
const columnGapProps = (() => {
  return breakpoints.reduce((props, val) => {
    props['columnGap' + capitalize(val)] = {
      type: [String, Number],
      default: null
    };
    return props;
  }, {});
})();

const rowGapProps = (() => {
  return breakpoints.reduce((props, val) => {
    props['rowGap' + capitalize(val)] = {
      type: [String, Number],
      default: null
    };
    return props;
  }, {});
})();

const propMap = {
  col: Object.keys(breakpointProps),
  columnGap: Object.keys(columnGapProps),
  rowGap: Object.keys(rowGapProps)
};


</script>

<script setup>
import {useDisplay} from 'vuetify'

import {computed} from "vue";

const props = defineProps({
  col: {
    type: [Boolean, String, Number, Array],
    default: false
  },
  columnGap: {
    type: [String, Number],
    default: null
  },
  rowGap: {
    type: [String, Number],
    default: null
  },
  templateColumns: {
    type: [Array],
    default: null,
  },
  ...breakpointProps, ...columnGapProps, ...rowGapProps
})

const display = useDisplay()
const currentBreakPoint = display?.name


const style = computed({
  get() {
    // get vuetify current breakpoint
    let columnCount = props[currentBreakPoint.value] ?? 1
    let columnGap = props["columnGap" + capitalize(currentBreakPoint.value)] ?? props.columnGap ?? 0
    let rowGap = props["rowGap" + capitalize(currentBreakPoint.value)] ?? props.rowGap ?? 0
    let templateColumns = "repeat(" + columnCount + ", minmax(0, 1fr))"
    if (Array.isArray(columnCount)) {
      templateColumns = ""
      columnCount.forEach(column => templateColumns += column + "fr ");
    }
    return {
      '--grid-template-columns': templateColumns,
      "--column-gap": columnGap + "px",
      "--row-gap": rowGap + "px"
    }
  },
})

</script>
<template>
  <div class="container" :style="style">
    <slot></slot>
  </div>
</template>


<style scoped>

.container {
  display: grid;
  grid-template-columns:var(--grid-template-columns);
  column-gap: var(--column-gap);
  row-gap: var(--row-gap);
}

</style>
