import { type PluginConfig } from "@trivago/prettier-plugin-sort-imports";
import { type Config } from "prettier";

const config: Config & PluginConfig = {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^(bun|path|os|sys|stream)",
    "<THIRD_PARTY_MODULES>",
    "^@/.*",
    "^../",
    "^./",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default config;
