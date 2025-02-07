/*const terminal = document.getElementById("terminal");
const inputField = document.getElementById("input");
const outputArea = document.getElementById("output");

const commands = {
    "help": "Available commands: help, clear, echo, ls, pwd",
    "clear": "clear",
    "echo": (args) => args.join(" "),
    "ls": "Documents  Downloads  Pictures  Music  Videos",
    "pwd": "/home/user"
};

function handleCommand(event) {
    if (event.key === "Enter") {
        const inputText = inputField.value.trim();
        outputArea.innerHTML += `<div><span class='prompt'>$ </span>${inputText}</div>`;
        
        if (inputText === "clear") {
            outputArea.innerHTML = "";
        } else if (commands[inputText]) {
            outputArea.innerHTML += `<div>${commands[inputText]}</div>`;
        } else if (inputText.startsWith("echo ")) {
            outputArea.innerHTML += `<div>${commands["echo"](inputText.split(" ").slice(1))}</div>`;
        } else {
            outputArea.innerHTML += `<div>Command not found: ${inputText}</div>`;
        }

        inputField.value = "";
        terminal.scrollTop = terminal.scrollHeight;
    }
}

inputField.addEventListener("keydown", handleCommand);
inputField.focus();
-------------------------------------------------------------------------------------------------------------------------------
// HTML structure
const terminal = document.getElementById("terminal");
const inputField = document.getElementById("input");
const outputArea = document.getElementById("output");
const tutorialArea = document.getElementById("tutorial");

const commands = {
    "help": "Available commands: help, clear, echo, ls, pwd, cd, mkdir, rmdir, cp, mv, rm, touch, find, ps, top, df, du, uptime, ping, netstat, ss, curl, wget, useradd, usermod, passwd, groups, chmod, chown, chgrp, umask, systemctl, service, journalctl, init, cat, grep, sed, awk, cut",
    "clear": "clear",
    "ls": "Documents  Downloads  Pictures  Music  Videos",
    "pwd": "/home/user",
    "cd": "Change directory command used. Try 'cd [directory]'",
    "mkdir": "Creates a directory. Syntax: mkdir [directory_name]",
    "rmdir": "Removes an empty directory. Syntax: rmdir [directory_name]",
    "cp": "Copies files. Syntax: cp [source] [destination]",
    "mv": "Moves or renames files. Syntax: mv [source] [destination]",
    "rm": "Removes files. Syntax: rm [file_name]",
    "touch": "Creates an empty file. Syntax: touch [file_name]",
    "find": "Searches for files. Syntax: find [directory] -name [filename]",
    "ps": "Lists running processes",
    "top": "Displays real-time process monitoring",
    "df": "Displays disk space usage",
    "du": "Shows directory sizes",
    "uptime": "Shows system uptime",
    "ping": "Checks network connectivity. Syntax: ping [host]",
    "netstat": "Displays network connections",
    "ss": "Shows detailed socket statistics",
    "curl": "Transfers data from a URL",
    "wget": "Downloads files from the internet",
    "useradd": "Adds a new user",
    "usermod": "Modifies a user account",
    "passwd": "Changes a user's password",
    "groups": "Displays user groups",
    "chmod": "Changes file permissions. Syntax: chmod [mode] [file]",
    "chown": "Changes file owner. Syntax: chown [user] [file]",
    "chgrp": "Changes file group. Syntax: chgrp [group] [file]",
    "umask": "Shows or sets file permission mask",
    "systemctl": "Controls system services",
    "service": "Manages services",
    "journalctl": "Views system logs",
    "init": "Initializes system processes",
    "cat": "Displays file contents. Syntax: cat [file]",
    "grep": "Searches file contents. Syntax: grep [pattern] [file]",
    "sed": "Edits file contents. Syntax: sed [expression] [file]",
    "awk": "Processes and extracts text",
    "cut": "Cuts sections from input lines"
};

function updatePrompt() {
    document.getElementById("prompt").textContent = "$ ";
}

function handleCommand(event) {
    if (event.key === "Enter") {
        const inputText = inputField.value.trim();
        outputArea.innerHTML += `<div><span class='prompt'>$ </span>${inputText}</div>`;
        
        if (inputText === "clear") {
            outputArea.innerHTML = "";
        } else if (commands[inputText]) {
            outputArea.innerHTML += `<div>${commands[inputText]}</div>`;
        } else {
            outputArea.innerHTML += `<div>Command not found: ${inputText}</div>`;
        }
        
        inputField.value = "";
        terminal.scrollTop = terminal.scrollHeight;
    }
}

function loadTutorial(command) {
    const tutorialContent = {
        "ls": "The 'ls' command lists files and directories. Syntax: ls [-options] [directory]",
        "pwd": "The 'pwd' command prints the current working directory.",
        "mkdir": "Creates a new directory. Syntax: mkdir [directory_name]",
        "rm": "Removes files or directories. Syntax: rm [-options] [file/directory]",
    };
    tutorialArea.innerHTML = tutorialContent[command] || "No tutorial available for this command.";
}

inputField.addEventListener("keydown", handleCommand);
inputField.addEventListener("input", updatePrompt);
inputField.focus();

-------------------------------------------------------------------------------------------------------------------------------
*/
class VirtualFileSystem {
    constructor() {
        this.root = { name: '/', type: 'dir', children: {} };
        this.currentDir = this.root;
        this.path = ['/'];
    }

