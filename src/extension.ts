/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'child_process';
import * as vscode from 'vscode';

let taskProvider: vscode.Disposable | undefined;

export function activate(_context: vscode.ExtensionContext): void {
	// let workspaceRoot = vscode.workspace.rootPath;
	// if (!workspaceRoot) {
	// 	return;
	// }
	// let pattern = path.join(workspaceRoot, 'Rakefile');
	// let rakePromise: Thenable<vscode.Task[]> | undefined = undefined;
	// let fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);
	// fileWatcher.onDidChange(() => rakePromise = undefined);
	// fileWatcher.onDidCreate(() => rakePromise = undefined);
	// fileWatcher.o	console.log('Congratulations, your extension "Infovizion" is now active!');nDidDelete(() => rakePromise = undefined);
	console.log('Congratulations, your extension "Infovizion" is now active!');
	let kind: InfovizoinTaskDefinition = {
		type: 'process'
	};
	// taskProvider = vscode.tasks.registerTaskProvider('infovizion', {
	// 	provideTasks: () => {
	// 		// if (!rakePromise) {
	// 		// 	rakePromise = getRakeTasks();
	// 		// }
	// 		return [convert2JsonTask];
	// 	},
	// 	resolveTask(_task: vscode.Task): vscode.Task | undefined {
	// 		return undefined;
	// 	}
	// });
	let qvdPreview = vscode.commands.registerCommand('qlik-tools.qvd_preview', previewQvd);
	_context.subscriptions.push(qvdPreview);
	let convert2JsonCommand = vscode.commands.registerCommand('qlik-tools.expressions_to_json', () => {
		let textEditor = vscode.window.activeTextEditor;
		if (textEditor === undefined) {
			return;
		}
		let filePath = textEditor.document.fileName;
		console.log(filePath);
		let convert2JsonTask = new vscode.Task(kind, 'Qlik Expression. Convert to JSON', 'qlik-expression', new vscode.ProcessExecution('inqlik.bat', ['expression', 'convert-to-json', filePath]),
			'$qlik-expressions');
		vscode.tasks.executeTask(convert2JsonTask);
	});
	_context.subscriptions.push(convert2JsonCommand);
}

export function deactivate(): void {
	if (taskProvider) {
		taskProvider.dispose();
	}
}
function previewQvd(file: vscode.Uri) {
	const title = file.path.split('/').pop() + '';
	const panel = vscode.window.createWebviewPanel(
		'zip_preview',
		title,
		vscode.ViewColumn.One,
		{
			enableScripts: true
		}
	);
	let filePath = file.path;
	if (filePath.startsWith('/')) {
		filePath = filePath.substring(1);
	}
	let commandLine = `inqlik.bat qvd --format html ${filePath}`;
	console.log(commandLine);
	let content = cp.execSync(commandLine, { encoding: 'utf8' });
	console.log(content);
	panel.webview.html = content;
}

let _channel: vscode.OutputChannel;
function getOutputChannel(): vscode.OutputChannel {
	if (!_channel) {
		_channel = vscode.window.createOutputChannel('Infovizion tasks');
	}
	return _channel;
}

interface InfovizoinTaskDefinition extends vscode.TaskDefinition {
	/**
	 * The task name
	 */
	// task: string;

	/**
	 * The rake file containing the task
	 */
	// file?: string;
}

// const buildNames: string[] = ['build', 'compile', 'watch'];
// function isBuildTask(name: string): boolean {
// 	for (let buildName of buildNames) {
// 		if (name.indexOf(buildName) !== -1) {
// 			return true;
// 		}
// 	}
// 	return false;
// }

// const testNames: string[] = ['test'];
// function isTestTask(name: string): boolean {
// 	for (let testName of testNames) {
// 		if (name.indexOf(testName) !== -1) {
// 			return true;
// 		}
// 	}
// 	return false;
// }

async function getInfovizionTasks(): Promise<vscode.Task[]> {
	// let workspaceRoot = vscode.workspace.rootPath;
	let result: vscode.Task[] = [];
	let kind: InfovizoinTaskDefinition = {
		type: 'process'
	};

	let task = new vscode.Task(kind, 'Qlik Expression. Convert to JSON', 'qlik-expression', new vscode.ProcessExecution('inqlik.bat', ['expression convert-to-json', '$file']),
		'$qlik-expressions');
	return result;
}

function getWebviewContent(fileName: string) {
}