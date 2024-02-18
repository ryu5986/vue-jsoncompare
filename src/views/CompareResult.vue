<script lang="ts" setup>
    import '@/assets/css/result.css'
    import { useJsonDataStore } from '@/stores/jsonData'
    import { ref, onMounted} from 'vue';
    import { useRouter } from 'vue-router';
    import { isEmpty } from '@/utils';
    import type { CheckboxItem } from '@/types';

    onMounted(() => {
      loadPageItems();
    });

    const router = useRouter();
    const jsonDataStore = useJsonDataStore();    
    const compareDataGroup = jsonDataStore.compareDataGroup;

    const totalMsgDataArr = compareDataGroup.totalMessageDataArray;

    const leftSaveDataArr = compareDataGroup.leftSaveDataArray;
    const rightSaveDataArr = compareDataGroup.rightSaveDataArray;

    const missObjectCnt = compareDataGroup.missObjectCnt;
    const notContainsArrValCnt = compareDataGroup.notContainsArrValCnt;
    const notEqualTypeCnt = compareDataGroup.notEqualTypeCnt;
    const notEqualLengthArrCnt = compareDataGroup.notEqualLengthArrCnt;
    const notEqualArrValCnt = compareDataGroup.notEqualArrValCnt;
    const notEqaulValCnt = compareDataGroup.notEqaulValCnt;
    const totalCnt = compareDataGroup.totalCnt;

    const messageItems = ref<string[]>(['']);
    const currentPage = ref<number>(1);
    const totalPages = ref<number>(totalMsgDataArr.length % 5 > 0 ?  Math.ceil(totalMsgDataArr.length / 5) : totalMsgDataArr.length);
  
    const clickFlag = ref<boolean>(false);    
    const clickMsgData = ref<string>('');

    /**
     * 체크박스 아이템
     */
    const checkboxItems = ref<CheckboxItem[]>([
        {label: 'Objects that can\'t find each other : ' + missObjectCnt, isChecked:true, classNm: 'missingObject'},
        {label: 'The value in the array does not exist : ' + notContainsArrValCnt, isChecked:true, classNm: 'notContainsArr'},
        {label: 'not of the same type : ' + notEqaulValCnt, isChecked:true, classNm: 'notEqualType'},
        {label: 'Arrays are of unequal length : ' + notEqualLengthArrCnt, isChecked:true, classNm: 'notEqualArrLength'},
        {label: 'The values ​​in the array are not the same : ' + notEqualArrValCnt, isChecked:true, classNm: 'notEqualArrVal'},
        {label: 'not the same value : ' + notEqualTypeCnt, isChecked:true, classNm: 'notEqualVal'}
    ]);

    /**
     * 체크박스 클릭했을 때 이벤트
     * @param className 
     * @param idx 
     */
    const changeBackground = (className: string, idx: number) => {
     
      checkboxItems.value[idx].isChecked = !checkboxItems.value[idx].isChecked;

      const chkFlag: boolean = checkboxItems.value[idx].isChecked;
      const classGroup = document.querySelectorAll('.' + className);
      const newClassName: string = 'removeBackground';
      
      if(chkFlag){            

        classGroup.forEach((element) => {

          element.classList.remove(newClassName);

        })

      }else{

        classGroup.forEach((element) => {

          element.classList.add(newClassName);

        })
        
      }

    }

    /**
     * 페이징 처리
     * @param newPage 
     */
    const changePage = (newPage: number) => {
       
        currentPage.value = newPage;
        loadPageItems();
        
    }

    /**
     * 페이징 데이터 불러오기
     */
    const loadPageItems = () =>{
      
      clickFlag.value = false;
      clickMsgData.value = '';

      const pageSize = 5;

      const startIdx = (currentPage.value - 1) * pageSize;
      const endIdx = Math.min(startIdx + pageSize, totalPages.value * pageSize);
      messageItems.value = [];

      const sliceMsgDataArr = totalMsgDataArr.slice(startIdx, endIdx);
      const hiddens = document.querySelectorAll('input[type="hidden"]'); 

      for(const removeHidden of hiddens){

        removeHidden.parentElement?.classList.remove('clickElement');

      }

      for(const item of sliceMsgDataArr){

        messageItems.value.push(item.message);

        for (const hidden of hiddens) {

          if (hidden instanceof HTMLInputElement && hidden.value.indexOf(item.keyword) != -1) {

              hidden.parentElement?.classList.add('clickElement');

          }
          
        }

      }

    }

    /**
     * row 클릭 했을 때 이벤트
     * @param classNm 
     * @param event 
     */
    const clickDataRow = (classNm: string, event: Event) => {
      
      if(!isEmpty(classNm)){
        
        const classGroup = document.querySelectorAll('.clickElement'); 

        for(const classItem of classGroup){

          classItem.classList.remove('clickElement');

        }

        const clickElement = event.target as HTMLElement;
        const vRowElement = clickElement.closest('.v-row') as HTMLElement | null;
        
        if (vRowElement) {

          vRowElement.classList.add('clickElement');

          const hiddenElement = vRowElement?.querySelector('input[type="hidden"]') as HTMLElement | null;
            
          if (hiddenElement instanceof HTMLInputElement && !isEmpty(hiddenElement.value)) {

            for(const msgData of totalMsgDataArr){

              if(hiddenElement.value.indexOf(msgData.keyword) != -1){

                clickFlag.value = true;
                clickMsgData.value = msgData.message;

                window.scrollTo({
                  top: 100,
                  behavior: 'smooth'
                });
                    
              }

            }

          }

        }
        
      }
    }

    /**
     * 홈으로
     */
    const goToHome = () => {
      router.push({ name : 'home'});
    }

   
    
