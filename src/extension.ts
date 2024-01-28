// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import fs from "fs";
import path from "path";

import hljs from "highlight.js";

/**
 * Provides a automated code fix to convert a non-specified double to a float
 */
export class Floatify implements vscode.CodeActionProvider {
  public static readonly isProjectFloatifyEnabled = (
    document: vscode.TextDocument
  ) => {
    let parentDirectory = path.dirname(document.fileName);
    while (fs.existsSync(parentDirectory)) {
      const floatifyConfigPath = path.join(parentDirectory, "floatify.json");
      if (fs.existsSync(floatifyConfigPath)) {
        const config = JSON.parse(
          fs.readFileSync(floatifyConfigPath).toString()
        );
        return config.enabled;
      }

      const parentDirname = path.dirname(parentDirectory);
      if (parentDirectory === parentDirname) {
        return false;
      }

      parentDirectory = parentDirname;
    }

    return false;
  };

  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.SourceFixAll,
  ];

  public async provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): Promise<vscode.CodeAction[] | undefined> {
    if (!Floatify.isProjectFloatifyEnabled(document)) {
      return;
    }
    const documentText = document.getText(range);

    const indexesOfDoubles = documentText.matchAll(/(\-?\d+\.+\d+)(?!d|f|m)/g);

    const hl = hljs.highlight(documentText, { language: "csharp" });
    const codeHiglightingLines = hl.value.split("\n").map((x) => x.trim());

    const fix = new vscode.CodeAction(
      `Convert unspecified doubles to float`,
      vscode.CodeActionKind.SourceFixAll
    );

    fix.edit = new vscode.WorkspaceEdit();

    for (const match of indexesOfDoubles) {
      const matchIndex = match.index;
      if (!matchIndex) {
        console.log("No match index!?");
        continue;
      }
      const positionStart = document.positionAt(matchIndex);
      const positionEnd = document.positionAt(matchIndex + match[0].length);
      // Super hacky way to determine if the number is a number or within a string
      if (
        codeHiglightingLines[positionStart.line].indexOf(
          '<span class="hljs-number">' + match[0] + "</span>"
        ) > -1
      ) {
        const range = new vscode.Range(positionStart, positionEnd);
        fix.edit.replace(document.uri, range, document.getText(range) + "f");
      }
    }

    return [fix];
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "floatify" is now active!');

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { language: "csharp", scheme: "file" },
      new Floatify(),
      {
        providedCodeActionKinds: [vscode.CodeActionKind.SourceFixAll],
      }
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
