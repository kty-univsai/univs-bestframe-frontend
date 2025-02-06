/** @type {import("eslint").Linter.Config} */
module.exports = {
    env: {
        node: true, // Node.js 환경 설정
        browser: true, // 브라우저 환경 설정 (필요한 경우)
    },
    extends: [
      'plugin:@typescript-eslint/recommended',
      'next',
      'next/core-web-vitals',
      'prettier',
    ],
    plugins: ['@typescript-eslint', 'prettier', 'react-hooks'],
    rules: {
      // jsx 파일 확장자 .jx, .jsx, .ts, .tsx 허용
      'react/jsx-filename-extension': [
        'error',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
      // [error] Delete `␍` prettier/prettier
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
  
      // var 금지
      'no-var': 'warn',
  
      // 불필요한 세미콜론 사용 시 에러 표시
      'no-extra-semi': 'error',
  
      // 사용하지 않는 변수가 있을 때 발생하는 경고 비활성화
      'no-unused-vars': ['off'],
  
      // 콘솔 사용 시 발생하는 경고 비활성화
      'no-console': ['off'],
  
      //훅은 최상단 위에 위치해야 한다.
      'react-hooks/rules-of-hooks': 'error',
  
      // export문이 하나일 때 default export 사용 권장 경고 비활성화
      'import/prefer-default-export': ['off'],
  
      // react hooks의 의존성배열이 충분하지 않을 때 경고 표시
      'react-hooks/exhaustive-deps': ['warn'],
  
      // 컴포넌트 이름은 PascalCase로
      'react/jsx-pascal-case': 'warn',
  
      // 반복문으로 생성하는 요소에 key 강제
      'react/jsx-key': 'error',
  
      // 디버그 허용
      'no-debugger': 'off',
  
      // 화살표 함수의 파라미터가 하나일때 괄호 생략
      'arrow-parens': ['warn', 'as-needed'],
    },
    overrides: [
      {
        // 무시하고 싶은 파일 패턴
        files: ['app/sign-in/page.sections.tsx'],
        rules: {
          // 모든 규칙을 비활성화
          'no-unused-vars': 'off',
          'no-console': 'off',
          // 필요에 따라 다른 규칙 추가
        },
      },
    ],
  };
  