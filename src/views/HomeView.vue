<script lang="ts" setup>

import { ref , computed } from 'vue'
import { useRouter } from 'vue-router';
import { useJsonDataStore } from '@/stores/json-data'
import LogoComponent from '@/components/LogoComponent.vue'

import sampleJson1 from '@/assets/json/sampleJson1.json';
import sampleJson2 from '@/assets/json/sampleJson2.json';

const router = useRouter();
const jsonDataStore = useJsonDataStore();

const leftData = ref<string>('');
const rightData = ref<string>('');
const alertFlag = ref<boolean>(false);
const alertMsg = ref<string>('');
const fileSideType = ref<string>('');

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

</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-alert v-model="alertFlag" type="error" closable icon="$warning">{{ alertMsg }}</v-alert>
      </v-col>
    </v-row>
    <LogoComponent></LogoComponent>
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