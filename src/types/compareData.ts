import _ from 'lodash'
import { MessageDataItem, SaveDataItem } from ".";

export class CompareData{

    leftData: string;
    rightData: string;

    msgDataDepth: number;
    sideDataDepth: number;
    dataSide1: string;
    dataSide2: string;
    
    missObjectCnt: number;
    notContainsArrValCnt: number;
    notEqualTypeCnt: number;
    notEqualLengthArrCnt: number;
    notEqualArrValCnt: number;
    notEqaulValCnt: number;
    totalCnt: number;

    leftMessageDataArray: MessageDataItem[];
    rightMessageDataArray: MessageDataItem[];
    totalMessageDataArray: MessageDataItem[];
    leftSaveDataArray: SaveDataItem[];
    rightSaveDataArray: SaveDataItem[];

    constructor(leftData: string, rightData: string){

        this.leftData = leftData;
        this.rightData = rightData;

        this.msgDataDepth = 0;
        this.sideDataDepth = 0;
        this.dataSide1 = '';
        this.dataSide2 = '';

        this.leftMessageDataArray = [];
        this.rightMessageDataArray = [];
        this.totalMessageDataArray = [];

        this.leftSaveDataArray = [];
        this.rightSaveDataArray = [];

        this.makeCompareResult(this.leftData, this.rightData, 'left');
        this.makeCompareResult(this.rightData, this.leftData, 'right');

        this.totalMessageDataArray = this.leftMessageDataArray.concat(this.rightMessageDataArray).sort((a, b) => b.type.localeCompare(a.type));       

        this.missObjectCnt = this.byTypeCntCalc(this.totalMessageDataArray, 'object');
        this.notContainsArrValCnt = this.byTypeCntCalc(this.totalMessageDataArray, 'contains');
        this.notEqualTypeCnt = this.byTypeCntCalc(this.totalMessageDataArray, 'type');
        this.notEqualLengthArrCnt = this.byTypeCntCalc(this.totalMessageDataArray, 'arrayLength');
        this.notEqualArrValCnt = this.byTypeCntCalc(this.totalMessageDataArray, 'arrayEqual');
        this.notEqaulValCnt = this.byTypeCntCalc(this.totalMessageDataArray, 'value');
        this.totalCnt = this.missObjectCnt + this.notContainsArrValCnt + this.notEqualTypeCnt + this.notEqualLengthArrCnt + this.notEqualArrValCnt + this.notEqaulValCnt;

    }

    /**
     * compare 결과 만드는 함수
     * @param mainObj 
     * @param compareObj 
     * @param sideType 
     */
    makeCompareResult(mainObj: object | string, compareObj: object | string, sideType: string){

        this.msgDataDepth = 0;
        this.sideDataDepth = 0;
       
        if(sideType === 'left'){

            this.dataSide1 = 'left';
            this.dataSide2 = 'right';
            this.makeMessageDataArray(mainObj, compareObj, sideType, this.leftMessageDataArray);
            this.makeSaveDataArray(this.leftSaveDataArray, this.leftMessageDataArray, this.leftData);
            
        }else{

            this.dataSide1 = 'right';
            this.dataSide2 = 'left';
            this.makeMessageDataArray(mainObj, compareObj, sideType, this.rightMessageDataArray);
            this.makeSaveDataArray(this.rightSaveDataArray, this.rightMessageDataArray, this.rightData);
            
        }
   }

   /**
    * 다른점 수 계산 함수
    * @param dataArr 
    * @param classifyType 
    * @returns 
    */
   byTypeCntCalc(dataArr: MessageDataItem[], classifyType: string){

        let cnt = 0;

        if(!_.isEmpty(dataArr)){

            for(const data of dataArr){

                const dataType = data.type;

                if(classifyType === dataType){

                    cnt++;

                }

            }

        }
        console.log(classifyType, cnt)
        return cnt;

    }

    /**
     * 다른점 메시지 배열 만드는 함수
     * @param mainObj 
     * @param compareObj 
     * @param sideType 
     * @param dataArr 
     */
    makeMessageDataArray(mainObj: object | string, compareObj: object | string, sideType: string, dataArr: MessageDataItem[]){

        const parseObj1 = typeof mainObj !== 'object' ? JSON.parse(mainObj) : mainObj;
        const parseObj2 = typeof compareObj !== 'object' ? JSON.parse(compareObj) : compareObj;
        const keys = Object.keys(parseObj1);
    
        this.msgDataDepth++;

        for (const key of keys) {
        
            const val1: any = parseObj1[key];
            const val2: any = parseObj2[key];           
        
            if(typeof val1 === 'object' && val1 !== null && !Array.isArray(val1) && typeof val2 === 'object' && val2 !== null && !Array.isArray(val2)) {                               
                
                this.makeMessageDataArray(val1, val2, sideType, dataArr);                
                this.msgDataDepth--;

            }else if(typeof val1 !== typeof val2){
                
                if(val2 === undefined){                    

                    this.classifyMsgData(dataArr, 'object', key, null, null);

                }else{

                    this.classifyMsgData(dataArr, 'type', key, typeof val1, null);

                }

                if(Array.isArray(val1)){
                    
                    this.msgDataDepth++;

                    for(let k = 0; k < val1.length; k++){

                        this.classifyMsgData(dataArr, 'contains', key, val1[k], null);

                    }

                    this.msgDataDepth--;

                }  
                
            }else if(typeof val1 === typeof val2){
            
                if(Array.isArray(val1) && Array.isArray(val2)){
                
                    if(val1.length != val2.length){

                        this.classifyMsgData(dataArr, 'arrayLength', key, val1, val2);

                    }

                    this.msgDataDepth++;

                    for(let r = 0; r < val1.length; r++){

                        if(val1[r] != val2[r]){
                            
                            this.classifyMsgData(dataArr, 'arrayEqual', key, val1[r], null);                           

                        }
                    }

                    this.msgDataDepth--;

                }else if(val1 !== val2){

                    this.classifyMsgData(dataArr, 'value', key, val1, val2);   

                }

            }
        
        }
    
    }
    
