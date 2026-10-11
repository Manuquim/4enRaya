Option Explicit
Dim shell, files, folder, result, nodePath, entry, candidate, paths, item, checkOnly, extraArgs, skipBrowser, gamePort, gameUrl
Set shell = CreateObject("WScript.Shell")
Set files = CreateObject("Scripting.FileSystemObject")
folder = files.GetParentFolderName(WScript.ScriptFullName)
If files.FolderExists(files.BuildPath(folder, "app")) Then folder = files.BuildPath(folder, "app")
shell.CurrentDirectory = folder
entry = files.BuildPath(folder, "scripts\launch.mjs")
checkOnly = False
extraArgs = " --no-browser"
skipBrowser = False
If WScript.Arguments.Count > 0 Then checkOnly = (WScript.Arguments(0) = "--check")
If WScript.Arguments.Count > 0 Then
  If WScript.Arguments(0) = "--no-browser" Then skipBrowser = True
End If
If Not files.FileExists(entry) Or Not files.FileExists(files.BuildPath(folder, "dist\index.html")) Then
  WScript.Echo "Faltan archivos. Extrae el ZIP completo antes de ejecutar el lanzador."
  WScript.Quit 1
End If
nodePath = ""
paths = Split(shell.ExpandEnvironmentStrings("%PATH%"), ";")
For Each item In paths
  item = Replace(Trim(item), Chr(34), "")
  If Len(item) > 0 Then
    candidate = files.BuildPath(item, "node.exe")
    If files.FileExists(candidate) Then
      nodePath = candidate
      Exit For
    End If
  End If
Next
If nodePath = "" Then
  candidate = shell.ExpandEnvironmentStrings("%ProgramFiles%\nodejs\node.exe")
  If files.FileExists(candidate) Then nodePath = candidate
End If
If nodePath = "" Then
  candidate = shell.ExpandEnvironmentStrings("%LOCALAPPDATA%\Programs\nodejs\node.exe")
  If files.FileExists(candidate) Then nodePath = candidate
End If
If nodePath = "" Then
  WScript.Echo "No se encontro Node.js. Instala Node.js 18 o posterior y vuelve a abrir el lanzador."
  WScript.Quit 1
End If
If checkOnly Then
  WScript.Echo "Lanzador correcto. Node: " & nodePath
  WScript.Quit 0
End If
On Error Resume Next
result = shell.Run(Chr(34) & nodePath & Chr(34) & " " & Chr(34) & entry & Chr(34) & extraArgs, 0, True)
If Err.Number <> 0 Then
  MsgBox "No se pudo iniciar: " & Err.Description & ". Usa " & files.BuildPath(folder, "run.cmd") & " para ver el error.", 48, "4 en raya"
  WScript.Quit 1
ElseIf result <> 0 Then
  MsgBox "No se pudo iniciar. Usa " & files.BuildPath(folder, "run.cmd") & " para ver el error o consulta servidor.log en esa carpeta.", 48, "4 en raya"
  WScript.Quit result
End If
gamePort = shell.Environment("PROCESS")("RAYA_PORT")
If gamePort = "" Then gamePort = "8080"
gameUrl = "http://127.0.0.1:" & gamePort & "/"
If skipBrowser Then
  WScript.Echo "Servidor iniciado: " & gameUrl
  WScript.Quit 0
End If
Err.Clear
shell.Run gameUrl, 1, False
If Err.Number <> 0 Then
  MsgBox "El servidor esta iniciado, pero Windows no pudo abrir el navegador: " & Err.Description & vbCrLf & "Abre manualmente " & gameUrl, 48, "4 en raya"
Else
  MsgBox "Juego iniciado en segundo plano." & vbCrLf & "Si el navegador no aparece, abre " & gameUrl & vbCrLf & "Para terminar, usa Apagar juego o " & files.BuildPath(folder, "detener.cmd") & ".", 64, "4 en raya"
End If
