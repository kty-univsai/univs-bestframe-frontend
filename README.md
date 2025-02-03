# UNIVS STUDIO

## Install & Start

- 레포지토리를 Clone 하고 IDE에서 설치합니다.
```bash
git clone https://github.com/univs-ai/univs-studio-frontend.git
yarn install
yarn dev
```

## Script

- 아래 스크립트를 사용하여 전체 코드의 lint를 체크할 수 있습니다.
```bash
yarn lint
```

## Skills

- 코어: Next.js, TypeScript
- 스타일: Emotion.js
- 버전 관리: Github
- 서버 통신: Axios, 
- 서버통신 상태 관리: Tanstack query
- 패키지: Yarn Berry


## Library

- material-ui: 화면 UI/UX
- tanstack/react-query: 서버(api 호출) 통신 상태 관리
- zustand: 상태 관리
- crypto-js: 암호와(비밀번호)
- react-code-blocks: cloud api 코드 블럭
- react-hot-toast: custom toast alert


## Coding Convention

- 함수 선언

  ```bash
  # 화살표 함수
  const action = () => {}
  ```

- 함수 네이밍

  ```bash
  # 일반함수: 동사 + 명사 구조로 작성
  
  # 생성
  const createData = () => {}
  # 수정
  const updateData = () => {}
  # 삭제
  const removeData = () => {}
  # 초기화
  const setData = () => {}
  # 조회
  const getData = () => {}

  # 이벤트 함수: 앞에 handle 붙일것
  
  # 클릭
  const handleClick = () => {}
  # 변경
  const handleChange = () => {}
  ```

- import rule

  ```bash
  # package import시 상단, 프로젝트 내에서 import시 하단
  import React from 'react';
  import styled from '@emotion/styled';
    
  import { Logo } from '@/components/atoms/Logo';
  import { PaletteType } from '@/types/paletteType';
  ```

- type 정의 **주로** 사용

  ```bash
  # 앞에 대문자 T를 붙이고 시작
  type TExample = {
    id: number;
  }
  ```

- interface 정의 **상속이 필요한 타입의 경우** 사용

  ```bash
  # 앞에 대문자 I를 붙이고 시작
  interface IExample {
    id: number;
  }
  ```

## git commit message
- feat: 기능 생성, library 설치 등
- modify: 생성된 기능 수정, 함수이름 수정, 파일이름 수정 등
- add: 생성된 기능이나 컴포넌트에 기능 추가
- refactor: 기능은 변경되지 않고 구조 변경
- style: 스타일 수정
- docs: docs 문서 수정 readme.md 수정
- resource: png, svg, font 등 파일 추가
- chore: 코드 줄바꿈, 코드 위치 바꿈, paragraph(text) 수정 등 minor한 코드 수정
- remove: 제거된 파일, resource 등


## Explanation

- 로그인 후 메뉴, 화면은 백엔드 api role에 `'USER' | 'ADMIN'` 에 따라서 달라집니다.
- 메뉴는 백엔드에서 로그인시 보내주며, 하드코딩 되어있는 메뉴는 `상단 home, Contact Sales, Log Out` 입니다.
- Cloud Api 하위 페이지 추가시 기존 생성되어 있는 페이지 복붙해서 사용하면 되고, `Component 이름`과 `제목`만 바꾸면 됩니다.
  - 페이지 내부 컴포넌트는 공통이고, 백엔드에서 보내주는 페이지 url `featureId`에 따라 다르게 호출됩니다.
  - credential url, key 복사하는 부분은 http 에서 동작하지 않으나 https 에서는 정상 동작합니다.(navigator.clipboard 때문)
- Contact sales, Request License 모달의 key는 `0: cloud api, 3: contact sales` 로 되어 있으며 모달 컴포넌트 파일 내부에 주석처리 되어있습니다.
  - modal select box는 백엔드에서 보내주는 데이터 입니다.
  - admin에서 유저 라이센스 추가할 때는 받아온 데이터를 프론트에서 `contact를 제외`하고 사용하고 있습니다. 
- User Organization 정보는 email을 제외하고 변경이 가능합니다.(admin 에서도 변경 가능) 
  - country는 회원가입시 입력하여 선택할 수 있지만 그 외에는 select box로 선택해야합니다.
- 로그인 후 비밀번호 변경시 zustand 상태관리에 유저 `email`을 들고 이동하게 됩니다.
- 백엔드에서 보내주는 날짜 데이터는 `하이픈 형식`이라 `form.ts`에 `dateForm`함수를 통해 변경 후 화면에 보여집니다.
- 날짜 데이터를 백엔드에 보낼 때도 `하이픈 형식`으로 보내야하기 때문에 `mui/x-date-pickers` 라이브러리에서 받는 데이터를 `form.ts`에 `validateAndFormatDate`함수를 통해 변경 후 전송합니다.


## Git Branch Strategy

- main
  - 현재 출시중인 브랜치

- dev
  - 개발 버전 브랜치(QA 진행)

- feature
  - 새로운 기능 개발하는 브랜치


> feature 브랜치에서 작업 후 dev 브랜치로 PR -> Merge : QA 테스트 <br/>
dev 브랜치에서 main 브랜치로 PR -> Merge: 배포