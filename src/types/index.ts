
export interface SelectItem {
  jsonIdx: number
  subject: string
}

export interface AlertObj{
  flag: boolean
  msg: string | unknown
}

export interface RecordData{
  jsonIdx: number
  subject: string
  leftData: string
  rightData: string
}

export interface APIResponse<T>{
  message: string
  result: T
}

export interface MsgDataObj{
  type: string
  keyStr: string
  msg: string
}

export interface SaveDataObj{
  text: string
  convertText: string
  classNm: string
}

export interface CheckboxItem{
  label: string
  isChecked: boolean
  classNm: string
}
