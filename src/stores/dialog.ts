import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDialogStore = defineStore('dialog', () => {

    const dialogFlag = ref<boolean>(false);
    const dialogMessage = ref<string | unknown>('');

    return { dialogFlag, dialogMessage }
})