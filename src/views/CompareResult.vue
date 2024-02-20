<script lang="ts" setup>
  import '@/assets/css/result.css'
  import _ from 'lodash';
  import { ref } from 'vue';
  import { inject } from 'vue';
  import { CompareData } from '@/types/compareData';
  import { useJsonDataStore } from '@/stores/jsonData'
  import { useRouter, useRoute } from 'vue-router';
  import { getCompareResultByEncryptkey } from '@/service';
  import type { SaveDataItem, CheckboxItem, MessageDataItem } from '@/types';

  const openDialog = inject<Function>('openDialog')!!;
  const route = useRoute();
  const router = useRouter();
  const paramKey = route.query.key as string;

  const messageItems = ref<string[]>([]);
  const currentPage = ref<number>(1);
  const totalPages = ref<number>(0);

  const clickFlag = ref<boolean>(false);    
  const clickMsgData = ref<string>('');

  const jsonDataStore = useJsonDataStore();
  jsonDataStore.encryptKey = paramKey;
  const saveObject = jsonDataStore.findEncryptKey;

  const totalMsgDataArr = ref<MessageDataItem[]>([]);
  const leftSaveDataArr = ref<SaveDataItem[]>([]);
  const rightSaveDataArr = ref<SaveDataItem[]>([]);

  const totalCnt = ref<number>(0);

  const checkboxItems = ref<CheckboxItem[]>([]);

  /**
   * 랜더링 세팅하기
   * @param existFlag 
   */
  const preparingForRendering = async (existFlag: boolean) => {

    let leftData = '';
    let rightData = '';

    if(existFlag){

      leftData = saveObject?.leftData as string;
      rightData = saveObject?.rightData as string;

    }else{

      const compareResult = await getCompareResultByEncryptkey(paramKey);

      if(!_.isEmpty(compareResult.result)){
        
        const data = compareResult.result;
        leftData = data.leftData;
        rightData = data.rightData;
  
      }else{
  
        openDialog('잘못된 접근입니다.');
        goToHome();
  
      }

    }

    setDataValues(leftData, rightData);

  }

  /**
   * 데이터 값 세팅하기
   * @param leftData 
   * @param rightData 
   */
  const setDataValues = (leftData: string, rightData: string) => {

    const compareData = new CompareData(leftData, rightData);

    totalMsgDataArr.value = compareData.totalMessageDataArray;
    leftSaveDataArr.value = compareData.leftSaveDataArray;
    rightSaveDataArr.value = compareData.rightSaveDataArray;

    checkboxItems.value.push({label: 'Objects that can\'t find each other : ' + compareData.missObjectCnt, isChecked:true, classNm: 'missingObject'});
    checkboxItems.value.push({label: 'The value in the array does not exist : ' +  compareData.notContainsArrValCnt, isChecked:true, classNm: 'notContainsArr'});
    checkboxItems.value.push({label: 'not of the same type : ' + compareData.notEqualTypeCnt, isChecked:true, classNm: 'notEqualType'});
    checkboxItems.value.push({label: 'Arrays are of unequal length : ' + compareData.notEqualLengthArrCnt, isChecked:true, classNm: 'notEqualArrLength'});
    checkboxItems.value.push({label: 'The values ​​in the array are not the same : ' + compareData.notEqualArrValCnt, isChecked:true, classNm: 'notEqualArrVal'});
    checkboxItems.value.push({label: 'not the same value : ' + compareData.notEqaulValCnt, isChecked:true, classNm: 'notEqualVal'});

    totalCnt.value = compareData.totalCnt;
    totalPages.value = totalMsgDataArr.value.length % 5 > 0 ?  Math.ceil(totalMsgDataArr.value.length / 5) : totalMsgDataArr.value.length;

    changePage(currentPage.value);

  }
  
  /**
   * 페이지 데이터 세팅하기
   */
  if(!_.isEmpty(saveObject)){
   
    preparingForRendering(true);

  }else{

    preparingForRendering(false);

  }

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

    const sliceMsgDataArr = totalMsgDataArr.value.slice(startIdx, endIdx);
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
    
    if(!_.isEmpty(classNm)){
      
      const classGroup = document.querySelectorAll('.clickElement'); 

      for(const classItem of classGroup){

        classItem.classList.remove('clickElement');

      }

      const clickElement = event.target as HTMLElement;
      const vRowElement = clickElement.closest('.v-row') as HTMLElement | null;
      
      if (vRowElement) {

        vRowElement.classList.add('clickElement');

        const hiddenElement = vRowElement?.querySelector('input[type="hidden"]') as HTMLElement | null;
          
        if (hiddenElement instanceof HTMLInputElement && !_.isEmpty(hiddenElement.value)) {

          for(const msgData of totalMsgDataArr.value){

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
  function goToHome(){

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