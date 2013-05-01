@ECHO off
setlocal enabledelayedexpansion

IF "%1" == "new" (

    SET APPNAME=%2
    SET TEMPLATE=%3
    
    IF [%!APPNAME!] == [] (
        
        ECHO.Error: ^<appname^> is empty
        CALL:usage
        
        GOTO:end
    )
    
    IF [!TEMPLATE!] == [] (
        SET TEMPLATE=hoodiehq/my-first-hoodie
    )
    

    ECHO.Creating new hoodie app ^'!APPNAME!^' with template ^'!TEMPLATE!^'
    
    git clone git://github.com/!TEMPLATE!.git !APPNAME!
    
    cd %2
    
    SET CWD=%cd%\%2
    
    :: Replace the placeholder in package.json
    "%~dp0utils\replace.bat" {{hoodie_appname}} %2 !CWD!\package.json > !CWD!\package.json.tmp
    
    cd %2
    
    del package.json
    ren package.json.tmp package.json
    
    npm install .
    
    cd ..
    
    GOTO:end
)

IF "%1" == "start" (
    npm start
    
    GOTO:end
)

IF "%1" == "module" (
    
    SET ACTION=%2
    
    IF [!ACTION!] == [] (
        
        ECHO.
        ECHO.What should I do?
        GOTO:usage
        
    )
    
    IF "!ACTION!" == "install" (
    
        SET NAME=%3
        
        IF [!NAME!] == [] (
            
            ECHO.
            ECHO.What module should I install?
            GOTO:usage
            
        )
        
        npm install --save git://github.com/hoodiehq/worker-!NAME!.git
        ECHO.Module !NAME! installed successfully.
        
        GOTO:end
        
    )
    
    IF "!ACTION!" == "uninstall" (
    
        SET NAME=%3
        
        IF [!NAME!] == [] (
            
            ECHO.
            ECHO.What module should I uninstall?
            GOTO:usage
            
        )
        
        npm uninstall --save git://github.com/hoodiehq/worker-!NAME!.git
        ECHO.Module !NAME! uninstalled successfully.
        
        GOTO:end
        
    )
    
)

:: Function scope begins
:usage

ECHO. 
ECHO.Usage: $0 ^<command^> ^<parameters^>
ECHO. 
ECHO.   new ^<appname^> [^<template^>]
ECHO.   start
ECHO.   module install ^<name^>
ECHO.   module uninstall ^<name^>
ECHO.
ECHO.^<template^> is a GitHub user/repo combo.
ECHO.The default template is ^'hoodiehq/my-first-hoodie^'.

GOTO:EOF
:: Function scope ends

:end