<template>
  <button class="social-btn" v-bind="$attrs">
    <span class="social-btn-icon">
      <!-- facebook -->
      <svg
        v-if="type === 'facebook'"
        width="20"
        height="21"
        viewBox="0 0 20 21"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.677 20.826v-7.747H8.073v-3.021h2.604V7.83c0-1.267.354-2.248 1.061-2.942.708-.695 1.652-1.042 2.832-1.042.999 0 1.771.039 2.318.117v2.695l-1.589.013c-.59 0-.987.122-1.19.365-.205.243-.307.608-.307 1.094v1.927h2.982l-.39 3.02h-2.592v7.748h2.448c1.033 0 1.916-.367 2.65-1.1.733-.734 1.1-1.617 1.1-2.65v-12.5c0-1.033-.367-1.916-1.1-2.65-.734-.733-1.617-1.1-2.65-1.1H3.75c-1.033 0-1.916.367-2.65 1.1C.367 2.66 0 3.543 0 4.576v12.5c0 1.033.367 1.916 1.1 2.65.734.733 1.617 1.1 2.65 1.1h6.927z"
          fill="#3B5998"
          fill-rule="evenodd"
        />
      </svg>

      <!-- google -->
      <svg
        v-if="type === 'google'"
        width="20"
        height="21"
        viewBox="0 0 20 21"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <path
            d="M10 20c1.892 0 3.57-.417 5.033-1.25a8.555 8.555 0 0 0 3.378-3.47c.79-1.48 1.185-3.162 1.185-5.046a9.46 9.46 0 0 0-.156-1.666H10v3.437h5.677c-.052.321-.15.66-.293 1.016a4.975 4.975 0 0 1-.67 1.133c-.304.399-.66.755-1.068 1.067-.408.313-.929.573-1.563.782a6.638 6.638 0 0 1-2.083.312 5.975 5.975 0 0 1-3.105-.846 6.237 6.237 0 0 1-2.26-2.298A6.258 6.258 0 0 1 3.802 10c0-1.146.278-2.203.833-3.17a6.237 6.237 0 0 1 2.26-2.299A5.975 5.975 0 0 1 10 3.685c1.589 0 2.917.516 3.984 1.55l2.722-2.618C14.839.872 12.604 0 10 0a9.83 9.83 0 0 0-3.893.788 10 10 0 0 0-3.19 2.129 10 10 0 0 0-2.13 3.19A9.83 9.83 0 0 0 0 10c0 1.363.263 2.66.788 3.893a10 10 0 0 0 2.129 3.19 10 10 0 0 0 3.19 2.13A9.83 9.83 0 0 0 10 20z"
            id="41cwlngifa"
          />
        </defs>
        <g transform="translate(0 .826)" fill="none" fill-rule="evenodd">
          <mask id="zlytmr54wb" fill="#fff">
            <use xlink:href="#41cwlngifa" />
          </mask>
          <use fill="#FB0" xlink:href="#41cwlngifa" />
          <path
            fill="#2783FC"
            mask="url(#zlytmr54wb)"
            d="M10 7.174h12v11H10z"
          />
          <path
            fill="#FF2B24"
            mask="url(#zlytmr54wb)"
            d="m.26 4.82 5.556 4.522 3.982-2.778 9.798-.229.757-8.004-10.046-3.188L-1.485.82z"
          />
          <path
            fill="#00AC47"
            mask="url(#zlytmr54wb)"
            d="m-.74 18.118 2.682 2.625 12.285.997 5.054-2.076-7.07-5.542L4.802 11.6.211 15.144z"
          />
        </g>
      </svg>

      <!-- Linkedin -->
      <svg
        v-if="type === 'linkedin'"
        width="20"
        height="21"
        viewBox="0 0 20 21"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M.314 7.152h3.959v12.726H.313V7.152zM2.294.826A2.293 2.293 0 0 0 0 3.12a2.293 2.293 0 1 0 4.587 0A2.294 2.294 0 0 0 2.295.826zm12 6.01c-1.924 0-3.215 1.055-3.742 2.056h-.054v-1.74H6.706v12.726h3.95v-6.294c0-1.66.314-3.269 2.372-3.269 2.03 0 2.055 1.899 2.055 3.375v6.188h3.955v-6.98c0-3.427-.74-6.062-4.744-6.062z"
          fill="#4875B4"
          fill-rule="evenodd"
        />
      </svg>
    </span>
    <span class="social-btn-title" :style="{ color: textColor }">
      {{ title }}
    </span>
  </button>
</template>

<script>
export default {
  props: {
    title: String,
    textColor: String,
    type: String,
  },
  computed: {},
}
</script>

<style scoped>
.social-btn {
  min-width: 270px;
  height: auto;
  margin: 15px;
  padding: 15px;
  border-radius: 24px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.social-btn-icon {
  height: 20px;
  width: 20px;
  position: absolute;
  left: 13px;
}

.social-btn-title {
  font-family: Ubuntu;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 0.78px;
}
</style>
