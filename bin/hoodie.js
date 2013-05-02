"use strict";

var program = require("commander"),
    which = require("which").sync,
    cp = require("child_process"),
    fs = require("fs");

function exec(command, args, callback) {
    
    var c = cp.spawn(command, args, {
        cwd: process.cwd(),
        env: process.env,
        stdio: "inherit"
    });
    
    c.on("exit", function() {
        callback();
    });
    c.on("error", callback);

}


program
    .version("0.0.1")
    .usage("<command> <parameters>");

program
    .command("new <appname> [<template>]")
    .description("Creates a new hoodie app")
    .action(function(appname, template) {
        
        template = template || "hoodiehq/my-first-hoodie";
        
        console.log("Creating new hoodie app '%s' with template '%s'", appname, template);
        
        var giturl = "git://github.com/" + template + ".git";
        
        exec("git", ["clone", giturl, appname], function(err) {
            
            if(err) {
                console.log("Error cloning the git repository:");
                throw err;
                process.exit(1);
            }
            
            process.chdir(appname);
            
            fs.writeFileSync("package.json",
                fs.readFileSync("package.json", { encoding: "utf8" }).replace(/\{\{hoodie_appname\}\}/gi, appname),
                { encoding: "utf8" }
            );
            
            console.log("Replaced package.json");
            
            exec(which("npm"), ["install"], function(err) {
                
                if(err) {
                    console.log("Error installing dependencies:");
                    throw err;
                    process.exit(1);
                }
                
                console.log([
                    "Installed all dependencies",
                    "Now start our new hoodie app:",
                    "",
                    "\tcd " + appname,
                    "\thoodie start"
                ].join("\n"));
                
            });
            
        });
        
    });

program
    .command("start")
    .description("Start your hoodie app")
    .action(function() {
        exec(which("npm"), ["start"], function(err) {
            
            if(err) {
                console.log("Error starting:");
                throw err;
                process.exit(1);
            }
            
        });
    });

program
    .command("module <action> <name>")
    .description("Un-/Intall a hoodie module")
    .action(function(action, name) {
        
        var cmd;
        if(action === "install") {
            cmd = "install";
            name = "git://github.com/hoodiehq/worker-" + name + ".git";
        } else if(action === "uninstall") cmd = "remove";
        else {
            console.log("Use install or uninstall as <action>");
            process.exit(1);
        }
        
        exec(which("npm"), [cmd, name, "--save"], function(err) {
            
            if(err) {
                console.log("Error installing dependencies:");
                throw err;
                process.exit(1);
            }
            
            console.log("Successfully uninstalled %s", name);
            
        });
        
    });

program
    .command("*")
    .action(function() {
        console.log([
            "Command not found",
            "",
            "\tSee 'hoodie --help' for more information."
        ].join("\n"));
    });

program.parse(process.argv);

if(program.args.length === 0) {
    
    console.log([
        "      _    _    _______   _______   _____     __   ______",
        "     / /  / /  / ___  /  / ___  /  / __  |   / /  / ____/",
        "    / /__/ /  / /  / /  / /  / /  / /  | /  / /  / /_",
        "   / ___  /  / /  / /  / /  / /  / /  / /  / /  / __/",
        "  / /  / /  / /__/ /  / /__/ /  / /__/ /  / /  / /____",
        " /_/  /_/  /______/  /______/  /______/  /_/  /______/",
        
        "",
        "\t See 'hoodie --help' for more information."
    ].join("\n"));
}