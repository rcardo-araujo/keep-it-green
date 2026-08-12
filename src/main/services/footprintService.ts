import { CommitData } from "../models/CommitData";
import { LanguageProfile } from "../models/LanguageProfile";
import { SupportedLanguages } from "../registry/SupportedLanguages";
import { AppError } from "../errors/AppError";

import * as fs from "fs/promises";
import * as path from "path";

async function appendFootprintsFile(languageProfile: LanguageProfile, repository: string, quantity: number): Promise<void> {
    const footprintsFilePath = path.join(repository, languageProfile.file);

    const footprintsPayload = languageProfile.footprint.repeat(quantity);

    try {
        await fs.appendFile(footprintsFilePath, footprintsPayload, "utf-8");
    } catch (error) {
        throw new AppError(`Footprints generation error in ${repository}`, "FOOTPRINT_GENERATION_FAILED", error);
    }
}

async function leaveFootprints(language: string, repository: string, quantity: number): Promise<void> {
    if (quantity <= 0) return;

    const languageProfile = SupportedLanguages[language];

    if (!languageProfile) {
        console.warn(`[WARN] Language not supported: ${language}`);
        return;
    }

    return appendFootprintsFile(languageProfile, repository, quantity);
}

export async function leaveCommitFootprints(commit: CommitData, repository: string): Promise<void> {
    for (const [language, quantity] of Object.entries(commit.insertions)) {
        await leaveFootprints(language, repository, quantity as number);
    }
}
