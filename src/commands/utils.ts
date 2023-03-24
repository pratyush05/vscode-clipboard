import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";

export function fixDriveCasingInWindows(pathToFix: string): string {
	return process.platform === "win32" && pathToFix
		? pathToFix.substring(0, 1).toUpperCase() + pathToFix.substring(1)
		: pathToFix;
}

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

export function getGoConfig(fileUri: vscode.Uri): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration("go", fileUri);
}

export function getGoModulePath(fileUri: vscode.Uri): string {
    const goPath = getGoPath(fileUri);
    const workspaceFolderPath = getWorkspaceFolderPath(fileUri);
    const goModulePath = path.relative(goPath, workspaceFolderPath);
    let segments = goModulePath.toLowerCase().split(path.sep);
    const srcIdx = segments.lastIndexOf("src");
    if (srcIdx !== -1) {
		return goModulePath.substring(segments.slice(0, srcIdx + 1).join(path.sep).length + 1);
	} else {
        return goModulePath;
    }
}

export function getGoPath(fileUri: vscode.Uri): string {
    const workspaceFolderPath = getWorkspaceFolderPath(fileUri);
    const config = getGoConfig(fileUri);
    const filePath = fixDriveCasingInWindows(fileUri.fsPath);
    let inferredGoPath: string | undefined;
	if (config["inferGopath"] === true) {
		inferredGoPath = getInferredGoPath(filePath);
		if (!inferredGoPath) {
			try {
				if (fs.statSync(path.join(workspaceFolderPath, "src")).isDirectory()) {
					inferredGoPath = workspaceFolderPath;
				}
			} catch (e) {
            }
		}
		if (inferredGoPath) {
			try {
				if (fs.existsSync(path.join(inferredGoPath, "go.mod"))) {
					inferredGoPath = "";
				}
			} catch (e) {
            }
		}
		if (inferredGoPath && process.env["GOPATH"] && inferredGoPath !== process.env["GOPATH"]) {
			inferredGoPath += path.delimiter + process.env["GOPATH"];
		}
	}
    const configGoPath = config["gopath"] ? resolvePath(substituteEnv(config["gopath"]), workspaceFolderPath) : "";
	const goPath = (inferredGoPath ? inferredGoPath : configGoPath || process.env["GOPATH"]) ?? "";
	return goPath;
}

export function getInferredGoPath(folderPath: string): string | undefined {
	const segments = folderPath.toLowerCase().split(path.sep);
	const srcIdx = segments.lastIndexOf("src");
	if (srcIdx > 0) {
		return folderPath.substring(0, segments.slice(0, srcIdx).join(path.sep).length);
	}
    return;
}

export function getWorkspaceFolderPath(fileUri: vscode.Uri): string {
    const workspace = vscode.workspace.getWorkspaceFolder(fileUri);
    if (workspace) {
        return fixDriveCasingInWindows(workspace.uri.fsPath);
    }
    return "";
}

export function guessPackageNameFromFile(filePath: string): string {
    const goFileName = path.basename(filePath);
    if (goFileName === "main.go") {
        return "main";
    }
    const directoryPath = path.dirname(filePath);
    const directoryName = path.basename(directoryPath);
    let segments = directoryName.split(/[.-]/);
    segments = segments.filter((val) => val !== "go");
    if (segments.length === 0 || !/[a-zA-Z_]\w*/.test(segments[segments.length - 1])) {
        return "";
    }
    const proposedPackageName = segments[segments.length - 1];
    fs.stat(path.join(directoryPath, "main.go"), (_, stats) => {
        if (stats && stats.isFile()) {
            return "main";
        }
        return proposedPackageName;
    });
    return proposedPackageName;
}

export function resolveHomeDir(inputPath: string): string {
	if (!inputPath || !inputPath.trim()) {
		return inputPath;
	}
	return inputPath.startsWith("~") ? path.join(os.homedir(), inputPath.substr(1)) : inputPath;
}

export function resolvePath(inputPath: string, workspaceFolder: string): string {
	if (!inputPath || !inputPath.trim()) {
		return inputPath;
	}
    inputPath = inputPath.replace(/\${workspaceFolder}|\${workspaceRoot}/g, workspaceFolder);
    inputPath = inputPath.replace(/\${workspaceFolderBasename}/g, path.basename(workspaceFolder));
	return resolveHomeDir(inputPath);
}

export function saveToClipboard(text: string): void {
    vscode.env.clipboard.writeText(text);
}

export function substituteEnv(input: string): string {
	return input.replace(/\${env:([^}]+)}/g, (_, capture) => {
		return process.env[capture.trim()] || "";
	});
}
