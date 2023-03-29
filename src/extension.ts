import * as vscode from "vscode";
import { copyFileNameCommandHandler } from "./commands/copyFileName";
import { copyGoPackageNameCommandHandler } from "./commands/copyGoPackageName";

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand(
        "clipboard.copyFileName", 
        copyFileNameCommandHandler,
    ));
	context.subscriptions.push(vscode.commands.registerCommand(
        "clipboard.copyGoPackageName", 
        copyGoPackageNameCommandHandler,
    ));
}

// This method is called when your extension is deactivated
export function deactivate() {}