    resolvePath(path) {
        if (path === '/') return this.root;
        let parts = path.split('/').filter(Boolean);
        let node = this.root;
        for (let part of parts) {
            if (node.children[part] && node.children[part].type === 'dir') {
                node = node.children[part];
            } else {
                return null;
            }
        }
        return node;
    }

    mkdir(name) {
        if (!this.currentDir.children[name]) {
            this.currentDir.children[name] = { name, type: 'dir', children: {} };
            return `Directory '${name}' created.`;
        }
        return `mkdir: cannot create directory '${name}': File exists`;
    }

    ls() {
        return Object.keys(this.currentDir.children).join(' ') || '(empty)';
    }

    cd(name) {
        if (name === '..') {
            if (this.path.length > 1) {
                this.path.pop();
                this.currentDir = this.resolvePath(this.path.join('/'));
            }
        } else if (this.currentDir.children[name] && this.currentDir.children[name].type === 'dir') {
            this.path.push(name);
            this.currentDir = this.currentDir.children[name];
        } else {
            return `cd: no such file or directory: ${name}`;
        }
        return '';
    }

    pwd() {
        return this.path.join('/');
    }
}

const vfs = new VirtualFileSystem();
const terminal = document.getElementById("terminal");
const inputField = document.getElementById("input");
const outputArea = document.getElementById("output");

function handleCommand(event) {
    if (event.key === "Enter") {
        const inputText = inputField.value.trim();
        const args = inputText.split(' ');
        const command = args.shift();
        let output = '';

        switch (command) {
            case 'help':
                output = "Available commands: help, clear, ls, pwd, mkdir, cd";
                break;
            case 'clear':
                outputArea.innerHTML = "";
                inputField.value = "";
                return;
            case 'ls':
                output = vfs.ls();
                break;
            case 'pwd':
                output = vfs.pwd();
                break;
            case 'mkdir':
                output = args[0] ? vfs.mkdir(args[0]) : "mkdir: missing operand";
                break;
            case 'cd':
                output = args[0] ? vfs.cd(args[0]) : "cd: missing operand";
                break;
            default:
                output = `Command not found: ${command}`;
        }

        outputArea.innerHTML += `<div><span class='prompt'>$ </span>${inputText}</div><div>${output}</div>`;
        inputField.value = "";
        terminal.scrollTop = terminal.scrollHeight;
    }
}

inputField.addEventListener("keydown", handleCommand);
inputField.focus();

