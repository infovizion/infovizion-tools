/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'child_process';
import * as vscode from 'vscode';

let kind: InfovizoinTaskDefinition = {
	type: 'shell'
};
let taskProvider: vscode.Disposable | undefined;

export function activate(_context: vscode.ExtensionContext): void {
	console.log('Congratulations, your extension "Infovizion" is now active!');
	_registerCommand(_context, 'infovizion-tools.qvd_preview', previewQvd);
	_registerCommand(_context, 'infovizion-tools.expressions_to_json', () => {	
		inqlikEditorTask( ['expression', 'convert-to-json'],'Qlik Expression. Convert to JSON');
	});
	_registerCommand(_context, 'infovizion-tools.expressions_migrate', () => {	
		inqlikEditorTask( ['expression', 'migrate'],'Qlik Expression. Migrate file to new format (App.variables)');
	});
	_registerCommand(_context, 'infovizion-tools.qvs_check', () => {	
		qvsEditoTask( ['qvs', '--command', 'check'],'Check Qlik load script for errors');
	});
	_registerCommand(_context, 'infovizion-tools.qvs_check_and_reload', () => {	
		qvsEditoTask( ['qvs', '--command', 'check_and_reload'],'Check script for errors and run reload task on success');
	});
}

export function deactivate(): void {
	if (taskProvider) {
		taskProvider.dispose();
	}
}
function inqlikEditorTask(args: string[], description: string) {
	let textEditor = vscode.window.activeTextEditor;
	if (textEditor === undefined) {
		return;
	}
	let filePath = textEditor.document.fileName;
	args.push(filePath);
	let task = new vscode.Task(kind, description, 'qlik-expressions', new vscode.ShellExecution('ivtool', args),
		'$qlik-expressions');
	vscode.tasks.executeTask(task);
}
function qvsEditoTask(args: string[], description: string) {
	let textEditor = vscode.window.activeTextEditor;
	if (textEditor === undefined) {
		return;
	}
	let filePath = textEditor.document.fileName;
	args.push(filePath);
	let task = new vscode.Task(kind, description, 'qvs', new vscode.ShellExecution('ivtool', args),
		'$qlik');
	vscode.tasks.executeTask(task);
}
function _registerCommand(_context: vscode.ExtensionContext, commandId: string, callback: (...args: any[]) => any, thisArg?: any) {
	let command = vscode.commands.registerCommand(commandId, callback);
	_context.subscriptions.push(command);
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
	let commandLine = `ivtool qvd --format html ${filePath}`;
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

	let task = new vscode.Task(kind, 'Qlik Expression. Convert to JSON', 'qlik-expression', new vscode.ProcessExecution('inqlik', ['expression convert-to-json', '$file']),
		'$qlik-expressions');
	return result;
}

function getWebviewContent(fileName: string) {
}