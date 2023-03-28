<script setup>
    import { clone } from 'lodash'
    import { computed, onMounted, reactive, ref } from 'vue'
    import { useStore } from 'vuex'
// icons
    import CheckIcon from '@/assets/icons/icon-system-check@2x-white.png'
    import AuthImage from '@/components/base/AuthImage/AuthImage'
// services
    import CloudService from '@/services/Cloud/CloudService'
// utils
    import { includesLowStr } from '@/utils/util'

    const props = defineProps({
        selectedItems: Array,
    })

    const emit = defineEmits(['onSelectItem'])
    const store = useStore()

    const user = computed(() => store.getters.getUser)
    const selectedOptions = ref([])

    const searchQuery = ref('')
    const isLoading = ref(false)
    const data = ref([])

    const onSelect = (item) => {
        selectedOptions.value = [item]
        emit('onSelectItem', item)
    }

    onMounted(async () => {
        await fetchData()
        selectedOptions.value = clone(props.selectedItems || [])
    })

    const fetchData = async () => {
        if (isLoading.value) {
            return
        }
        isLoading.value = true
        const result = await new CloudService().service.getMarkets()
        data.value = result
        isLoading.value = false
    }

    const filterData = computed(() => {
        if (!searchQuery.value) {
            return data.value
        }

        return data.value.filter((m) => includesLowStr(m.name, searchQuery.value))
    })

    const tickedChecking = (value) => {
        return selectedOptions.value.findIndex((v) => v.id === value.id) !== -1
    }
</script>

<template>
    <div class='d-flex flex-column'>
        <div class='extend-items'>
            <div
                v-for='item in filterData'
                :key='item.id'
                class='d-flex flex-row align-center justify-space-between content'
                @click.prevent='onSelect(item)'
                >
                <div class='icon'>
                    <AuthImage
                        v-if='item.imageUrl'
                        :height='169'
                        :path='item.imageUrl'
                        :width='128'
                        />
                    <img
                        v-else
                        alt='Product Image'
                        src='/images/img-product-actiwave.png'
                        />
                </div>
                <div class='d-flex align-center content-info'>
                    <div class='info'>
                        <div class='item-name'>{{ item.name }}</div>
                    </div>
                </div>
                <div v-if='tickedChecking(item)' class='tick-icon rounded-circle'>
                    <img :src='CheckIcon' alt='Check' class='fill-height' />
                </div>
            </div>
            <div
                v-if='isLoading'
                class='d-flex spinning justify-center align-center pt-3'
                >
                <v-progress-circular indeterminate size='64'></v-progress-circular>
            </div>
        </div>
        <div class='popup-shadow-box'></div>
    </div>
</template>

<style lang='scss' scoped>
    .content {
        display: flex;
        cursor: pointer;
        position: relative;
        padding: 10px 0;
        border-bottom: solid 1px var(--grey);

        .content-info {
            min-height: 60px;
        }

        .info {
            align-items: center;
            margin-left: 12px;

            .item-name {
                font-size: 16px;
                font-weight: bold;
                font-stretch: normal;
                font-style: normal;
                line-height: normal;
                letter-spacing: normal;
                color: var(--text);
                min-height: 22px;
                margin-top: 6px;
            }

            .item-code {
                display: inline;
                padding: 2px 5px;
                border-radius: 13.5px;
                font-weight: 500;
                font-stretch: normal;
                font-style: normal;
                line-height: 1;
                letter-spacing: normal;
                color: var(--white);
            }
        }
    }

    .popup-shadow-box {
        position: absolute;
        bottom: 0;
        height: 60px;
        width: 100%;
        border-bottom-right-radius: 20px;
        border-bottom-left-radius: 20px;
        background-image: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0),
            var(--white) 82%
            );
    }

    .extend-items {
        max-height: 330px;
        overflow-y: scroll;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        padding: 10px 20px;
        margin-bottom: 10px;
        cursor: pointer;

        &::-webkit-scrollbar {
            width: 8px;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 7.5px;
            background-color: var(--grey);
        }

        .icon {
            width: 40px;
            height: 40px;
        }
    }

    .search-input {
        height: 55px;
        background-color: var(--background-blue);
        border-radius: 17px;

        &:focus-visible,
            &:focus {
            outline: none;
        }

        &::-webkit-input-placeholder {
            font-style: italic;
            color: var(--grey-dark);
        }

        &:-moz-placeholder {
            font-style: italic;
            color: var(--grey-dark);
        }

        &::-moz-placeholder {
            font-style: italic;
            color: var(--grey-dark);
        }

        &:-ms-input-placeholder {
            font-style: italic;
            color: var(--grey-dark);
        }
    }

    .icon {
        display: flex;
        align-items: center;
        width: 46px;
        height: 65px;

        img {
            width: 100%;
            height: 100%;
        }
    }

    .tick-icon {
        height: 23px;
        width: 23px;
        background-image: linear-gradient(to bottom, #009982, var(--primary));
    }

    .search-icon {
        height: 20px;
        width: 20px;
        z-index: 100;
        right: 0;
    }
</style>
