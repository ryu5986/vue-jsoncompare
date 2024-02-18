<script lang="ts" setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router';
import type { CompareDataGroup} from '@/types/index'
import { isEmpty, uploadFile, checkFileType } from '@/utils';
import { getRecordByEncryptkey, insertRecord } from '@/service/index'
import { useJsonDataStore } from '@/stores/jsonData'
import { useDialogStore } from '@/stores/dialog'
import * as CryptoJS from 'crypto-js';
import { CompareData } from '@/types/compareData';
import { reactive } from 'vue';
import sampleJson1 from '@/assets/json/sampleJson1.json';
import sampleJson2 from '@/assets/json/sampleJson2.json';

const router = useRouter();
const jsonDataStore = useJsonDataStore();
const dialogStore = useDialogStore();

const leftData = ref<string>('');
const rightData = ref<string>('');

/**
 * 파일 읽어서 내용 표출
 * @param event 
 */
const readFileText = (event: Event, fileSideType: string) => {

  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];

  checkFileType(fileInput);

  if(!dialogStore.dialogFlag && file){

    const reader = new FileReader();

    reader.onload = (event) => {

      try {
        
        if(event?.target){
          
          const jsonString = event.target.result;

          if(typeof jsonString === 'string'){

            const jsonData = JSON.parse(jsonString);
            const formatData = JSON.stringify(jsonData, null, 2);

            if(fileSideType == 'left'){

              leftData.value = formatData;

            }else if(fileSideType == 'right'){

              rightData.value = formatData;

            }
            
          }               

        }else{

          throw new Error('파일을 읽어오는데 실패했습니다.');

        }
      
      } catch (error) {

        dialogStore.dialogFlag = true;
        dialogStore.dialogMessage = 'Error parsing JSON: ${error}';
        
      }

    };

    reader.readAsText(file, 'utf-8');
  }

}

/**
 * 샘플 데이터 불러오기
 */
const loadSampleData = () => {    

  leftData.value = JSON.stringify(sampleJson1, null, 2);
  rightData.value = JSON.stringify(sampleJson2, null, 2);

}

/**
 * 페이지 이동
 */
const goToResult = async () => {
  
    const leftEmptyFlag: boolean = isEmpty(leftData.value);
    const rightEmptyFlag: boolean = isEmpty(rightData.value);
   
    if(!leftEmptyFlag && !rightEmptyFlag){

      const encryptKey = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(leftData.value + rightData.value));

      try {
       
        let leftJsonData = '';
        let rightJsonData = '';

        const saveEncryptKey = jsonDataStore.encryptKey;

        if(!isEmpty(saveEncryptKey)){

          if(encryptKey !== saveEncryptKey){
            
            const data = await getRecordByEncryptkey(encryptKey);

            if(!isEmpty(data.result)){

              leftJsonData = data.result.leftData;
              rightJsonData = data.result.rightData;

            }else{

              leftJsonData = leftData.value;
              rightJsonData = rightData.value;
              
              await insertRecord(leftData.value, rightData.value, encryptKey);

            }

            makeCompareDataGroup(leftJsonData, rightJsonData, encryptKey);

          }
          
        }else{

          const data = await getRecordByEncryptkey(encryptKey);

          if(!isEmpty(data.result)){

            leftJsonData = data.result.leftData;
            rightJsonData = data.result.rightData;

          }else{

            leftJsonData = leftData.value;
            rightJsonData = rightData.value;
            
            await insertRecord(leftData.value, rightData.value, encryptKey);

          }

          makeCompareDataGroup(leftJsonData, rightJsonData, encryptKey);

        }

        router.push({ name : 'result'});
       
      } catch (err) {
        
        dialogStore.dialogFlag = true;
        dialogStore.dialogMessage = err;

      }

    }else{

      dialogStore.dialogFlag = true;
      dialogStore.dialogMessage = 'json data 내용을 확인해주세요.';

    }
}

/**
 * 스토어에 저장
 * @param leftJsonDataParam 
 * @param rightJsonDataParam 
 * @param encryptKeyParam 
 */
const makeCompareDataGroup = (leftJsonDataParam: string, rightJsonDataParam: string, encryptKeyParam: string) => {  
  
  const compareData = new CompareData(leftJsonDataParam, rightJsonDataParam);
  
  jsonDataStore.encryptKey = encryptKeyParam;
  jsonDataStore.compareDataGroup = reactive<CompareDataGroup>({
    
    leftMessageDataArray: compareData.leftMessageDataArray,
    rightMessageDataArray: compareData.rightMessageDataArray,
    totalMessageDataArray: compareData.totalMessageDataArray,
    leftSaveDataArray: compareData.leftSaveDataArray,
    rightSaveDataArray: compareData.rightSaveDataArray,

    missObjectCnt: compareData.missObjectCnt,
    notContainsArrValCnt: compareData.notContainsArrValCnt,
    notEqualTypeCnt: compareData.notEqualTypeCnt,
    notEqualLengthArrCnt: compareData.notEqualLengthArrCnt,
    notEqualArrValCnt: compareData.notEqualArrValCnt,
    notEqaulValCnt: compareData.notEqaulValCnt,
    totalCnt: compareData.totalCnt
  
  });

}

</script>

<template>
  <v-container>
    <v-row class="text-right">
      <v-spacer></v-spacer>
      <v-col cols="4">
        <v-btn color="black" class="mr-2" @click="loadSampleData">try some sample data</v-btn>
        <v-btn color="blue" @click="goToResult">Compare</v-btn>
      </v-col>
    </v-row>
   <v-row>
    <v-col cols="6">
        <v-textarea rows="15" v-model="leftData" no-resize></v-textarea>
        <v-file-input label="파일 선택" v-show="false" @change="readFileText($event, 'left')" id="leftFile"></v-file-input>
        <v-btn @click="uploadFile('left')" class="float-right">jsonFile</v-btn>
    </v-col>
    <v-col cols="6">
        <v-textarea rows="15" v-model="rightData" no-resize></v-textarea>
        <v-file-input label="파일 선택" v-show="false" @change="readFileText($event, 'right')" id="rightFile"></v-file-input>
        <v-btn @click="uploadFile('right')" class="float-right">jsonFile</v-btn>
    </v-col>
    </v-row>
  </v-container>
</template>@/stores/jsonData@/types/compare@/types/compareData