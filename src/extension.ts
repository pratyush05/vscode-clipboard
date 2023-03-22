import * as vscode from 'vscode';
import { copyFileNameCommandHandler } from './commands/copyFileName';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    let copyFileNameCommand = vscode.commands.registerCommand(
        'clipboard.copyFilename', 
        copyFileNameCommandHandler,
    );
	context.subscriptions.push(copyFileNameCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
