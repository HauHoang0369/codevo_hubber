<script setup>
    import { ref, computed } from 'vue'
    import { useStore } from 'vuex'
    import { format } from '@/utils/day.util'
    import { readableSize } from '@/utils/util'
    import Swal from 'sweetalert2'
    import IconClose from '@/assets/icons/icon-system-close-gray@2x.png'
    import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'

    const props = defineProps({
        cloudElement: Object
    })
    const creationDate = computed(() => format(props.cloudElement.creationDate, 'DD MMM YYYY HH:mm'))
    const modifyDate = computed(() => format(props.cloudElement.lastChangeDate, 'DD MMM YYYY HH:mm'))
    const isSystemFolder = computed(() => props.cloudElement.documents && props.cloudElement.systemElement)
    const isRegularFolder = computed(() => props.cloudElement.documents && !props.cloudElement.systemElement)
    const isDocument = computed(() => !props.cloudElement.documents)
    const store = useStore()
    const emit = defineEmits(['close'])

    const isLoading = ref(false)

    const onClose = () => {
        emit('close')
    }

</script>

<template>
    <div class='hubber-dialog-box'>
        <div class='dialog-close' v-on:click='onClose'>
            <img :src='IconClose' class='close-icon' />
        </div>
        <div class='title-container d-flex flex-row justify-center'>
        </div>
        <div class='dialog-content'>
            <div class='d-flex flex-row justify-center'>
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
                <div v-if='isDocument'>
                    <img src="@/assets/icons/icon-detailed-doc.png"
                         srcset="@/assets/icons/icon-detailed-doc@2x.png 2x,
                         @/assets/icons/icon-detailed-doc@3x.png 3x"
                         class="Icondetaileddoc">
                </div>
            </div>
            <div class='d-flex flex-row justify-center'>
                <div class="flex-grow-1 d-flex flex-column justify-space-between">
                    <span class="cloud-element-name Bold-left-dark">{{cloudElement.name}}</span>
                </div>
            </div>
            <div>
                <span class="cloud-element-label">Creato da:</span>
                <span class="cloud-element-attribute">{{cloudElement.ownerShownName}}, {{creationDate}}</span>
            </div>
            <div>
                <span class="cloud-element-label">Modificato da:</span>
                <span class="cloud-element-attribute">{{cloudElement.lastModifiedUserShownName}}, {{modifyDate}}</span>
            </div>
            <div>
                <span class="cloud-element-label">Percorso:</span>
                <span class="cloud-element-attribute">{{cloudElement.fullPath}}</span>
            </div>
            <div>
                <span class="cloud-element-label">Descrizione:</span>
                <span class="cloud-element-attribute">{{cloudElement.description}}</span>
            </div>
            <div v-if="isDocument">
                <span class="cloud-element-label">Tipo documento:</span>
                <span class="cloud-element-attribute">{{cloudElement.mimeType}}</span>
            </div>
            <div v-if="isDocument">
                <span class="cloud-element-label">Dimensioni:</span>
                <span class="cloud-element-attribute">{{readableSize(cloudElement.size)}}</span>
            </div>
            <div v-if="isDocument">
                <span class="cloud-element-label">Cartella:</span>
                <span class="cloud-element-attribute">{{cloudElement.parent.name}}</span>
            </div>
            <div v-if="isDocument">
                <span class="cloud-element-label">Categoria:</span>
                <span class="cloud-element-attribute">{{cloudElement.categoria}}</span>
            </div>
        </div>
    </div>
</template>

<style lang='scss' scoped>
    .hubber-dialog-box {
        padding: 20px;
        border-radius: 30px;
        box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
        background-color: var(--white);

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
