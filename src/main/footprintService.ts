import * as fs from "fs/promises";
import * as path from "path";

interface LanguageProfile {
    footprint: string,
    file: string
};

const typescriptProfile: LanguageProfile = {
    footprint: `{ const _step = "tracked! kept it green" };\n`,
    file: "footprints.ts"
}

const SupportedLanguages: Record<string, LanguageProfile> = {
    "typescript": typescriptProfile
};

export async function appendFootprintsFile(languageProfile: LanguageProfile, repository: string, quantity: number): Promise<void> {
    const footprintsFilePath = path.join(repository, languageProfile.file);

    const footprintsPayload = languageProfile.footprint.repeat(quantity);

    try {
        await fs.appendFile(footprintsFilePath, footprintsPayload, "utf-8");
    } catch (error) {
        console.log("TS footprints generation error: ", error);
        throw(error);
    }
}

export async function leaveFootprints(language: string, repository: string, quantity: number): Promise<void> {
    if (quantity <= 0) return;

    const languageProfile = SupportedLanguages[language];

    if (!languageProfile) {
        console.log("Language not supported");
        return
    }

    return appendFootprintsFile(languageProfile, repository, quantity);
}
