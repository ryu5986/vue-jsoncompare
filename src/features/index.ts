
import type {  MsgDataObj, SaveDataObj } from "@/types";
import { isEmpty } from "@/utils";
import { ref } from "vue";

let msgDataDepth = 0;
let sideDataDepth = 0;
let dataSide1 = '';
let dataSide2 = '';

/**
 * 비교 메시지 배열 만들기
 * @param mainObj 
 * @param compareObj 
 * @param sideType 
 * @returns 
 */
export const makeMsgDataArr = (mainObj: object | string, compareObj: object | string, sideType: string) => {

     msgDataDepth = 0;
     sideDataDepth = 0;

     const msgDataArr = ref<MsgDataObj[]>([]);

     makeMsgData(mainObj, compareObj, sideType, msgDataArr.value);

     return msgDataArr.value;
}

/**
 * 각 비교항목 다른점 수 계산하기
 * @param dataArr 
 * @param classifyType 
 * @returns 
 */
export const byTypeCntCalc = (dataArr: MsgDataObj[], classifyType: string) => {

     let cnt = 0;

     if(!isEmpty(dataArr)){

          for(const data of dataArr){

               const dataType = data.type;

               if(classifyType === dataType){
                    cnt++;
               }

          }

     }

     return cnt;

}

/**
 * json 내용 비교하기
 * @param mainObj 
 * @param compareObj 
 * @param sideType 
 * @param dataArr 
 */
const makeMsgData = (mainObj: object | string, compareObj: object | string, sideType: string, dataArr: MsgDataObj[]) => {

    const parseObj1 = typeof mainObj !== 'object' ? JSON.parse(mainObj) : mainObj;
    const parseObj2 = typeof compareObj !== 'object' ? JSON.parse(compareObj) : compareObj;
    const keys = Object.keys(parseObj1);
 
    dataSide1 = sideType === 'left' ? '왼쪽' : '오른쪽';
    dataSide2 = dataSide1 === '왼쪽' ? '오른쪽' : '왼쪽';
    msgDataDepth++;

    for (const key of keys) {
    
        const val1: any = parseObj1[key];
        const val2: any = parseObj2[key];
       
        if(typeof val1 === 'object' && val1 !== null && !Array.isArray(val1) && typeof val2 === 'object' && val2 !== null && !Array.isArray(val2)) {                               
          makeMsgData(val1, val2, sideType, dataArr);
          msgDataDepth--;
        }else if(typeof val1 !== typeof val2){
            
            if(val2 === undefined){                    
               classifyMsgData(dataArr, 'object', key, null, null);
            }else{
               classifyMsgData(dataArr, 'type', key, typeof val1, null);
            }

            if(Array.isArray(val1)){
                
                msgDataDepth++;
                for(let k = 0; k < val1.length; k++){
                    classifyMsgData(dataArr, 'contains', key, val1[k], null);
                 }
                 msgDataDepth--;

            }  
            
        }else if(typeof val1 === typeof val2){
           
            if(Array.isArray(val1) && Array.isArray(val2)){
               
                if(val1.length != val2.length){
                    classifyMsgData(dataArr, 'arrayLength', key, val1, val2);
                }

                msgDataDepth++;
                for(let r = 0; r < val1.length; r++){

                    if(val1[r] != val2[r]){
                         classifyMsgData(dataArr, 'arrayEqual', key, val1[r], null);                           
                    }
                 }
                 msgDataDepth--;

            }else if(val1 !== val2){
               classifyMsgData(dataArr, 'value', key, val1, val2);                   
            }

        }
       
    }
   
}

/**
 * 메시지 형식 배열에 담기
 * @param dataArr 
 * @param dataType 
 * @param dataKey 
 * @param dataVal1 
 * @param dataVal2 
 */
