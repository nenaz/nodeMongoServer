Set WshShell = WScript.CreateObject("WScript.Shell")
Return = WshShell.Run("node start.js", 0, true)