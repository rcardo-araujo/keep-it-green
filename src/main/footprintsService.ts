import * as fs from "fs/promises";
import * as path from "path";

const tsFootprint = `{ const _step = "tracked! kept it green" };\n`
const tsFootprintsFile = "footprints.ts"

export async function leaveTsFootprints(repository: string, quantity: number): Promise<void> {
    const footprintsFilePath = path.join(repository, tsFootprintsFile);

    const footprintsPayload = tsFootprint.repeat(quantity);

    try {
        await fs.appendFile(footprintsFilePath, footprintsPayload, "utf-8");
    } catch (error) {
        console.log("TS footprints generation error: ", error);
        throw(error);
    }
}
