#!/usr/bin/env node

"use strict";

var program = require("commander"),
    which = require("which").sync,
    cp = require("child_process"),
    clc = require("cli-color"),
    fs = require("fs"),
    pkg = require("../package.json");

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
    .version(pkg.version)
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
            
            // Replace {{hoodie_appname}} in package.jsona nd www/index.html
            [
                "package.json",
                "./www/index.html"
            ].forEach(function(file) {
                fs.writeFileSync(file,
                    fs.readFileSync(file).toString().replace(/\{\{hoodie_appname\}\}/gi, appname)
                );
            });
            
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
    .command("install <name>")
    .description("Install a hoodie module")
    .action(function(name) {
        
        var url = "git://github.com/hoodiehq/worker-" + name + ".git";
        
        exec(which("npm"), ["install", url, "--save"], function(err) {
            
            if(err) {
                console.log("Error installing module:");
                throw err;
                process.exit(1);
            }
            
            console.log("Successfully installed %s", name);
            
        });
        
    });

program
    .command("uninstall <name>")
    .description("Uninstall a hoodie module")
    .action(function(name) {
       
        exec(which("npm"), ["remove", name, "--save"], function(err) {
            
            if(err) {
                console.log("Error uninstalling module:");
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
            "",
            "\tCommand not found",
            "",
            "\tSee 'hoodie --help' for more information."
        ].join("\n"));
    });

program.parse(process.argv);

if(program.args.length === 0) {
    
    console.log("\n");
    
    [
        [".d$b.  .d$b.", "  .d$$$$$$b.  ", "  .d$$$$$$b.  ", ".d$$$$$$b.  ",  ".d$b.", ".d$$$$$$$$b."],
        ["$$$$$..$$$$$", ".$$$$$$$$$$$b ", ".$$$$$$$$$$$b ", "$$$$$$$$$$b ",  "$$$$$", "$$$$$$$$$$P'"],
        ["$$$$$$$$$$$$", "d$$$$$$$$$$$$b", "d$$$$$$$$$$$$b", "$$$$$$$$$$$b",  "$$$$$", "$$$$$$$$$$b."],
        ["$$$$$$$$$$$$", "Q$$$$$$$$$$$$P", "Q$$$$$$$$$$$$P", "$$$$$$$$$$$P",  "$$$$$", "$$$$$$$$$$P'"],
        ["$$$$$´`$$$$$", "'$$$$$$$$$$$$'", "'$$$$$$$$$$$$'", "$$$$$$$$$$P ",  "$$$$$", "$$$$$$$$$$b."],
        ["'Q$P'  'Q$P'", "  'Q$$$$$$P'  ", "  'Q$$$$$$P'  ", "'Q$$$$$$$P  ",  "'Q$P'", "'Q$$$$$$$$P'"]
    ].forEach(function(line) {
        var blue = clc.xterm(25);
        var green = clc.xterm(28);
        var yellow = clc.xterm(214);
        var orange = clc.xterm(202);
        var brown = clc.xterm(240);
        var red = clc.xterm(160);
        console.log(blue(line[0]) +
            green(line[1]) +
            yellow(line[2]) +
            orange(line[3]) +
            brown(line[4]) +
            red(line[5]));
    })

    console.log("\n\t See 'hoodie --help' for more information.");
}