// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default eslintConfig;

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// 기본 ESLint 설정 (공통)
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

// 개발 환경에서만 엄격한 규칙 적용
if (process.env.NODE_ENV === "development") {
  eslintConfig.push(
    ...compat.extends("eslint-config-turbo"),
    {
      rules: {
        "no-console": "error", // 개발 중 console.log() 금지
        "no-debugger": "error", // debugger 사용 금지
        "eqeqeq": ["error", "always"], // == 대신 === 강제
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "@typescript-eslint/no-explicit-any": "off", // ✅ any 타입 허용
      },
    }
  );
}

export default eslintConfig;
