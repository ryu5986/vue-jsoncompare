import { defineStore } from 'pinia'
import type { SaveCompareData } from '@/types';
import { computed, reactive, ref, watch } from 'vue';
import _ from 'lodash';

export const useJsonDataStore = defineStore('jsondata', () => {

    const encryptKey = ref<string>('');
    const encryptKeyMap = ref<Map<string, SaveCompareData>>(new Map());

    const saveData = reactive<SaveCompareData>({

        leftData: '',
        rightData: ''
        
    });
    
    const findEncryptKey = computed(() => {

        return encryptKeyMap.value.get(encryptKey.value);

    })

    watch(saveData, (newValue, oldValue) => {

        if(!_.isEqual(newValue, oldValue)){

            encryptKeyMap.value.set(encryptKey.value, newValue);

        }

    })

    return { saveData, encryptKey, encryptKeyMap, findEncryptKey }
})