import * as fs from "fs/promises";
import * as path from "path";

interface LanguageProfile {
    footprint: string,
    file: string
};

const tsProfile: LanguageProfile = {
    footprint: `{ const _step = "tracked! kept it green" };\n`,
    file: "footprints.ts"
}

const LanguageProfileDict: Record<string, LanguageProfile> = {
    "typescript": tsProfile
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

    const languageProfile = LanguageProfileDict[language];

    if (!languageProfile) {
        console.log("Language not supported");
        return
    }

    return appendFootprintsFile(languageProfile, repository, quantity);
}
