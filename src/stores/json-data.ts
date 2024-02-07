import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useJsonDataStore = defineStore('jsondata', () => {

    const leftSaveData = ref<string>('');
    const rightSaveData = ref<string>('');
    const leftMsgDataArr = ref<any[]>([]);
    const rightMsgDataArr = ref<any[]>([]);
    const leftSideDataArr = ref<any[]>([]);
    const rightSideDataArr = ref<any[]>([]);

    const countGroup = Object.assign({},
        {
            missObjectCnt: 0,
            notContainsArrValCnt: 0,
            notEqualTypeCnt: 0,
            notEqualLengthArrCnt: 0,
            notEqualArrValCnt: 0,
            notEqaulValCnt: 0
        }    
    );

    const totalCnt = ref<number>(0);

    let msgDataDepth: number = 0;
    let sideDataDepth: number = 0;
    let dataSide1: string = '';
    let dataSide2: string = '';
    let dataSideType: string = '';

    /**
     * 리셋 함수
     */
    function $reset(){

        leftSaveData.value = '';
        rightSaveData.value = '';

        leftMsgDataArr.value = [];
        rightMsgDataArr.value = [];
        leftSideDataArr.value = [];
        rightSideDataArr.value = [];

        countGroup.missObjectCnt = 0;
        countGroup.notContainsArrValCnt = 0;
        countGroup.notEqualTypeCnt = 0;
        countGroup.notEqualLengthArrCnt = 0;
        countGroup.notEqualArrValCnt = 0;
        countGroup.notEqaulValCnt = 0;
        
        totalCnt.value = 0;

        msgDataDepth = 0;
        sideDataDepth = 0;
        dataSide1 = '';
        dataSide2 = '';
        dataSideType = '';

    }

    /**
     * 빈값 체크 하기
     * @param value 
     * @returns 
     */
    function isEmpty(value: any): boolean {
        if (Array.isArray(value)) {
            return value.length === 0;
        } else if (typeof value === 'object' && value !== null) {
            return Object.keys(value).length === 0;
        } else {
            return value === null || value === undefined || value === '' || value === '{}' || value === '[]';
        }
    }

    /**
     * 넘겨줄 데이터 같이 세팅하기
     * @param leftData 
     * @param rightData 
     */
    function setDataTogether(leftData: string, rightData: string){
        checkTypeOfObj(leftData, rightData, 'left');
        checkHtmlInArr(leftData);

        msgDataDepth = 0;
        sideDataDepth = 0;

        checkTypeOfObj(rightData, leftData, 'right');
        checkHtmlInArr(rightData);
        
        totalCnt.value = countGroup.missObjectCnt + countGroup.notContainsArrValCnt + countGroup.notEqaulValCnt + countGroup.notEqualArrValCnt + countGroup.notEqualLengthArrCnt + countGroup.notEqualTypeCnt;

        leftSaveData.value = leftData;
        rightSaveData.value = rightData;
        
    }

    /**
     * 양쪽 json 파일 타입 비교하기
     * @param leftObj 
     * @param rightObj 
     * @param sideType 
     */
    function checkTypeOfObj(leftObj: object | string, rightObj: object | string, sideType: string){

        const parseObj1 = typeof leftObj !== 'object' ? JSON.parse(leftObj) : leftObj;
        const parseObj2 = typeof rightObj !== 'object' ? JSON.parse(rightObj) : rightObj;
        const keys = Object.keys(parseObj1);
     
        dataSideType = sideType;
        dataSide1 = dataSideType === 'left' ? '왼쪽' : '오른쪽';
        dataSide2 = dataSide1 === '왼쪽' ? '오른쪽' : '왼쪽';
        msgDataDepth++;

        for (const key of keys) {
        
            const val1: any = parseObj1[key];
            const val2: any = parseObj2[key];
           
            if(typeof val1 === 'object' && val1 !== null && !Array.isArray(val1) && typeof val2 === 'object' && val2 !== null && !Array.isArray(val2)) {                               
                checkTypeOfObj(val1, val2, dataSideType);
                msgDataDepth--;
            }else if(typeof val1 !== typeof val2){
                
                if(val2 === undefined){                    
                    makeMsgData('object', key, null, null);
                }else{
                    makeMsgData('type', key, typeof val1, null);
                }

                if(Array.isArray(val1)){
                    
                    msgDataDepth++;
                    for(let k = 0; k < val1.length; k++){
                        makeMsgData('contains', key, val1[k], null);
                     }
                     msgDataDepth--;

                }  
                
            }else if(typeof val1 === typeof val2){
               
                if(Array.isArray(val1) && Array.isArray(val2)){
                   
                    if(val1.length != val2.length){
                        makeMsgData('arrayLength', key, val1, val2);
                    }

                    msgDataDepth++;
                    for(let r = 0; r < val1.length; r++){

                        if(val1[r] != val2[r]){
                           makeMsgData('arrayEqual', key, val1[r], null);                           
                        }
                     }
                     msgDataDepth--;

                }else if(val1 !== val2){
                   makeMsgData('value', key, val1, val2);                   
                }

            }
           
        }
       
    }

    /**
     * 메시지 데이터 형식 만들기
     * @param dataType 
     * @param dataKey 
     * @param dataVal1 
     * @param dataVal2 
     */
    function makeMsgData(dataType: string, dataKey: string, dataVal1: any, dataVal2: any){

        const msgDataObj: Record<string, unknown> = {};

        msgDataObj.type = dataType;

        switch(dataType){
            case 'object':
                countGroup.missObjectCnt++;
                msgDataObj.keyStr = msgDataDepth + dataKey;
                msgDataObj.msg = dataKey + '를 ' + dataSide1 + ' json 파일에서 찾을 수 없습니다.';
            break;
            case 'contains':
                countGroup.notContainsArrValCnt++;
                msgDataObj.keyStr = msgDataDepth + dataKey + dataVal1;
                msgDataObj.msg = dataSide1 + ' json 파일의 ' + dataVal1 + ' 값은 ' + dataSide2 + ' json파일에 존재 하지 않습니다.';
            break;
            case 'type':
                countGroup.notEqualTypeCnt++;
                msgDataObj.keyStr = msgDataDepth + dataKey;
                msgDataObj.msg = '양쪽 json 파일의 값은 ' + dataVal1 + '타입이어야 합니다.';
            break;
            case 'arrayLength':
                countGroup.notEqualLengthArrCnt++;        
                msgDataObj.keyStr = msgDataDepth + dataKey;
                if(dataVal1.length > dataVal2.length){
                    msgDataObj.msg = dataSide1 + ' json 파일의 ' + dataKey + ' 배열은 ' + dataSide2 + ' json 파일의 ' + dataKey + ' 배열보다 길이가 ' + (dataVal1.length - dataVal2.length) +' 차이납니다.';
                }else{
                    msgDataObj.msg = dataSide1 + ' json 파일의 ' + dataKey + ' 배열은 ' + dataSide2 + ' json 파일의 ' + dataKey + ' 배열보다 길이가 ' + (dataVal2.length - dataVal1.length) +' 차이납니다.';
                }
            break;
            case 'arrayEqual':
                countGroup.notEqualArrValCnt++;   
                msgDataObj.keyStr = msgDataDepth + dataKey + dataVal1;               
                msgDataObj.msg = dataSide1 + ' json 파일의 배열에 요소가 ' + dataSide2 + ' json 파일의 배열의 요소와 같지 않습니다.';
            break;
            case 'value':
                countGroup.notEqaulValCnt++;
                msgDataObj.keyStr = msgDataDepth + dataKey;
                msgDataObj.msg = dataSide1 + ' json 파일의 ' + dataKey + ' 의 값은 ' + dataSide2 + ' json 파일의 ' + dataKey + ' 의 값과 같지 않습니다.';
            break;
        }

        if(dataSideType === 'left'){
            leftMsgDataArr.value.push(msgDataObj);
        }else{
            rightMsgDataArr.value.push(msgDataObj);
        }

    }

    /**
     * 결과 화면에 넘겨줄 데이터 만들기
     * @param jsonData 
     */
    function checkHtmlInArr(jsonData: string){
       
       const replaceData = jsonData.replace(/(\r\n|\n)/g, '\n') as string;
      
       const dataArr: string[] = replaceData.split('\n');
       const msgArr: any[] = dataSideType === 'left' ? leftMsgDataArr.value : rightMsgDataArr.value;
       const keyStrArr: string[] = Array();

       for(const msgObj of msgArr){
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

            const sideDataObj: Record<string, unknown> = {};
            sideDataObj.text = str;
            sideDataObj.convertText = convertText;

            if(!isEmpty(keyStrArr)){
                
                for(let i = 0; i < keyStrArr.length; i++){
                     
                    if(convertText.indexOf(keyStrArr[i]) != -1){
                      
                        const objType = msgArr[i].type;
    
                        switch(objType){
                            case 'object':
                                sideDataObj.classNm = 'missingObject';
                            break;
                            case 'contains':
                                sideDataObj.classNm = 'notContainsArr';
                            break;
                            case 'type':
                                sideDataObj.classNm = 'notEqualType';
                            break;
                            case 'arrayLength':
                                sideDataObj.classNm = 'notEqualArrLength';
                            break;
                            case 'arrayEqual':
                                sideDataObj.classNm = 'notEqualArrVal';
                            break;
                            case 'value':
                                sideDataObj.classNm = 'notEqualVal';
                            break;
                        }
                    }
                }

            }else{
                sideDataObj.classNm = '';
            }

            if(dataSideType === 'left'){
                leftSideDataArr.value.push(sideDataObj);
            }else{
                rightSideDataArr.value.push(sideDataObj);
            }            

       }

    }

    return { setDataTogether, isEmpty, leftMsgDataArr, rightMsgDataArr, leftSideDataArr, rightSideDataArr, totalCnt, countGroup, leftSaveData, rightSaveData, $reset}
})