<script lang="ts" setup>

import { ref , computed, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { useJsonDataStore } from '@/stores/json-data'
import LogoComponent from '@/components/LogoComponent.vue'
import axios from 'axios';

import sampleJson1 from '@/assets/json/sampleJson1.json';
import sampleJson2 from '@/assets/json/sampleJson2.json';

const router = useRouter();
const jsonDataStore = useJsonDataStore();

const isEmpty: Function = jsonDataStore.isEmpty;
const leftData = ref<string>('');
const rightData = ref<string>('');
const alertFlag = ref<boolean>(false);
const alertMsg = ref<string>('');
const fileSideType = ref<string>('');

interface SelectItem {
  subject: string,
  jsonIdx: number
}

const recordData = ref<SelectItem[]>([]);
const selectedItem = ref<SelectItem | null>(null);
const selectFlag = ref<boolean>(false);
const jsonIdxParam = ref<number>(0);

const dialogFlag = ref<boolean>(false);


onMounted(() => {

  getRecordDataList();

})

const getRecordDataList = async () => {

    await axios.get('/api/record')
    .then((res) => {

        recordData.value  = [];

        const data = res.data;

        if(!isEmpty(data)){
          
          for(const item of data){

              const recordObj: SelectItem = {
                subject: item.subject as string,
                jsonIdx: item.jsonIdx as number
              };

              recordData.value.push(recordObj);
          }

        }

    })
    .catch((err) => {
      alertFlag.value = true;
      alertMsg.value = err;
    })

}

/**
 * 파일 업로드 버튼 눌렀을 때 이벤트
 * @param uploadSideType 왼쪽인지 오른쪽인지 구분하는 param
 */
const uploadFile = (uploadSideType: string) => {
 
  const fileSpace: string = uploadSideType + 'File';
  const sideFile: HTMLElement | null = document.getElementById(fileSpace);
  fileSideType.value = uploadSideType;

  sideFile?.click();

}

/**
 * 파일 확장자 체크 하는 이벤트
 * @param event 
 */
const checkFileType = (event: Event) => {

  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];

      if ( file ) {

        const fileName: string = file.name;
        const fileSplitArr: string[] = fileName.split('.');
        const fileExtension: string = fileSplitArr[fileSplitArr.length - 1].toLowerCase();

        if(fileExtension != 'json'){

          alertFlag.value = true;
          alertMsg.value = "json 파일 형식만 가능합니다.";

          return;
        }else{

          const reader = new FileReader();

          reader.onload = (event) => {

            try {
               
              if(event?.target){
                
                const jsonString = event.target.result;

                if(typeof jsonString === 'string'){

                  const jsonData = JSON.parse(jsonString);
                  const formatData = JSON.stringify(jsonData, null, 2);

                  const fileSideTypeStr: string = fileSideType.value;  
                  
                  if(fileSideTypeStr == 'left'){
                    leftData.value = formatData;
                  }else if(fileSideTypeStr == 'right'){
                    rightData.value = formatData;
                  }
                  
                  alertFlag.value = false;

                }               
  
              }else{
                throw new Error('파일을 읽어오는데 실패했습니다.');
              }
             
            } catch (error) {
              alertFlag.value = true;
              alertMsg.value = 'Error parsing JSON: ${error}';
            }
          };

          reader.readAsText(file, 'utf-8');

        }

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
const goToResult = () => {
  
    const leftEmptyFlag: boolean = jsonDataStore.isEmpty(leftData.value);
    const rightEmptyFlag: boolean = jsonDataStore.isEmpty(rightData.value);
   
    if(!leftEmptyFlag && !rightEmptyFlag){
      jsonDataStore.$reset();
      jsonDataStore.setDataTogether(leftData.value, rightData.value);
      router.push({ name : 'result'});
    }else{
      alertFlag.value = true;
      alertMsg.value = 'json data 내용을 확인해주세요.';
    }
}

/**
 * 선택한 record 데이터 가져오기
 * @param value 
 */
const onItemSelected = (value: SelectItem | null) => {

  const jsonIdx = value?.jsonIdx as number;

  if(!isEmpty(jsonIdx)){

      axios.get('/api/record/' + jsonIdx)
      .then((res) => {

        const data = res.data;

        if(!isEmpty(data)){
          leftData.value = data.leftData;
          rightData.value = data.rightData;
          selectFlag.value = true;
          jsonIdxParam.value = jsonIdx;
        }

      })
      .catch((err) => {
        alertFlag.value = true;
        alertMsg.value = err;
      })

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
const deleteRecordData = () => {

  if(!isEmpty(jsonIdxParam.value)){

      axios.delete('/api/record/' + jsonIdxParam.value)
      .then((res) => {

        const data = res.data;

        dialogFlag.value = false;
        alertFlag.value = true;
        alertMsg.value = data.msg;
        getRecordDataList();
        selectedItem.value = null;
        leftData.value = '';
        rightData.value = '';
        jsonIdxParam.value = 0;

      })
      .catch((err) => {
        alertFlag.value = true;
        alertMsg.value = err;
      })

  }

}

</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-alert v-model="alertFlag" type="error" closable icon="$warning">{{ alertMsg }}</v-alert>
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
    <LogoComponent></LogoComponent>
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
        <v-file-input label="파일 선택" v-show="false" @change="checkFileType" id="leftFile"></v-file-input>
        <v-btn @click="uploadFile('left')" class="float-right">jsonFile</v-btn>
    </v-col>
    <v-col md="6">
        <v-textarea rows="15" v-model="rightData"></v-textarea>
        <v-file-input label="파일 선택" v-show="false" @change="checkFileType" id="rightFile"></v-file-input>
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