const classifyMsgData = (dataArr: MsgDataObj[], dataType: string, dataKey: string, dataVal1: any, dataVal2: any) => {

    const msgDataObj = ref<MsgDataObj>({
          type: dataType,
          keyStr: '',
          msg: ''
    });

    switch(dataType){
        case 'object':           
            msgDataObj.value.keyStr = msgDataDepth + dataKey;
            msgDataObj.value.msg = dataKey + '를 ' + dataSide1 + ' json 파일에서 찾을 수 없습니다.';
        break;
        case 'contains':
            msgDataObj.value.keyStr = msgDataDepth + dataKey + dataVal1;
            msgDataObj.value.msg = dataSide1 + ' json 파일의 ' + dataVal1 + ' 값은 ' + dataSide2 + ' json파일에 존재 하지 않습니다.';
        break;
        case 'type':
            msgDataObj.value.keyStr = msgDataDepth + dataKey;
            msgDataObj.value.msg = '양쪽 json 파일의 값은 ' + dataVal1 + '타입이어야 합니다.';
        break;
        case 'arrayLength':       
            msgDataObj.value.keyStr = msgDataDepth + dataKey;
            if(dataVal1.length > dataVal2.length){
                msgDataObj.value.msg = dataSide1 + ' json 파일의 ' + dataKey + ' 배열은 ' + dataSide2 + ' json 파일의 ' + dataKey + ' 배열보다 길이가 ' + (dataVal1.length - dataVal2.length) +' 차이납니다.';
            }else{
                msgDataObj.value.msg = dataSide1 + ' json 파일의 ' + dataKey + ' 배열은 ' + dataSide2 + ' json 파일의 ' + dataKey + ' 배열보다 길이가 ' + (dataVal2.length - dataVal1.length) +' 차이납니다.';
            }
        break;
        case 'arrayEqual':
            msgDataObj.value.keyStr = msgDataDepth + dataKey + dataVal1;               
            msgDataObj.value.msg = dataSide1 + ' json 파일의 배열에 요소가 ' + dataSide2 + ' json 파일의 배열의 요소와 같지 않습니다.';
        break;
        case 'value':
            msgDataObj.value.keyStr = msgDataDepth + dataKey;
            msgDataObj.value.msg = dataSide1 + ' json 파일의 ' + dataKey + ' 의 값은 ' + dataSide2 + ' json 파일의 ' + dataKey + ' 의 값과 같지 않습니다.';
        break;
    }

    dataArr.push(msgDataObj.value);
}

/**
 * 결과 화면 데이터 배열 만들기
 * @param msgDataArr 
 * @param jsonData 
 * @returns 
 */
export const makeSaveData = (msgDataArr: MsgDataObj[] ,jsonData: string) => {
   
   const saveDataArr = ref<SaveDataObj[]>([]);

   const replaceData = jsonData.replace(/(\r\n|\n)/g, '\n') as string;
  
   const dataArr: string[] = replaceData.split('\n');
   const keyStrArr: string[] = Array();

   for(const msgObj of msgDataArr){
        keyStrArr.push(msgObj.keyStr);
   }
  
   let beforeText: string = '';

   for(const str of dataArr){
        
        const useStr = str;
        const emptyStr: string = useStr.replace(/\s/g, '#{empty}');
       
        const findIdx: number = emptyStr.indexOf('"');
        const emptyArea: string = emptyStr.substring(0, findIdx);
        let convertText: string = '';
        sideDataDepth = (emptyArea.split('#{empty}').length -1) / 2;

        if(!isEmpty(beforeText)){

            const idx: number = beforeText.indexOf('"');
            const lastIdx: number = beforeText.indexOf('"', idx + 1);
            const arrNm: string = beforeText.substring(idx + 1, lastIdx);

            convertText = sideDataDepth + arrNm + useStr.replace('"', '').trim();
            
        }else{
            convertText = sideDataDepth + useStr.replace('"', '').trim();
        }

        if(str.indexOf("[") != -1){
            beforeText = str;
        }else if(str.indexOf("]") != -1){
            beforeText = '';
        }

        const sideDataObj = ref<SaveDataObj>({
               text: str,
               convertText: convertText,
               classNm: ''
        });
        

        if(!isEmpty(keyStrArr)){
            
            for(let i = 0; i < keyStrArr.length; i++){
                 
                if(convertText.indexOf(keyStrArr[i]) != -1){
                  
                    const objType = msgDataArr[i].type;

                    switch(objType){
                        case 'object':
                            sideDataObj.value.classNm = 'missingObject';
                        break;
                        case 'contains':
                            sideDataObj.value.classNm = 'notContainsArr';
                        break;
                        case 'type':
                            sideDataObj.value.classNm = 'notEqualType';
                        break;
                        case 'arrayLength':
                            sideDataObj.value.classNm = 'notEqualArrLength';
                        break;
                        case 'arrayEqual':
                            sideDataObj.value.classNm = 'notEqualArrVal';
                        break;
                        case 'value':
                            sideDataObj.value.classNm = 'notEqualVal';
                        break;
                    }
                }
            }

        }else{
            sideDataObj.value.classNm = '';
        }

        saveDataArr.value.push(sideDataObj.value);  

   }

   return saveDataArr;

}