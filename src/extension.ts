// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path = require('path');
import * as vscode from 'vscode';

class RubberDuckDebugger extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		private version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
		super(label, collapsibleState);
		this.tooltip = `${this.label}-${this.version}`;
		this.description = this.version;
	}
}

export class RubberDuckDebuggerProvider implements vscode.TreeDataProvider<RubberDuckDebugger> {
	constructor(private workspaceRoot: string) { }

	async getTreeItem(element: RubberDuckDebugger): Promise<vscode.TreeItem> {
		return element;
	}

	getChildren(element?: RubberDuckDebugger): vscode.ProviderResult<RubberDuckDebugger[]> {
		return []
	}

}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	function getWebViewContext(duckImageUri: vscode.Uri) {
		return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Cat Coding</title>
		</head>
		<body>
			<img src="${duckImageUri}" width="300" />
		</body>
		</html>`;
	}

	let disposable = vscode.commands.registerCommand('RubberDuckDebugger.say', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		const panel = vscode.window.createWebviewPanel("RubberDuckDebugger.panel", "Rubber Duck Thinking...", vscode.ViewColumn.One, {})

		const thinkingTime = 1500 * 5;

		const imageUriList = [
			vscode.Uri.file(path.join(context.extensionPath, "public", "duck1.png")),
			vscode.Uri.file(path.join(context.extensionPath, "public", "duck2.png")),
		]

		panel.webview.html = getWebViewContext(panel.webview.asWebviewUri(imageUriList[0]));
		setTimeout(async () => {
			panel.webview.html = getWebViewContext(panel.webview.asWebviewUri(imageUriList[1]));
			const result = await vscode.window.showInformationMessage('クエッ！', { modal: true }, { title: "助かりました！" });
			if (result) {
				vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://ja.wikipedia.org/wiki/%E3%83%A9%E3%83%90%E3%83%BC%E3%83%80%E3%83%83%E3%82%AF%E3%83%BB%E3%83%87%E3%83%90%E3%83%83%E3%82%B0'))
			}
			setTimeout(() => {
				panel.dispose();
			}, 3000)
		}, thinkingTime)

		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "アヒルちゃんが助けに来ました！",
			cancellable: true,
		}, async (progress, token) => {
			token.onCancellationRequested(() => {
				vscode.window.showErrorMessage("邪魔しないであげて！")
				panel.dispose();
			})
			const wait = async () => new Promise(r => setTimeout(r, 1500));

			progress.report({ increment: 0 });
			await wait();

			progress.report({ increment: 20, message: "アヒルちゃんがコードを確認しています..." })
			await wait();

			progress.report({ increment: 20, message: "アヒルちゃんが課題を理解しています..." })
			await wait();

			progress.report({ increment: 20, message: "アヒルちゃんが問題を解決しています..." })
			await wait();

			progress.report({ increment: 20, message: "まもなく、アヒルちゃんが答えを出力します。" })
			await wait();

		})

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
