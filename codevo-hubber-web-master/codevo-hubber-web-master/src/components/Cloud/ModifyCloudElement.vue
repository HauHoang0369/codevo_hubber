<script setup>
    import { computed, reactive, ref } from 'vue'
    import { useStore } from 'vuex'
    import { format } from '@/utils/day.util'
    import { readableSize } from '@/utils/util'
    import Swal from 'sweetalert2'
    import AuthImage from '@/components/base/AuthImage/AuthImage'
    import CloudService from '@/services/Cloud/CloudService'
    import BaseInput from '@/components/base/inputs/BaseInput'
    import BaseIcon from '@/components/base/icons/BaseIcon.vue'
    import CategoryDropdown from '@/components/Cloud/CategoryDropdown.vue'
    import MarketDropdown from '@/components/Cloud/MarketDropdown.vue'
    import ProductDropdown from '@/components/Cloud/ProductDropdown.vue'
    import CropDropdown from '@/components/Cloud/CropDropdown.vue'
    import SolutionDropdown from '@/components/Cloud/SolutionDropdown.vue'
    import IconClose from '@/assets/icons/icon-system-close-gray@2x.png'
    import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'

    const props = defineProps({
        cloudElement: Object,
        showProducts: Boolean,
        showSolutions: Boolean
    })

    const creationDate = computed(() => format(props.cloudElement.creationDate, 'DD MMM YYYY HH:mm'))
    const modifyDate = computed(() => format(props.cloudElement.lastChangeDate, 'DD MMM YYYY HH:mm'))
    const isSystemFolder = computed(() => props.cloudElement.documents && props.cloudElement.systemElement)
    const isRegularFolder = computed(() => props.cloudElement.documents && !props.cloudElement.systemElement)
    const isDocument = computed(() => !props.cloudElement.documents)
    const store = useStore()
    const emit = defineEmits(['close'])

    const isLoading = ref(false)

    const folderName = ref(props.cloudElement.name)
    const description = ref(props.cloudElement.description)
    const category = reactive({
        show: false,
        text: '',
        value: null,
    })
    const marketProducts = reactive({
        show: false,
        text: '',
        value: null,
    })
    const marketSolutions = reactive({
        show: false,
        text: '',
        value: null,
    })
    const product = reactive({
        show: false,
        text: '',
        value: null,
    })
    const crop = reactive({
        show: false,
        text: '',
        value: null,
    })
    const solution = reactive({
        show: false,
        text: '',
        value: null,
    })

    const selectedProducts = ref([]);
    const selectedSolutions = ref([]);

    const canModify = computed(() => (props.cloudElement.documents && folderName.value) || !props.cloudElement.documents)

    const onClose = () => {
        emit('close')
    }

    const onItemChange = (itemType, item) => {
        if (itemType.value?.id !== item.id) {
            itemType.show = false
            itemType.text = `${item.name}`
            itemType.value = item
        }
    }

    const onCategoryChange = (item) => {
        onItemChange(category, item)
    }

    const onMarketProductsChange = (item) => {
        onItemChange(marketProducts, item)
        product.value = null;
        product.text = '';
    }

    const onMarketSolutionsChange = (item) => {
        onItemChange(marketSolutions, item)
        crop.value = null;
        crop.text = '';
        solution.value = null;
        solution.text = '';
    }

    const onProductChange = (item) => {
        onItemChange(product, item)
    }

    const onCropChange = (item) => {
        onItemChange(crop, item)
        solution.value = null;
        solution.text = '';
    }

    const onSolutionChange = (item) => {
        onItemChange(solution, item)
    }

    const addSelected = (list, item) => {
        if (!list.some(e => e.id == item.value.id)) {
            list.push(item.value);
        }
    }

    const removeSelected = (list, index) => {
        list.splice(index, 1);
    }

    const modifyElement = async () => {
        store.commit('setLoading', true)
        if (canModify.value) {
            try {
                if (isDocument.value) {
                    await new CloudService().service.modifyDocument(getDocumentPayload())
                } else {
                    await new CloudService().service.modifyFolder(getFolderPayload())
                }
                emit('newElement')
                onClose()
            } catch (e) {
                console.log(e)
                await Swal.fire({
                    icon: 'error',
                    titleText: 'Something went wrong!',
                    customClass: {
                        popup: 'hubber-swal-popup'
                    }
                })
                onClose()
            }
        }
    }

    const getFolderPayload = () => {
        return {id: props.cloudElement.id, name: folderName.value, description: description.value};
    }

