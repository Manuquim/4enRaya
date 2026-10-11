Option Explicit
Dim shell, files, folder, result
Set shell = CreateObject("WScript.Shell")
Set files = CreateObject("Scripting.FileSystemObject")
folder = files.GetParentFolderName(WScript.ScriptFullName)
On Error Resume Next
result = shell.Run("node """ & folder & "\run""", 0, True)
If Err.Number <> 0 Then
  MsgBox "No se pudo iniciar. Comprueba que Node.js esta instalado o usa run.cmd.", 48, "4 en raya"
ElseIf result <> 0 Then
  MsgBox "No se pudo iniciar. Usa run.cmd para ver el error o consulta servidor.log.", 48, "4 en raya"
End If
