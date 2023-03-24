import * as vscode from "vscode";
import { copyFileNameCommandHandler } from "./commands/copyFileName";
import { copyPackageNameCommandHandler } from "./commands/copyPackageName";

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand(
        "clipboard.copyFileName", 
        copyFileNameCommandHandler,
    ));
	context.subscriptions.push(vscode.commands.registerCommand(
        "clipboard.copyPackageName", 
        copyPackageNameCommandHandler,
    ));
}

// This method is called when your extension is deactivated
export function deactivate() {}
