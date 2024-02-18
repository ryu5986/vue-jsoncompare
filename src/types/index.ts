export interface CheckboxItem{
  label: string;
  isChecked: boolean;
  classNm: string;
}

export interface RecordData{
  jsonIdx: number;
  subject: string;
  leftData: string;
  rightData: string;
}

export interface APIResponse<T>{
  message: string;
  result: T;
}

export class MessageDataItem{

  type: string;
  keyword: string;
  message: string;

  constructor(type: string, keyword: string, message: string){
      this.type = type;
      this.keyword = keyword;
      this.message = message;
  }

}

export class SaveDataItem{

  htmlText: string;
  convertText: string;
  className: string;

  constructor(htmlText: string, convertText: string, className: string){
      this.htmlText = htmlText;
      this.convertText = convertText;
      this.className = className;
  }

}

export interface CompareDataGroup{

  leftMessageDataArray: MessageDataItem[];
  rightMessageDataArray: MessageDataItem[];
  totalMessageDataArray: MessageDataItem[];
  leftSaveDataArray: SaveDataItem[];
  rightSaveDataArray: SaveDataItem[];

  missObjectCnt: number;
  notContainsArrValCnt: number;
  notEqualTypeCnt: number;
  notEqualLengthArrCnt: number;
  notEqualArrValCnt: number;
  notEqaulValCnt: number;
  totalCnt: number;
  
}
