call npx js-yaml syntaxes\qlik.tmLanguage.yaml > syntaxes\qlik.tmLanguage.json
call npx js-yaml syntaxes\expression.tmLanguage.yaml > syntaxes\expression.tmLanguage.json
del infovizion-tools-*.vsix
call vsce package

FOR %%F IN (*.vsix) DO (
 set filename=%%F
 goto fileFound
)
:fileFound
call code --install-extension %filename%
REM call code ..\..\app.infovizion\demo2_conf\conf