</script>

<template>
  <v-container>      
      <v-row>
        <v-col cols="4" class="sideArea pa-5">
            <v-row v-for="(item, index) in leftSaveDataArr" :key="index" :class="item.className" @click="clickDataRow(item.className, $event)">
              <input type="hidden" :value="item.convertText" />
              <v-col cols="1" class="pa-2">{{ index + 1 }}</v-col>
              <v-col cols="11" class="pa-2"><pre>{{ item.htmlText }}</pre></v-col>
            </v-row>
        </v-col>
        <v-col cols="4" class="sideArea pa-5">
          <v-row v-for="(item, index) in rightSaveDataArr" :key="index" :class="item.className" @click="clickDataRow(item.className, $event)">
              <input type="hidden" :value="item.convertText" />
              <v-col cols="1" class="pa-2">{{ index + 1 }}</v-col>
              <v-col cols="11" class="pa-2"><pre>{{ item.htmlText }}</pre></v-col>
            </v-row>
        </v-col>
        <v-col cols="4" class="pa-5">
          <v-row class="text-center">
            <v-spacer></v-spacer>
            <v-col cols="4">
              <v-btn color="success" class="mt-5" @click="goToHome">Go to home</v-btn>         
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
          <v-row>
            <v-col><v-alert v-model="clickFlag" type="info" icon="$info" closable>{{ clickMsgData }}</v-alert></v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-alert type="warning">{{ totalCnt }} points of differentiation</v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col v-for="(item, index) in checkboxItems" :key="index" cols="5">
              <v-checkbox v-model="item.isChecked" :label="item.label" @click="changeBackground(item.classNm, index)"></v-checkbox>
            </v-col>
          </v-row>
          <v-row class="text-center">
            <v-col cols="12">
              <v-pagination v-model="currentPage" :length="totalPages" @first="changePage(currentPage)" @last="changePage(totalPages)" @prev="changePage(currentPage)" @next="changePage(currentPage)" @update:modelValue="changePage(currentPage)"></v-pagination>
           </v-col>
          </v-row>
          <v-row v-for="(item, index) in messageItems" :key="index" class="text-left">
            <v-spacer></v-spacer><v-col cols="10"><v-card class="pa-5">{{ item }}</v-card></v-col><v-spacer></v-spacer>
          </v-row>
        </v-col>
      </v-row>
  </v-container>
</template>