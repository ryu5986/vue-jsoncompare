<script lang="ts" setup>

import { ref , onMounted } from 'vue'
import { useRouter } from 'vue-router';
import Logo from '@/components/Logo.vue'
import type { SelectItem , AlertObj} from '@/types/index'
import { isEmpty, uploadFile, checkFileType } from '@/utils';
import { getRecordList, getRecord, deleteRecord, getRecordByEncryptkey, insertRecord } from '@/service/index'
import { useJsonDataStore } from '@/stores/json-data'
import * as CryptoJS from 'crypto-js';

import sampleJson1 from '@/assets/json/sampleJson1.json';
import sampleJson2 from '@/assets/json/sampleJson2.json';

const router = useRouter();
const jsonDataStore = useJsonDataStore();

const leftData = ref<string>('');
const rightData = ref<string>('');
const alertObj = ref<AlertObj>({
  flag : false,
  msg : ''
});

const recordData = ref<SelectItem[]>([]);
const selectedItem = ref<SelectItem | null>(null);
const selectFlag = ref<boolean>(false);
const jsonIdxParam = ref<number>(0);

const dialogFlag = ref<boolean>(false);


onMounted(() => {

  getRecordDataList();

})

/**
 * DB 저장 기록 가져오기
 */
const getRecordDataList = async () => {

    try {   
      const data = await getRecordList();
      recordData.value = data.result;
    } catch (err) {
      alertObj.value.flag = true;
      alertObj.value.msg = err;
    }

}

/**
 * 파일 읽어서 내용 표출
 * @param event 
 */
const readFileText = (event: Event, fileSideType: string) => {

  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];
  const alertObj = checkFileType(event, fileSideType, fileInput);

  if(!alertObj.value.flag && file){

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
        alertObj.value.flag = true;
        alertObj.value.msg = 'Error parsing JSON: ${error}';
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

      const encryptKey = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(leftData.value + rightData.value));

      try {
       
        const data = await getRecordByEncryptkey(encryptKey);

        if(!isEmpty(data.result)){
          jsonDataStore.leftSideData = data.result.leftData;
          jsonDataStore.rightSideData = data.result.rightData;
        }else{
          jsonDataStore.leftSideData = leftData.value;
          jsonDataStore.rightSideData = rightData.value;
          
          const response = await insertRecord(leftData.value, rightData.value, encryptKey);

          jsonDataStore.message = response.message;
        }

        router.push({ name : 'result'});
       
      } catch (error) {
        alertObj.value.flag = true;
        alertObj.value.msg = 'json data 내용을 확인해주세요.';
      }

    }else{
      alertObj.value.flag = true;
      alertObj.value.msg = 'json data 내용을 확인해주세요.';
    }
}

/**
 * 선택한 record 데이터 가져오기
 * @param value 
 */
const onItemSelected = async (value: SelectItem | null) => {

  const jsonIdx = value?.jsonIdx as number;

  if(!isEmpty(jsonIdx)){

      try {

        const data = await getRecord(jsonIdx);

        if(!isEmpty(data)){
          leftData.value = data.result.leftData;
          rightData.value = data.result.rightData;
          selectFlag.value = true;
          jsonIdxParam.value = jsonIdx;
        }

      } catch (err) {
        alertObj.value.flag = true;
        alertObj.value.msg = err;
      }

  }

};

/**
 * 삭제 다이얼로그 열기
 */
const openDeleteDialog = () => {
  dialogFlag.value = true;
}

/**
 * 데이터 삭제 하기
 */
const deleteRecordData = async () => {

  if(!isEmpty(jsonIdxParam.value)){

    try {

      const data = await deleteRecord(jsonIdxParam.value);

      dialogFlag.value = false;
      alertObj.value.flag = true;
      alertObj.value.msg = data.message;
      getRecordDataList();
      selectedItem.value = null;
      leftData.value = '';
      rightData.value = '';
      jsonIdxParam.value = 0;

    } catch (err) {
      alertObj.value.flag = true;
      alertObj.value.msg = err;
    }

  }

}

</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-alert v-model="alertObj.flag" type="error" closable icon="$warning">{{ alertObj.msg }}</v-alert>
        <v-dialog v-model="dialogFlag" max-width="500px">
          <v-card>
            <v-card-title class="headline">삭제 하시겠습니까?</v-card-title>
            <v-card-text>
              해당 기록을 삭제하시겠습니까? 삭제 시 복구가 불가능 합니다.
            </v-card-text>
            <v-card-actions>
              <v-row>
                <v-spacer/>
                <v-col cols="2"><v-btn color="error" @click="deleteRecordData">확인</v-btn></v-col>
                <v-col cols="2"><v-btn color="info" @click="dialogFlag = false">아니요</v-btn></v-col>
                <v-spacer/>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <Logo></Logo>
    <v-row class="mt-5">
      <v-spacer></v-spacer>
      <v-col cols="8">
        <v-select v-model="selectedItem" :items="recordData" item-title="subject" item-value="jsonIdx" return-object @update:model-value="onItemSelected"></v-select>
      </v-col>
      <v-col cols="2">
        <v-btn color="error" v-show="selectFlag" @click="openDeleteDialog">삭제</v-btn>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
   <v-row class="mt-5">
    <v-col md="6">
        <v-textarea rows="15" v-model="leftData"></v-textarea>
        <v-file-input label="파일 선택" v-show="false" @change="readFileText($event, 'left')" id="leftFile"></v-file-input>
        <v-btn @click="uploadFile('left')" class="float-right">jsonFile</v-btn>
    </v-col>
    <v-col md="6">
        <v-textarea rows="15" v-model="rightData"></v-textarea>
        <v-file-input label="파일 선택" v-show="false" @change="readFileText($event, 'right')" id="rightFile"></v-file-input>
        <v-btn @click="uploadFile('right')" class="float-right">jsonFile</v-btn>
    </v-col>
    </v-row>
    <v-row class="mt-5"  justify="center">
        <v-btn color="blue" class="mt-5" @click="goToResult">Compare</v-btn>
    </v-row>
    <v-row class="mt-5"  justify="center">
        <v-btn color="black" class="mt-5" @click="loadSampleData">try some sample data</v-btn>
    </v-row>
  </v-container>
</template>