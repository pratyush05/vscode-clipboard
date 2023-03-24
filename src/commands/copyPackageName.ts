import * as path from "path";
import { getFileUri, getGoModulePath, saveToClipboard } from "./utils";

export function copyPackageNameCommandHandler(...args: any[]): any {
    const fileUri = getFileUri(args);
    const packageName = getGoModulePath(fileUri);
    saveToClipboard(packageName);
}
