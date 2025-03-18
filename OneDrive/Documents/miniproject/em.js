// i need to personally edit...
/* enter not working... */

function executeCommand(command) {
    console.log(`Command received: "${command}"`); // Check what the raw input is
    const args = command.trim().split(/\s+/);
    console.log(`Arguments after split:`, args); // Check how it's being split
    const cmd = args.shift();  // returns args[0] = the command
    let output = "";

    switch (cmd) {
        case "help":
            output = "Available commands: help, clear, echo, ls, pwd, cd, mkdir, rmdir, touch, rm, mv, cp, find";
            break;
        case "clear":
            outputContainer.innerHTML = "";
            return;
        case "echo":
            output = args.join(" "); // Just join args
            break;
        case "pwd":
            output = '/' + currentPath.join('/');
            break;
        case "ls":
            let dir = resolvePath(currentPath);
            output = Object.keys(dir).join(" ") || "(empty)";
            break;
        case "cd":
            if (args.length === 0) {
                currentPath = ['/'];
            } else {
                let newPath = parsePath(args[0]);
                if (resolvePath(newPath)) {
                    currentPath = newPath;
                } else {
                    output = `cd: no such directory: ${args[0]}`;
                }
            }
            break;
        case "mkdir":
            let newDirPath = parsePath(args[0]);
            let parent = resolvePath(newDirPath.slice(0, -1));
            if (parent) {
                parent[newDirPath.slice(-1)] = {};
                output = "Directory created.";
            } else {
                output = "mkdir: cannot create directory";
            }
            break;
        case "rmdir":
            let dirPath = parsePath(args[0]);
            let parentDir = resolvePath(dirPath.slice(0, -1));
            if (parentDir && parentDir[dirPath.slice(-1)] && typeof parentDir[dirPath.slice(-1)] === 'object') {
                delete parentDir[dirPath.slice(-1)];
                output = "Directory removed.";
            } else {
                output = "rmdir: failed to remove";
            }
            break;
        case "touch":
            let filePath = parsePath(args[0]);
            let fileParent = resolvePath(filePath.slice(0, -1));
            if (fileParent) {
                fileParent[filePath.slice(-1)] = "";
                output = "File created.";
            } else {
                output = "touch: cannot create file";
            }
            break;
        case "rm":
            let delPath = parsePath(args[0]);
            let delParent = resolvePath(delPath.slice(0, -1));
            if (delParent && delParent[delPath.slice(-1)]) {
                delete delParent[delPath.slice(-1)];
                output = "File removed.";
            } else {
                output = "rm: cannot remove";
            }
            break;
        default:
            output = `Command not found: ${cmd}`;
    }

    if (output) {
        const outputElement = document.createElement("div");
        outputElement.classList.add("output-line");
        outputElement.textContent = output;
        outputContainer.appendChild(outputElement);
    }
}