    /**
     * 다른점 클래스 분류 함수
     * @param dataArr 
     * @param dataType 
     * @param dataKey 
     * @param dataVal1 
     * @param dataVal2 
     */
    classifyMsgData(dataArr: MessageDataItem[], dataType: string, dataKey: string, dataVal1: any, dataVal2: any){

        let type = dataType;
        let keyword = '';
        let message = '';

        switch(dataType){

            case 'object':           
                keyword = this.msgDataDepth + dataKey;
                message = dataKey + ' is not found in the ' + this.dataSide1 + ' json file.';
            break;
            case 'contains':
                keyword = this.msgDataDepth + dataKey + dataVal1;
                message = 'The ' + dataVal1 + ' value in the ' + this.dataSide1 + ' json file does not exist in the ' + this.dataSide2 + ' json file.';                
            break;
            case 'type':
                keyword = this.msgDataDepth + dataKey;
                message = 'The values ​​in both json files must be ' + dataVal1 + ' type.';
            break;
            case 'arrayLength':       
                keyword = this.msgDataDepth + dataKey;
                if(dataVal1.length > dataVal2.length){
                    message = 'The ' + dataKey + ' array in the ' + this.dataSide1 + ' json file is ' + (dataVal1.length - dataVal2.length) + ' different in length than the ' + dataKey + ' array in the ' + this.dataSide2 + 'json file.';
                }else{
                    message = 'The ' + dataKey + ' array in the ' + this.dataSide1 + ' json file is ' + (dataVal2.length - dataVal1.length) + ' different in length than the ' + dataKey + ' array in the ' + this.dataSide2 + 'json file.';
                }                
            break;
            case 'arrayEqual':
                keyword = this.msgDataDepth + dataKey + dataVal1;               
                message = 'The elements in the array in the ' + this.dataSide1 + ' json file are not the same as the elements in the array in the ' + this.dataSide2 + ' json file.';
            break;
            case 'value':
                keyword = this.msgDataDepth + dataKey;
                message = 'The value of the ' + dataKey + ' in the ' + this.dataSide1 + ' json file is not the same as the value of the ' + dataKey + ' in the ' + this.dataSide2 + ' json file.';
            break;

        }
    
        const messageDataitem = new MessageDataItem(type, keyword, message);

        dataArr.push(messageDataitem);
    }

    /**
     * 결과 html 만드는 함수
     * @param saveDataArray 
     * @param messageDataArray 
     * @param jsonData 
     */
    makeSaveDataArray(saveDataArray: SaveDataItem[], messageDataArray: MessageDataItem[] ,jsonData: string){
   
        const replaceData = jsonData.replace(/(\r\n|\n)/g, '\n') as string;
    
        const dataArr: string[] = replaceData.split('\n');
        const keyStrArr: string[] = Array();
    
        for(const item of messageDataArray){

            keyStrArr.push(item.keyword);
            
        }
    
        let beforeText: string = '';
        
        for(const str of dataArr){

            let convertText = '';
            let className = '';
            const htmlText = str;
            
            const useStr = htmlText;
            const emptyStr = useStr.replace(/\s/g, '#{empty}');
            
            const findIdx = emptyStr.indexOf('"');
            const emptyArea = emptyStr.substring(0, findIdx);
            
            this.sideDataDepth = (emptyArea.split('#{empty}').length -1) / 2;
    
            if(!_.isEmpty(beforeText)){
    
                const idx = beforeText.indexOf('"');
                const lastIdx = beforeText.indexOf('"', idx + 1);
                const arrNm = beforeText.substring(idx + 1, lastIdx);
    
                convertText = this.sideDataDepth + arrNm + useStr.replace('"', '').trim();
                
            }else{

                convertText = this.sideDataDepth + useStr.replace('"', '').trim();

            }

            if(convertText.indexOf('\\') != -1){

                convertText = convertText.replace(/\\/g, '');

            }
    
            if(str.indexOf("[") != -1){

                beforeText = str;

            }else if(str.indexOf("]") != -1){

                beforeText = '';

            }
    
            if(!_.isEmpty(keyStrArr)){
                
                for(let i = 0; i < keyStrArr.length; i++){
                    
                    if(convertText.indexOf(keyStrArr[i]) != -1){
                    
                        const objType = messageDataArray[i].type;
    
                        switch(objType){
                            case 'object':
                                className = 'missingObject';
                            break;
                            case 'contains':
                                className = 'notContainsArr';
                            break;
                            case 'type':
                                className = 'notEqualType';
                            break;
                            case 'arrayLength':
                                className = 'notEqualArrLength';
                            break;
                            case 'arrayEqual':
                                className = 'notEqualArrVal';
                            break;
                            case 'value':
                                className = 'notEqualVal';
                            break;
                        }
                    }
                }
    
            }
    
            const saveDataItem = new SaveDataItem(htmlText, convertText, className);
            saveDataArray.push(saveDataItem);  
        
        }
    }
}