</script>

<template>
    <div class='hubber-dialog-box'>
        <div class='dialog-close' v-on:click='onClose'>
            <img :src='IconClose' class='close-icon' />
        </div>
        <div class='title-container d-flex flex-row justify-center'>
        </div>
        <div v-if='!isDocument' class='dialog-content'>
            <div class='d-flex flex-row'>
                <div v-if='isSystemFolder'>
                    <img src="@/assets/icons/icon-detailed-folder-locked.png"
                         srcset="@/assets/icons/icon-detailed-folder-locked@2x.png 2x,
                         @/assets/icons/icon-detailed-folder-locked@3x.png 3x"
                         class="Icondetailedfolder_locked">
                </div>
                <div v-if='isRegularFolder'>
                    <img src="@/assets/icons/icon-detailed-folder.png"
                         srcset="@/assets/icons/icon-detailed-folder@2x.png 2x,
                         @/assets/icons/icon-detailed-folder@3x.png 3x"
                         class="Icondetailedfolder">
                </div>
                <input
                    v-model="folderName"
                    class='folder-name-input w-50 pr-10 justify-center'
                    placeholder='Inserisci il nome della nuova cartella'
                    type='text'
                    />
            </div>
            <base-input label="Descrizione" v-model="description"/>
        </div>
        <div v-if='isDocument' class='dialog-content'>
            <v-container>
                <v-row no-gutters>
                    <v-col md='1'>
                        <img src="@/assets/icons/icon-detailed-doc.png"
                             srcset="@/assets/icons/icon-detailed-doc@2x.png 2x,
                             @/assets/icons/icon-detailed-doc@3x.png 3x">
                    </v-col>
                    <v-col md='11'>
                        <div class="file-name-area">
                            <div class="nome-label">Nome file</div>
                            <div class="nome -regular-left-dark">{{cloudElement.name}}</div>
                        </div>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col md="5" class='list-dropdowns'>
                        <div v-click-outside='() => (category.show = false)'>
                            <base-input
                                v-model='category.text'
                                label='Seleziona categoria'
                                readonly
                                @click='category.show = true'
                                >
                                <template #append-inner>
                                    <base-icon
                                        class='base-select__icon'
                                        height='20'
                                        name='chevronDown'
                                        width='20'
                                        @click='category.show = true'
                                        />
                                </template>
                            </base-input>
                            <CategoryDropdown
                                v-if='category.show'
                                :selected-items='category.value ? [category.value] : []'
                                class='visibility-options position-relative'
                                @onSelectItem='onCategoryChange'
                                />
                        </div>
                    </v-col>
                    <v-col md="1">
                    </v-col>
                    <v-col md="5">
                        <base-input label="Descrizione" v-model="description"/>
                    </v-col>
                </v-row>
                <v-row v-if="!showProducts">
                    <v-col md="6">
                        <v-row>
                            <span class="prodotti-associati-label Title-mobile-left">Prodotti associati</span>
                        </v-row>
                        <v-row>
                            <v-col md="12">
                                <div v-click-outside='() => (marketProducts.show = false)'>
                                    <base-input
                                        v-model='marketProducts.text'
                                        label='Seleziona mercato'
                                        readonly
                                        @click='marketProducts.show = true'
                                        >
                                        <template #append-inner>
                                            <base-icon
                                                class='base-select__icon'
                                                height='20'
                                                name='chevronDown'
                                                width='20'
                                                @click='marketProducts.show = true'
                                                />
                                        </template>
                                    </base-input>
                                    <MarketDropdown
                                        v-if='marketProducts.show'
                                        :selected-items='marketProducts.value ? [marketProducts.value] : []'
                                        class='visibility-options position-relative'
                                        @onSelectItem='onMarketProductsChange'
                                        />
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col md="12">
                                <div v-click-outside='() => (product.show = false)'>
                                    <base-input :disabled='!marketProducts.value'
                                                v-model='product.text'
                                                label='Seleziona prodotto'
                                                readonly
                                                @click='product.show = true'
                                                >
                                        <template #append-inner>
                                            <base-icon
                                                class='base-select__icon'
                                                height='20'
                                                name='chevronDown'
                                                width='20'
                                                @click='product.show = true'
                                                />
                                        </template>
                                    </base-input>
                                    <ProductDropdown
                                        v-if='product.show'
                                        :selected-items='product.value ? [product.value] : []'
                                        :market-id='marketProducts.value.id'
                                        class='visibility-options position-relative'
                                        @onSelectItem='onProductChange'
                                        />
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col md="4">
                            </v-col>
                            <v-col md="2">
                                <ButtonPrimaryDesktop :disabled='!product.value' class='hubber-btn-primary' @click='addSelected(selectedProducts, product)'>
                                    Aggiungi
                                </ButtonPrimaryDesktop>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col>
                        <v-row>
                        </v-row>
                        <v-row>
                            <div class='extend-items'>
                                <div
                                    v-for='(product, index) in selectedProducts'
                                    :key='product.id'
                                    class='d-flex flex-row align-center justify-space-between content'>
                                    <div class='icon'>
                                        <AuthImage
                                            v-if='product.imageUrl'
                                            :height='169'
                                            :path='product.imageUrl'
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
                                            <div class='item-name'>{{ product.name }}</div>
                                        </div>
                                    </div>
                                    <div class='d-flex align-center content-info' @click='removeSelected(selectedProducts, index)'>
                                        <div class='info'>
                                            <img src="@/assets/icons/icon-system-trash.png"
                                                 srcset="@/assets/icons/icon-system-trash@2x.png 2x,
                                                 @/assets/icons/icon-system-trash@3x.png 3x"
                                                 class="Iconsystemtrash">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row v-if="!showSolutions">
                    <v-col md="6">
                        <v-row>
                            <span class="prodotti-associati-label Title-mobile-left">Soluzioni associate</span>
                        </v-row>
                        <v-row>
                            <v-col md="12">
                                <div v-click-outside='() => (marketSolutions.show = false)'>
                                    <base-input
                                        v-model='marketSolutions.text'
                                        label='Seleziona mercato'
                                        readonly
                                        @click='marketSolutions.show = true'
                                        >
                                        <template #append-inner>
                                            <base-icon
                                                class='base-select__icon'
                                                height='20'
                                                name='chevronDown'
                                                width='20'
                                                @click='marketSolutions.show = true'
                                                />
                                        </template>
                                    </base-input>
                                    <MarketDropdown
                                        v-if='marketSolutions.show'
                                        :selected-items='marketSolutions.value ? [marketSolutions.value] : []'
                                        class='visibility-options position-relative'
                                        @onSelectItem='onMarketSolutionsChange'
                                        />
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col md="12">
                                <div v-click-outside='() => (crop.show = false)'>
                                    <base-input :disabled='!marketSolutions.value'
                                                v-model='crop.text'
                                                label='Seleziona coltura'
                                                readonly
                                                @click='crop.show = true'
                                                >
                                        <template #append-inner>
                                            <base-icon
                                                class='base-select__icon'
                                                height='20'
                                                name='chevronDown'
                                                width='20'
                                                @click='crop.show = true'
                                                />
                                        </template>
                                    </base-input>
                                    <CropDropdown
                                        v-if='crop.show'
                                        :selected-items='crop.value ? [crop.value] : []'
                                        :market-id='marketSolutions.value.id'
                                        class='visibility-options position-relative'
                                        @onSelectItem='onCropChange'
                                        />
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col md="12">
                                <div v-click-outside='() => (solution.show = false)'>
                                    <base-input :disabled='!crop.value'
                                                v-model='solution.text'
                                                label='Seleziona soluzione'
                                                readonly
                                                @click='solution.show = true'
                                                >
                                        <template #append-inner>
                                            <base-icon
                                                class='base-select__icon'
                                                height='20'
                                                name='chevronDown'
                                                width='20'
                                                @click='solution.show = true'
                                                />
                                        </template>
                                    </base-input>
                                    <SolutionDropdown
                                        v-if='solution.show'
                                        :selected-items='solution.value ? [solution.value] : []'
                                        :market-id='marketSolutions.value.id'
                                        :crop-id='crop.value.id'
                                        class='visibility-options position-relative'
                                        @onSelectItem='onSolutionChange'
                                        />
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col md="4">
                            </v-col>
                            <v-col md="2">
                                <ButtonPrimaryDesktop :disabled='!solution.value' class='hubber-btn-primary' @click='addSelected(selectedSolutions, solution)'>
                                    Aggiungi
                                </ButtonPrimaryDesktop>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col>
                        <v-row>
                        </v-row>
                        <v-row>
                            <div class='extend-items'>
                                <div
                                    v-for='(solution, index) in selectedSolutions'
                                    :key='solution.id'
                                    class='d-flex flex-row align-center justify-space-between content'>
                                    <div class='icon'>
                                        <AuthImage
                                            v-if='solution.crop.iconImageUrl'
                                            :height='169'
                                            :path='solution.crop.iconImageUrl'
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
                                            <div class='item-name'>{{ solution.name }}</div>
                                        </div>
                                    </div>
                                    <div class='d-flex align-center content-info' @click='removeSelected(selectedSolutions, index)'>
                                        <div class='info'>
                                            <img src="@/assets/icons/icon-system-trash.png"
                                                 srcset="@/assets/icons/icon-system-trash@2x.png 2x,
                                                 @/assets/icons/icon-system-trash@3x.png 3x"
                                                 class="Iconsystemtrash">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </div>
        <div class='mt-13 mb-5 publish d-flex justify-center'>
            <ButtonPrimaryDesktop :disabled='isLoading || !canModify' class='hubber-btn-primary' @click='modifyElement'>
                Salva
            </ButtonPrimaryDesktop>
        </div>
    </div>
