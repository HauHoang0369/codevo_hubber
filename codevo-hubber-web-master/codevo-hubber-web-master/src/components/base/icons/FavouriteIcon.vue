<script setup>
const props = defineProps({
  isFavourite: Boolean,
})
</script>

<template>
  <svg
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    v-if="isFavourite === true"
    style="cursor: pointer"
  >
    <defs>
      <linearGradient x1="50%" y1="100%" x2="50%" y2="0%" id="rzwe3o7xlc">
        <stop stop-color="#00604B" offset="0%" />
        <stop stop-color="#0A3D31" offset="100%" />
      </linearGradient>
      <filter
        x="-70%"
        y="-50%"
        width="200%"
        height="200%"
        filterUnits="objectBoundingBox"
        id="snlz4d207a"
      >
        <feMorphology radius="3" in="SourceAlpha" result="shadowSpreadOuter1" />
        <feOffset dy="18" in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
        <feGaussianBlur
          stdDeviation="20"
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0.376470588 0 0 0 0 0.294117647 0 0 0 0.3 0"
          in="shadowBlurOuter1"
        />
      </filter>
      <path
        d="M14.998 0c-.982 0-1.854.546-2.254 1.456L9.437 8.443 2.13 9.535a2.523 2.523 0 0 0-2.108 2.838c.073.51.327.983.69 1.383l5.38 5.532-1.272 7.788c-.218 1.346.69 2.656 2.072 2.874.545.073 1.126 0 1.599-.29l6.506-3.567 6.506 3.603c1.2.655 2.726.218 3.38-.983.254-.51.363-1.055.29-1.601l-1.271-7.788 5.379-5.495a2.484 2.484 0 0 0-.036-3.53 2.39 2.39 0 0 0-1.382-.692L20.56 8.443 17.25 1.419C16.851.546 15.98 0 14.998 0z"
        id="6eam53yhpb"
      />
    </defs>
    <g transform="translate(0 0)" fill="none" fill-rule="evenodd">
      <use fill="#000" filter="url(#snlz4d207a)" xlink:href="#6eam53yhpb" />
      <use fill="url(#rzwe3o7xlc)" xlink:href="#6eam53yhpb" />
    </g>
  </svg>

  <svg
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    v-else
    style="cursor: pointer"
  >
    <path
      d="M14.998 0c-.982 0-1.854.546-2.254 1.456L9.437 8.443 2.13 9.535a2.523 2.523 0 0 0-2.108 2.838c.073.51.327.983.69 1.383l5.38 5.532-1.272 7.788c-.218 1.346.69 2.656 2.072 2.874.545.073 1.126 0 1.599-.29l6.506-3.567 6.506 3.603c1.2.655 2.726.218 3.38-.983.254-.51.363-1.055.29-1.601l-1.271-7.788 5.379-5.495a2.484 2.484 0 0 0-.036-3.53 2.39 2.39 0 0 0-1.382-.692L20.56 8.443 17.25 1.419C16.851.546 15.98 0 14.998 0z"
      fill="#E2E4E7"
      fill-rule="evenodd"
    />
  </svg>
</template>
