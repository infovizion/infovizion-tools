npx js-yaml syntaxes\qlik.tmLanguage.yaml > syntaxes\qlik.tmLanguage.json
npx js-yaml syntaxes\expression.tmLanguage.yaml > syntaxes\expression.tmLanguage.json
vsce package
code --install-extension qlik-tools-0.0.1.vsix
code ..\..\app.infovizion\demo2_conf\conf