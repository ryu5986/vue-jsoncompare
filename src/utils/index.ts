import { useDialogStore } from '@/stores/dialog'

 /**
     * 빈값 체크 하기
     * @param value 
     * @returns 
     */
 export function isEmpty(value: any): boolean {

    if (Array.isArray(value)) {

        return value.length === 0;

    } else if (typeof value === 'object' && value !== null) {

        return Object.keys(value).length === 0;

    } else {

        return value === null || value === undefined || value === '' || value === '{}' || value === '[]';
        
    }
}

/**
 * 파일 업로드 버튼 눌렀을 때 이벤트
 * @param uploadSideType 왼쪽인지 오른쪽인지 구분하는 param
 */
export function uploadFile(uploadSideType: string){
 
    const fileSpace = uploadSideType + 'File';
    const sideFile = document.getElementById(fileSpace);
  
    sideFile?.click();
  
}

/**
 * 파일 확장자 체크
 * @param event 
 * @param fileSideType 
 * @returns 
 */
export function checkFileType(fileInput: HTMLInputElement){

    const dialogStore = useDialogStore();
    const file = fileInput.files?.[0];

    if(file){

        const fileName: string = file.name;
        const fileSplitArr: string[] = fileName.split('.');
        const fileExtension: string = fileSplitArr[fileSplitArr.length - 1].toLowerCase();

        if(fileExtension != 'json'){
          
          dialogStore.dialogFlag = true;
          dialogStore.dialogMessage = "json 파일 형식만 가능합니다.";

        }

    }else{

        dialogStore.dialogFlag = true;
        dialogStore.dialogMessage = "잘못된 접근 입니다.";

    }

}