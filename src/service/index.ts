import type { APIResponse, RecordData } from '@/types/index';
import axios, {Axios} from 'axios'

const isDevelopment = import.meta.env.DEV

const client: Axios = axios.create({
    baseURL: isDevelopment ? 'http://localhost:8080/' : 'not yet',
    headers: {
        'Content-Type': 'application/json'
    }    
});

client.interceptors.request.use(
    (config) => {
        config.headers.authorization = 'token';
        config.headers['Access-Control-Allow-Origin'] = config.baseURL;
        return config;
    }
)

/**
 * 암호화 키로 기록 한개 가져오기
 * @param jsonIdx 
 * @returns 
 */
export const getRecordByEncryptkey = async (encryptKey: string) => {
   
    const response = await client.get<APIResponse<RecordData>>('/api/record/' + encryptKey);
    
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
    
    const response = await  client.post<APIResponse<any>>('/api/record', {
        encryptKey: encryptKey,
        leftData: leftData,
        rightData: rightData
      });

    return response.data; 

}