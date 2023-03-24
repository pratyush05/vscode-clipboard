import * as path from "path";
import * as vscode from "vscode";

export function getFileUri(args: any[]): vscode.Uri {
    let fileUri = null;
    if (args && args.length > 0) {
        fileUri = args[0] as vscode.Uri;
    }
    if (!fileUri) {
        let editor = vscode.window.activeTextEditor as vscode.TextEditor;
        fileUri = editor.document.uri;
    }
    return fileUri;
}

export function getGoModulePath(fileUri: vscode.Uri): string {
    const goPath = getGoPath();
    const workspaceFolderPath = getWorkspaceFolderPath(fileUri);
    const goModulePath = path.relative(goPath, workspaceFolderPath);
    return sanitizeGoModulePath(goModulePath);
}

export function getGoPackagePath(fileUri: vscode.Uri): string {
    const workspaceFolderPath = getWorkspaceFolderPath(fileUri);
    const folderPath = path.dirname(fileUri.fsPath);
    const goPackagePath = path.relative(workspaceFolderPath, folderPath);
    return goPackagePath;
}

export function getGoPath(): string {
    const goPath = process.env["GOPATH"];
	return goPath && goPath !== "" ? goPath : "/go";
}

export function getWorkspaceFolderPath(fileUri: vscode.Uri): string {
    const workspace = vscode.workspace.getWorkspaceFolder(fileUri);
    return workspace ? workspace.uri.fsPath : "";
}

export function sanitizeGoModulePath(goModulePath: string): string {
    let segments = goModulePath.toLowerCase().split(path.sep);
    const srcIdx = segments.lastIndexOf("src");
    if (srcIdx !== -1) {
		return goModulePath.substring(segments.slice(0, srcIdx + 1).join(path.sep).length + 1);
	} else {
        return goModulePath;
    }
}

export function saveToClipboard(text: string): void {
    vscode.env.clipboard.writeText(text);
}
