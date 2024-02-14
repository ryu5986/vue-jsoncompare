import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useJsonDataStore = defineStore('jsondata', () => {

    const leftSideData = ref<string>('');
    const rightSideData = ref<string>('');
    const message = ref<string>('');

    return {leftSideData, rightSideData, message}
})