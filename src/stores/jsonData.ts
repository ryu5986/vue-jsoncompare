import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { CompareDataGroup } from '@/types';

export const useJsonDataStore = defineStore('jsondata', () => {

    const leftSideData = ref<string>('');
    const rightSideData = ref<string>('');
    const encryptKey = ref<string>('');

    const compareDataGroup = reactive<CompareDataGroup>({
        leftMessageDataArray: [],
        rightMessageDataArray: [],
        totalMessageDataArray: [],
        leftSaveDataArray: [],
        rightSaveDataArray: [],
        missObjectCnt: 0,
        notContainsArrValCnt: 0,
        notEqualTypeCnt: 0,
        notEqualLengthArrCnt: 0,
        notEqualArrValCnt: 0,
        notEqaulValCnt: 0,
        totalCnt: 0
    });


    return { leftSideData, rightSideData, encryptKey, compareDataGroup }
})