import * as path from "path";
import { getFileUri, saveToClipboard } from "./utils";

export function copyFileNameCommandHandler(...args: any[]): any {
    const fileUri = getFileUri(args);
    const fileName = path.basename(fileUri.fsPath);
    saveToClipboard(fileName);
}
