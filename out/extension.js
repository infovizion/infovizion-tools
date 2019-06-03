"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const vscode = require("vscode");
let taskProvider;
function activate(_context) {
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
    let kind = {
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
        let convert2JsonTask = new vscode.Task(kind, 'Qlik Expression. Convert to JSON', 'qlik-expression', new vscode.ProcessExecution('inqlik.bat', ['expression', 'convert-to-json', filePath]), '$qlik-expressions');
        vscode.tasks.executeTask(convert2JsonTask);
    });
    _context.subscriptions.push(convert2JsonCommand);
}
exports.activate = activate;
function deactivate() {
    if (taskProvider) {
        taskProvider.dispose();
    }
}
exports.deactivate = deactivate;
function previewQvd(file) {
    const title = file.path.split('/').pop() + '';
    const panel = vscode.window.createWebviewPanel('zip_preview', title, vscode.ViewColumn.One, {
        enableScripts: true
    });
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
let _channel;
function getOutputChannel() {
    if (!_channel) {
        _channel = vscode.window.createOutputChannel('Infovizion tasks');
    }
    return _channel;
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
function getInfovizionTasks() {
    return __awaiter(this, void 0, void 0, function* () {
        // let workspaceRoot = vscode.workspace.rootPath;
        let result = [];
        let kind = {
            type: 'process'
        };
        let task = new vscode.Task(kind, 'Qlik Expression. Convert to JSON', 'qlik-expression', new vscode.ProcessExecution('inqlik.bat', ['expression convert-to-json', '$file']), '$qlik-expressions');
        return result;
    });
}
function getWebviewContent(fileName) {
}
//# sourceMappingURL=extension.js.map