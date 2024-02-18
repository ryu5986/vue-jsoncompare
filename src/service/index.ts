import type { APIResponse, RecordData } from '@/types/index';
import axios from 'axios'

/**
 * 암호화 키로 기록 한개 가져오기
 * @param jsonIdx 
 * @returns 
 */
export const getRecordByEncryptkey = async (encryptKey: string) => {
   
    const response = await axios.get<APIResponse<RecordData>>('/api/record/' + encryptKey);
    
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