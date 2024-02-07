<script lang="ts" setup>
    import LogoComponent from '@/components/LogoComponent.vue'
    import '@/assets/css/result.css'
    import { useJsonDataStore } from '@/stores/json-data'
    import { ref, onMounted} from 'vue';
    import type { Ref } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from 'axios';

    const jsonDataStore = useJsonDataStore();    
    const router = useRouter();

    const totalMsgDataArr: any[] = jsonDataStore.leftMsgDataArr.concat(jsonDataStore.rightMsgDataArr).sort((a, b) => b.type.localeCompare(a.type));       
    const msgItems = ref<string[]>(['']);
    const currentPage = ref<number>(1);
    const totalPages = ref<number>(totalMsgDataArr.length % 5 > 0 ?  Math.ceil(totalMsgDataArr.length / 5) : totalMsgDataArr.length);
    const isEmpty: Function = jsonDataStore.isEmpty;
    const clickMsgData = ref<string>('');
    const alertFlag = ref<boolean>(false);
    const leftData: string = jsonDataStore.leftSaveData;
    const rightData: string = jsonDataStore.rightSaveData;
    const snackbarFlag = ref<boolean>(false);
    const snakbarMsg = ref<string>('');
   
    onMounted(() => {
      loadPageItems();
    });

    /**
     * 체크박스 아이템 인터페이스
     */
    interface CheckboxItem {
        label: string,
        isChecked: boolean,
        classNm: string
    }
    
    /**
     * 체크박스 아이템
     */
    const checkboxItems: Ref<CheckboxItem[]> = ref([
        {label: '서로 찾을 수 없는 오브젝트 수 : ' + jsonDataStore.countGroup.missObjectCnt, isChecked:true, classNm: 'missingObject'},
        {label: '배열 안의 값이 존재 하지 않는 수 : ' + jsonDataStore.countGroup.notContainsArrValCnt, isChecked:true, classNm: 'notContainsArr'},
        {label: '타입이 같지 않은 수 : ' + jsonDataStore.countGroup.notEqaulValCnt, isChecked:true, classNm: 'notEqualType'},
        {label: '배열의 길이가 같지 않은 수 : ' + jsonDataStore.countGroup.notEqualLengthArrCnt, isChecked:true, classNm: 'notEqualArrLength'},
        {label: '배열 안의 값이 같이 않은 수 : ' + jsonDataStore.countGroup.notEqualArrValCnt, isChecked:true, classNm: 'notEqualArrVal'},
        {label: '값이 같지 않은 수 : ' + jsonDataStore.countGroup.notEqualTypeCnt, isChecked:true, classNm: 'notEqualVal'}
    ]);

    /**
     * 체크박스 클릭했을 때 이벤트
     * @param className 
     * @param idx 
     */
    function changeBackground(className: string, idx: number){
     
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
    function loadPageItems(){
      
      alertFlag.value = false;
      clickMsgData.value = '';

      const pageSize = 5;

      const startIdx = (currentPage.value - 1) * pageSize;
      const endIdx = Math.min(startIdx + pageSize, totalPages.value * pageSize);
      msgItems.value = [];

      const sliceMsgDataArr = totalMsgDataArr.slice(startIdx, endIdx);
      const hiddens = document.querySelectorAll('input[type="hidden"]'); 

      for(const removeHidden of hiddens){
        removeHidden.parentElement?.classList.remove('clickElement');
      }

      for(const item of sliceMsgDataArr){
          msgItems.value.push(item.msg);

          for (const hidden of hiddens) {

            if (hidden instanceof HTMLInputElement && hidden.value.indexOf(item.keyStr) != -1) {
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
    function clickDataRow(classNm: string, event: Event){
      
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

                  if(hiddenElement.value.indexOf(msgData.keyStr) != -1){
                      alertFlag.value = true;
                      clickMsgData.value = msgData.msg;
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

    /**
     * json 데이터 저장하기
     */
    function saveJsonData(){

        if(!isEmpty(leftData) && !isEmpty(rightData)){

          axios.post('/api/record', {
            leftData: leftData,
            rightData: rightData
          })
          .then((res) => {

              const data = res.data;
              
              snackbarFlag.value = true;
              snakbarMsg.value = data.msg;

          })
          .catch((err) => {
              snackbarFlag.value = true;
              snakbarMsg.value = err;
          })

        }

    }
    
</script>

<template>
  <v-container>
      <LogoComponent/>
      <v-row class="text-center">
        <v-row>
          <v-col>
            <v-snackbar v-model="snackbarFlag" vertical>
              <div class="text-subtitle-1 pb-2">저장 결과</div>
              <p>{{ snakbarMsg }}</p>
              <template v-slot:actions>
                <v-btn color="indigo" variant="text" @click="snackbarFlag = false">Close</v-btn>
              </template>
            </v-snackbar>
          </v-col>
        </v-row>
        <v-col cols="2">
          <v-btn color="success" class="mt-5" @click="goToHome">홈으로</v-btn>         
        </v-col>
        <v-col cols="2">
          <v-btn color="info" class="mt-5" @click="saveJsonData">저장하기</v-btn>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <v-col>
          <p>{{ jsonDataStore.totalCnt }} 개의 다른점</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(item, index) in checkboxItems" :key="index" cols="4">
          <v-checkbox v-model="item.isChecked" :label="item.label" @click="changeBackground(item.classNm, index)"></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" class="sideArea">
            <v-row v-for="(item, index) in jsonDataStore.leftSideDataArr" :key="index" :class="item.classNm" @click="clickDataRow(item.classNm, $event)">
              <input type="hidden" :value="item.convertText" />
              <v-col cols="1">{{ index + 1 }}</v-col>
              <v-col cols="11"><pre>{{ item.text }}</pre></v-col>
            </v-row>
        </v-col>
        <v-col cols="4" class="sideArea">
          <v-row v-for="(item, index) in jsonDataStore.rightSideDataArr" :key="index" :class="item.classNm" @click="clickDataRow(item.classNm, $event)">
              <input type="hidden" :value="item.convertText" />
              <v-col cols="1">{{ index + 1 }}</v-col>
              <v-col cols="11"><pre>{{ item.text }}</pre></v-col>
            </v-row>
        </v-col>
        <v-col cols="4">
          <v-row class="text-center">
            <v-col cols="12">
              <v-pagination v-model="currentPage" :length="totalPages" @first="changePage(currentPage)" @last="changePage(totalPages)" @prev="changePage(currentPage)" @next="changePage(currentPage)"></v-pagination>
           </v-col>
          </v-row>
          <v-row v-for="(item, index) in msgItems" :key="index" class="text-center">
            <v-spacer></v-spacer><v-col cols="8"><v-card>{{ item }}</v-card></v-col><v-spacer></v-spacer>
          </v-row>
          <v-row>
            <v-spacer></v-spacer><v-col cols="8"><v-alert v-model="alertFlag" type="info" icon="$info">클릭한 내용</v-alert></v-col><v-spacer></v-spacer>
          </v-row>
          <v-row>
            <v-spacer></v-spacer><v-col cols="8"><v-card>{{ clickMsgData }}</v-card></v-col><v-spacer></v-spacer>
          </v-row>
        </v-col>
      </v-row>
  </v-container>
</template>

