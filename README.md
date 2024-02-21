# vue-jsoncompare
---

### 프로젝트 소개
---
JSON 데이터를 비교하여 서로 다른점의 내용과 수를 표기하고 그중에서도 원하는 형식만 볼 수 있게 만든 프로젝트입니다.
(Back-end 내용은 <https://github.com/ryu5986/jsoncompare-rest-api> 의 README 확인 부탁드리겠습니다. ^^)

### 개발 기간
---
* 2023.01.30 ~ 2024.02.20
* 1주차 ~ 2주차: front-end 및 back-end 작업
* 3주차: 최종 점검 및 AWS 배포

### 개발 배경
---
저는 SI 회사에서 약 3년 정도 근무를 하면서 항상 똑같은 언어와 작업으로 인해 제 개인의 역량이
발전보다는 반복에 가까워 지는 느낌을 받아 매너리즘이 오기전에 그만두고 미래진로에 대해 생각할 시간이 필요했습니다.
그 과정에서 주변 선후배 및 동료분들께 자문을 구하며 앞으로 어떻게 해야할지 고심 끝에 작업을 하는데 있어 저와 더 잘맞을 거 같은
front-end 쪽으로 진로를 결정하게 되었습니다.
이과정에서 저는 기존에 늘 사용하던 JQuery, JavaScript, JSP, Thymeleaf 보다는 좀 더 Modern 한 개발언어나 방식이 필요하다고 느껴 미니 프로젝트를 만들어야 겠다고 생각했습니다.
어떤 프로젝트를 할 지 고민 하던 중 평소 자주 이용하던 JSON 비교 사이트 <https://www.jsondiff.com/> 가 떠오르기도 하고 비슷하게 만들면서 추가적으로 DB 연결도 해보면 좋을 것 같아 진행 하게 되었습니다.

### 기술 스텍(Frond-end)
---
* IDE: VSCode
* Framework: Vue
* Lang: TypeScript

### 프로젝트 주요 기능
---
1. 왼쪽과 오른쪽에 각각 JSON 형식을 입력하거나 JSON 파일을 받아 서로 다른점을 비교 하여 결과를 표시합니다.
2. 표시된 결과에서 다른점을 분류별로 나뉘어 원하는 분류만 눈에 띄게 볼 수 있습니다.
3. 다른점을 색상을 주어 표기하였고 색상이 있는 줄을 클릭했을 시 해당 다른점에 대한 내용만도 볼 수 있습니다.

### 프로젝트 개발 구성과 이유
---
1. Vue 를 선택한 이유
   - 구성이 가벼워 러닝타임이 빠르며 프레임워크 자체적으로 제공하는 기능도 있고, 양방향 데이터 바인딩으로 데이터의 변화가 화면에 자동으로 변형되는 장점이 있어 선택하게 되었습니다.

2. Options API 가 아닌 Composition API 방식을 선택한 이유
   - Options API 는 데이터, 메소드, 라이프사이클 훅을 객체로 정의해 직관적으로 보여질 수 있지만 컴포넌트가 커지면 관리가 어려워질 수 있고 코드의 재사용성이 떨어질 수 있으며 Vue2의 지원이 최근 종료 되며 Vue3를 권장하는 현 상황에서 공식문서에서도 권장하는 Composition API 을 사용하게 되었습니다. 또한 setup 을 이용하여 this 를 사용하지 않고 접근이 가능하며 이로 인해 보다 유연한 코드 구성이 가능합니다.

3. Vite를 사용한 이유
   - Webpack 과 달리 esbuild로 미리 번들링한 모듈을 필요할 때 동적으로 가져와 빌드 속도가 빠르며 개발 과정에서 변경되는 부분 확인에 용이하여 사용했습니다.

4. Vuetify 를 사용한 이유
   - 평소 작업 할 때 Bootstrap 을 주로 사용했던 저로써는 이와 비슷한 것을 찾다가 Vuetify 라는 것을 알게 되었고 공식문서에서 제공하는 component 와 api 에 대한 설명도 자세하게 되어있을 뿐 아니라 Vue.js 와 통합되어 있는 최적화 UI Framework라 판단 하여 사용하였습니다.

5. Pinia를 사용한 이유
   - 우선은 현재 프로젝트에서 굳이 Store를 사용하지 않고 localStorage 에 Compare 할 데이터를 저장하여 렌더링 하는 방법이 있지만 Store 사용법을 익혀 활용할 수 도 있는걸 표현하고 싶어 사용했습니다. Pinia 는 store 를 여러개 생성 할 수 있는 강점이 있고 타입스크립트를 지원하여 타입스크립트로 개발시에도 이점을 얻을 수 있으며 vuex 보다 직관적인 API를 제공하여 사용했습니다.

6. TypeScript 사용 이유
   - 기존 javascript 만으로 작업할 때는 타입이 명시적이지 않아 가독성이 떨어지고 타입을 추론해야 하는 면에서 다소 불편함이 있었으나 TypeScript 는 보다 명시적이고 JAVA 에서 활용했던 것처럼 제네릭도 표현할 수 있어 확실히 직관적으로 알 수 있는 장점이 있어 사용하였습니다.

### URL
---
- <http://vue-jsoncompare.s3-website.ap-northeast-2.amazonaws.com>

### Flow Chart
---
처음 페이지 접속하여 진행 flow chart
![flowchart1](https://github.com/ryu5986/vue-jsoncompare/assets/66866506/bae6f170-212e-4362-9e37-21281cad3717)
결과 페이지 flow chart
![flowchart2](https://github.com/ryu5986/vue-jsoncompare/assets/66866506/b1bccc51-71b4-4442-b167-a8576e85d5f9)

  
