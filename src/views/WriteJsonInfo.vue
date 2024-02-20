<script lang="ts" setup>

import _ from 'lodash';
import * as CryptoJS from 'crypto-js';
import { ref } from 'vue'
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import { uploadFile } from '@/utils';
import { useJsonDataStore } from '@/stores/jsonData'
import { getCompareResultByEncryptkey, insertCompareResult } from '@/service/index'
import sampleJson1 from '@/assets/json/sampleJson1.json';
import sampleJson2 from '@/assets/json/sampleJson2.json';

const router = useRouter();
const jsonDataStore = useJsonDataStore();
const openDialog = inject<Function>('openDialog')!!;

const leftData = ref<string>('');
const rightData = ref<string>('');

/**
 * 파일 읽어서 내용 표출
 * @param event 
 */
const readFileText = (event: Event, fileSideType: string) => {

  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];

  if(file){

    const fileName: string = file.name;
    const fileSplitArr: string[] = fileName.split('.');
    const fileExtension: string = fileSplitArr[fileSplitArr.length - 1].toLowerCase();

    if(fileExtension != 'json'){
      
      openDialog('json 파일 형식만 가능합니다.');
      return;

    }

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

        openDialog('Error parsing JSON: ${error}')

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
 * 페이지 이동전 값 비교
 */
const clickCompareButton = async () => {
  
  const leftEmptyFlag: boolean = _.isEmpty(leftData.value);
  const rightEmptyFlag: boolean = _.isEmpty(rightData.value);
   
  if(!leftEmptyFlag && !rightEmptyFlag){

    const encryptKey = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(leftData.value + rightData.value));

    try {     
     
      jsonDataStore.encryptKey = encryptKey;
      const saveObject = jsonDataStore.findEncryptKey;
      
      if(!_.isEmpty(saveObject)){

        goToResult(encryptKey);

      }else{

        const compareResult = await getCompareResultByEncryptkey(encryptKey);
      
        if(!_.isEmpty(compareResult.result)){
            
          goToResult(encryptKey);

        }else{

          const result = await insertCompareResult(leftData.value, rightData.value, encryptKey);

          if(_.isEqual(result.code, '00')){
            
            jsonDataStore.saveData.leftData = leftData.value;
            jsonDataStore.saveData.rightData = rightData.value;
            goToResult(encryptKey);

          }else{
            
            openDialog(result.message);

          }

        }

      }

    } catch (err) {
      
      openDialog(err);

    }

  }else{

    openDialog('json data 내용을 확인해주세요.');

  }
}

/**
 * 결과 페이지 가기
 * @param paramKey 
 */
const goToResult = (paramKey: string) => {

  router.push({ name: 'result', query: { key: paramKey }});

}

</script>

<template>
  <v-container>
    <v-row class="text-right">
      <v-spacer></v-spacer>
      <v-col cols="4">
        <v-btn color="black" class="mr-2" @click="loadSampleData">try some sample data</v-btn>
        <v-btn color="blue" @click="clickCompareButton">Compare</v-btn>
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