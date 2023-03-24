import * as path from "path";
import { getFileUri, getGoModulePath, getGoPackagePath, saveToClipboard } from "./utils";

export function copyPackageNameCommandHandler(...args: any[]): any {
    const fileUri = getFileUri(args);
    const goModulePath = getGoModulePath(fileUri);
    const goPackagePath = getGoPackagePath(fileUri);
    const packageName = goPackagePath && goPackagePath !== ""
        ? [goModulePath, goPackagePath].join(path.sep)
        : goModulePath;
    saveToClipboard(packageName);
}
