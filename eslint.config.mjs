import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/** eslint-config-next 16 ships native flat configs, so no FlatCompat needed. */
const eslintConfig = [
  { ignores: ["node_modules/**", ".next/**", "out/**", "next-env.d.ts"] },
  ...coreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