</template>

<style lang='scss' scoped>
    .hubber-dialog-box {
        padding: 20px;
        border-radius: 30px;
        box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
        background-color: var(--white);

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

            img.Iconsystemtrash {
                width: 30px;
                height: 30px;
                margin: 1px 0 1px 156px;
                object-fit: contain;
            }
        }

        .dialog-close {
            position: absolute;
            right: 20px;

            .close-icon {
                width: 30px;
                height: 30px;
                object-fit: contain;
                cursor: pointer;
            }
        }

        .title-container {
            .title {
                margin-top: 30px;
                margin-bottom: 20px;
                font-size: 30px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                line-height: 1;
                letter-spacing: normal;
                text-align: center;
                color: var(--primary);
            }
        }

        .dialog-content {
            font-size: 20px;
            font-weight: 300;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: normal;
            text-align: center;
            color: var(--text);
        }

        .file-name-area {
            margin: 42.5px 264px 42.5px 12px;
            padding: 8px 250px 12px 14px;
            border-radius: 17px;
            border: solid 1px rgba(105, 158, 255, 0.5);
            background-color: var(--white);

            .nome-label {
                margin: 0 51px 4px 6px;
                font-family: Ubuntu;
                font-size: 12px;
                font-weight: 300;
                font-stretch: normal;
                font-style: normal;
                line-height: normal;
                letter-spacing: normal;
                color: var(--text);
            }

            .nome {
                margin: 4px 0 0 6px;
                font-family: Ubuntu;
                font-size: 16px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                line-height: normal;
                letter-spacing: normal;
                color: var(--text);
            }
        }

        .folder-name-input {
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

        .prodotti-associati-label {
            width: 362px;
            height: 30px;
            margin: 40px 18px 32px 0;
            font-family: Ubuntu;
            font-size: 30px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1;
            letter-spacing: normal;
            color: var(--primary);
        }
    }

    img.Icondetailedfolder {
        width: 100px;
        height: 100px;
        margin: 30px 99px 12px 49px;
        object-fit: contain;
    }

    img.Icondetailedfolder_locked {
        width: 100px;
        height: 100px;
        margin: 30px 99px 12px 49px;
        object-fit: contain;
    }

    img.Icondetaileddoc {
        width: 100px;
        height: 100px;
        margin: 30px 99px 12px 49px;
        object-fit: contain;
    }

    .cloud-element-name {
        margin: 12px 124px 32px 74px;
        font-family: Ubuntu;
        font-size: 18px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: var(--text);
    }

    .cloud-element-label {
        margin: 32px 4px 13px 0;
        font-family: Ubuntu;
        font-size: 14px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: var(--text);
    }

    .cloud-element-attribute {
        margin: 35px 42px 13px 4px;
        font-family: Ubuntu;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: var(--text);
    }
</style>
