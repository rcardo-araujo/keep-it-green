import { LanguageProfile } from "./models/LanguageProfile";
import { SupportedLanguages } from "./registry/SupportedLanguages";

import * as fs from "fs/promises";
import * as path from "path";

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
