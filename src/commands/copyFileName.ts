import * as path from 'path';
import * as vscode from 'vscode';

export function copyFileNameCommandHandler(...args: any[]): any {
    const uri = getFileUri(args);
    const fileName = path.basename(uri.fsPath);
    saveFileName(fileName);
}

export function getFileUri(args: any[]): vscode.Uri {
    let uri = null;
    if (args && args.length > 0) {
        uri = args[0] as vscode.Uri;
    }
    if (!uri) {
        let editor = vscode.window.activeTextEditor as vscode.TextEditor;
        uri = editor.document.uri;
    }
    return uri;
}

export function saveFileName(fileName: string): void {
    vscode.env.clipboard.writeText(fileName);
}


