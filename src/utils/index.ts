

/**
 * 파일 업로드 버튼 눌렀을 때 이벤트
 * @param uploadSideType 왼쪽인지 오른쪽인지 구분하는 param
 */
export function uploadFile(uploadSideType: string){
 
    const fileSpace = uploadSideType + 'File';
    const sideFile = document.getElementById(fileSpace);
  
    sideFile?.click();
  
}