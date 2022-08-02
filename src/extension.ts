import * as vscode from 'vscode';
import nginxfmt from 'nginxfmt';

export function activate(context: vscode.ExtensionContext) {
	vscode.languages.registerDocumentFormattingEditProvider('nginx', {
		provideDocumentFormattingEdits
	});
	const disposable = vscode.commands.registerCommand('extension.nginxfmt', runNginxFmt);
	context.subscriptions.push(disposable);
};

function provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {

	let selection = getDocWideSelectionWithDocument(document, vscode.window.activeTextEditor);
	if (selection === undefined) {
		return Promise.reject();
	}
	let selectedText = selection[2];
	let vscodeSelection = selection[1];
	let _editor = selection[0];

	try {
		const result = nginxfmt(selectedText);
		return Promise.resolve([
			vscode.TextEdit.replace(vscodeSelection, result)
		]);
	}
	catch (err) {
		throw new Error("Can not format this file or selection");
	}
};

function runNginxFmt() {
	console.log("hello");
	const editor = vscode.window.activeTextEditor;
	if (editor === undefined) { return; }
	const document = editor.document;

	let selection = getDocWideSelectionWithDocument(document, vscode.window.activeTextEditor);
	if (selection === undefined) {
		return Promise.reject();
	}
	let selectedText = selection[2];
	let vscodeSelection = selection[1];
	let _editor = selection[0];

	try {
		const result = nginxfmt(selectedText);
		editor.edit(editBuilder => {
			editBuilder.replace(vscodeSelection, result);
		});
	}
	catch (err) {
		throw new Error("Can not format this file or selection");
	}
}

function getDocWideSelectionWithDocument(document: vscode.TextDocument,
	editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor): [vscode.TextEditor, vscode.Range, string] | undefined {
	if (editor) {
		let selection: vscode.Range = editor.selection;
		let selectedAsString = document.getText(selection);
		if (selectedAsString) {
			console.log("selction: " + selectedAsString);
		} else {
			console.log("no selction, then select all");
			selectedAsString = document.getText();
			var firstln = editor.document.lineAt(0);
			var lastln = editor.document.lineAt(editor.document.lineCount - 1);
			selection = new vscode.Range(firstln.range.start, lastln.range.end);
		}
		return [editor, selection, selectedAsString];
	}
	return undefined;
}

export function deactivate() { }
