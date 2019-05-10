call npx js-yaml syntaxes\qlik.tmLanguage.yaml > syntaxes\qlik.tmLanguage.json
call npx js-yaml syntaxes\expression.tmLanguage.yaml > syntaxes\expression.tmLanguage.json
call vsce package
call code --install-extension qlik-tools-0.0.1.vsix
call code ..\..\app.infovizion\demo2_conf\conf