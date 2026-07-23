import { LanguageProfile } from "../models/LanguageProfile";

const typescriptProfile: LanguageProfile = {
    footprint: `{ const _step = "tracked! kept it green" };\n`,
    file: "footprints.ts"
}

export const SupportedLanguages: Record<string, LanguageProfile> = {
    "typescript": typescriptProfile
};
