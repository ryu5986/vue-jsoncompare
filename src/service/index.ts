import type { APIResponse, RecordData, SelectItem } from '@/types/index';
import axios from 'axios'

/**
 * 기록 리스트 가져오기
 * @returns 
 */
export const getRecordList = async () => {
    
    const response = await axios.get<APIResponse<SelectItem[]>>('/api/record');
    
    return response.data;    
}

/**
 * 기록 한개 가져오기
 * @param jsonIdx 
 * @returns 
 */
export const getRecord = async (jsonIdx: number) => {
   
    const response = await axios.get<APIResponse<RecordData>>('/api/record/' + jsonIdx);
    
    return response.data;   
}

/**
 * 기록 지우기
 * @param jsonIdx 
 * @returns 
 */
export const deleteRecord = async (jsonIdx: number) => {

    const response = await axios.delete<APIResponse<any>>('/api/record/' + jsonIdx);
    
    return response.data;       

}


/**
 * 암호화 키로 기록 한개 가져오기
 * @param jsonIdx 
 * @returns 
 */
export const getRecordByEncryptkey = async (encryptKey: string) => {
   
    const response = await axios.post<APIResponse<RecordData>>('/api/record/encryptkey', { encryptKey : encryptKey});
    
    return response.data;   
}

/**
 * 기록 저장 하기
 * @param leftData 
 * @param rightData 
 * @param encryptKey 
 * @returns 
 */
export const insertRecord = async (leftData: string, rightData: string, encryptKey: string) => {
    
    const response = await  axios.post<APIResponse<any>>('/api/record', {
        encryptKey: encryptKey,
        leftData: leftData,
        rightData: rightData
      });

    return response.data; 

}