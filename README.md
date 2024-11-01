# Introduction
Wizard Generator is a Node.JS program that takes in a directory with file contents and makes a Windows93 setup wizard file for it.
It supports minifying and zlib compression.

# How to use
The program is ran from the command `node make [projectFolder] [options]`.

Here are the options allowed by the program:
`-o`: Output file.
`-u`: Stops the program from compressing data.
`-b`: Stops the program from minifying the installer.

# Making a project folder
A project folder always needs to have a file called "wizgen-config".
This file defines all files to copy depending on the version of Windows93 used. Currently supported versions are `v2` and `v3`, and putting other versions will be ignored by the installer.

Example syntax:
```
> v2
boot/bootScript.js -> /a/boot/myProgramBoot.js
src/* -> /a/myProgramSrc/*
defaultSettings.txt -> /a/myProgramSettings.txt

> v3
src/* -> /c/myProgram/src/*
defaultSettings.txt -> /c/myProgram/defaultSettings.txt

---

{
  "name": "My Program",
  "description": "Welcome to the My Program installer!",
  "installTxt": "Installing My Program..."
}
```

The JSON and file content should always be seperated by three horizontal lines.
Asterisks are converted to `**` and handled by glob.
