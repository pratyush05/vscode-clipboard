import * as path from "path";
import { getFileUri, getGoModulePath, getGoPackagePath, saveToClipboard } from "./utils";

export function copyGoPackageNameCommandHandler(...args: any[]): any {
    const fileUri = getFileUri(args);
    const goModulePath = getGoModulePath(fileUri);
    const goPackagePath = getGoPackagePath(fileUri);
    const goPackageName = goPackagePath && goPackagePath !== ""
        ? [goModulePath, goPackagePath].join(path.sep)
        : goModulePath;
    saveToClipboard(goPackageName);
}
