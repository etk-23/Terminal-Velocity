// need to change lterm...

document.addEventListener('DOMContentLoaded', function () {
    const terminal = document.getElementById('output');
    const commandInput = document.getElementById('command-input');
    const prompt = document.getElementById('prompt');

    // Command history
    let history = [];
    let historyIndex = -1;

    // Task tracking
    let arr = Array(17).fill(0); // Keeps track of different commands (i.e., if they are completed or not)
    let arr2 = ['echo', 'pwd', 'ls', 'cd', 'cd ..', 'cd ~', 'cat', 'touch', 'cp', 'rm', 'mkdir', 'clear', 'uname', 'date', 'ifconfig', 'tty', 'history'];
    let task = ['<span class="not-completed">Not Completed</span>', '<span class="completed">Completed</span>']; // To print the task status

    // File system variables
    let pwdv = ["lterm"];  // To print pwd
    let s = [];  // Array for directories
    let f = [];  // Array for files
    let count = 6;  // Required to continue making subdirectories
    let o = { "lterm": "0", "Documents": "1", "Downloads": "2", "Music": "3", "Pictures": "4", "Videos": "5" };  // Object to assign array of subfolders to a folder
    let of = { "hello.txt": "Hey there newbie!\nHaving fun? I hope so." };  // Object to assign text to a file
    
    // Initialize file system
    f[0] = ["hello.txt"];
    s[0] = ["Documents", "Downloads", "Music", "Pictures", "Videos"];
    s[1] = []; f[1] = [];
    s[2] = []; f[2] = [];
    s[3] = []; f[3] = [];
    s[4] = []; f[4] = [];
    s[5] = []; f[5] = [];

    // Focus input field when terminal is clicked
    terminal.addEventListener('click', function() {
        commandInput.focus();
    });

    // Handle command input
    commandInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim();
            
            if (command) {
                // Add command to history
                history.push(command);
                historyIndex = history.length;
                
                // Display command
                echoOutput(`<span id="prompt">${prompt.textContent}</span> ${command}`);
                
                // Process command
                processCommand(command);
                
                // Clear input
                commandInput.value = '';
            }
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            // Navigate command history (up)
            if (historyIndex > 0) {
                historyIndex--;
                commandInput.value = history[historyIndex];
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            // Navigate command history (down)
            if (historyIndex < history.length - 1) {
                historyIndex++;
                commandInput.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                commandInput.value = '';
            }
            e.preventDefault();
        }
    });

    // Display initial message
    echoOutput("Welcome to the Linux Terminal Emulator!");
    echoOutput("Type 'help' to see available commands.");
    echoOutput("Start with 'echo hello' to begin learning command line basics.");
    echoOutput("");

    // Process command
    function processCommand(commandStr) {
        const args = commandStr.split(' ');
        const command = args[0];
        const restArgs = args.slice(1);

        switch (command) {
            case 'help':
                help();
                break;
            case 'echo':
                echo(restArgs.join(' '));
                break;
            case 'pwd':
                pwd();
                break;
            case 'ls':
                ls();
                break;
            case 'cd':
                cd(restArgs[0] || '');
                break;
            case 'cat':
                cat(restArgs[0]);
                break;
            case 'touch':
                touch(restArgs[0]);
                break;
            case 'cp':
                cp(restArgs[0], restArgs[1]);
                break;
            case 'rm':
                rm(restArgs[0]);
                break;
            case 'mkdir':
                mkdir(restArgs[0]);
                break;
            case 'clear':
                clear();
                break;
            case 'uname':
                uname();
                break;
            case 'date':
                date();
                break;
            case 'ifconfig':
                ifconfig();
                break;
            case 'tty':
                tty();
                break;
            case 'history':
                showHistory();
                break;
            case 'about':
                about();
                break;
            case 'contribute':
                contribute();
                break;
            default:
                echoOutput(`Command not found: ${command}`);
        }
    }

    // Output function
    function echoOutput(output) {
        const outputElement = document.createElement('div');
        outputElement.innerHTML = output;
        terminal.appendChild(outputElement);
        
        // Auto-scroll to bottom
        terminal.scrollTop = terminal.scrollHeight;
    }

    // Update prompt
    function updatePrompt() {
        const pwdvNew = pwdv.join('/');
        prompt.textContent = `lterm@localhost/${pwdvNew}:~$`;
    }

    // Command functions
    function help() {
        let output = "List of commands available:<br>===========================<br>";
        output += "> <b>about</b><br>";
        output += "> <b>contribute</b><br>";
        
        arr2.forEach((cmd, index) => {
            output += `> ${cmd} ----------- ${task[arr[index]]}<br>`;
        });
        
        echoOutput(output);
    }

    function echo(arg1) {
        arr[0] = 1;
        echoOutput(arg1);
        echoOutput('> The <span class="not-completed">echo</span> command prints back your arguments.');
        echoOutput('> Type <span class="not-completed">help</span> and check your first task is completed.');
        echoOutput('> Now type <span class="not-completed">pwd</span> to continue.');
    }

    function pwd() {
        arr[1] = 1;
        const pwdvNew = pwdv.join('/');
        echoOutput(`/home/${pwdvNew}`);
        echoOutput('> The <span class="not-completed">pwd</span> command shows you the current directory.');
        echoOutput('> Now type <span class="not-completed">ls</span> to see the directories and files present in the current directory');
    }

    function ls() {
        arr[2] = 1;
        const x = o[pwdv[pwdv.length - 1]];
        
        let foldersOutput = '';
        if (s[x].length > 0) {
            foldersOutput = s[x].map(folder => `<span class="folder">${folder}</span>`).join('  ');
        }
        
        let filesOutput = '';
        if (f[x].length > 0) {
            filesOutput = f[x].map(file => `<span class="file">${file}</span>`).join('  ');
        }
        
        if (foldersOutput || filesOutput) {
            echoOutput(`${foldersOutput}  ${filesOutput}`);
        } else {
            echoOutput('(empty directory)');
        }
        
        echoOutput('> The <span class="not-completed">ls</span> command will list directories and files in the current directory.');
        echoOutput('> Now type <span class="not-completed">cd Documents</span> to enter a sub directory.');
    }

    function cd(arg1) {
        if (!arg1) {
            echoOutput('Usage: cd <directory>');
            return;
        }
        
        const x = o[pwdv[pwdv.length - 1]];
        let e = 0;
        
        if (s[x].includes(arg1)) {
            e = 1;
        } else if (arg1 === "..") {
            e = 2;
        } else if (arg1 === "~") {
            e = 3;
        }

        if (e === 1) {
            arr[3] = 1;
            pwdv.push(arg1);
            echoOutput("> <span class='not-completed'>cd</span> stands for Change Directory. You just changed your directory.");
            echoOutput("> You can check your present directory by typing <span class='not-completed'>pwd</span>.");
            echoOutput("> To return back to the <span class='completed'>previous directory</span> you should type <span class='not-completed'>cd ..</span>.");
            updatePrompt();
        } else if (e === 2) {
            if (pwdv.length > 1) {
                arr[4] = 1;
                pwdv.pop();
                updatePrompt();
                echoOutput("> You have returned to the <span class='completed'>parent directory</span>");
            } else {
                echoOutput("<span class='not-completed'>Error:</span> This is the root directory!!");
            }
        } else if (e === 3) {
            arr[5] = 1;
            pwdv = ["lterm"];
            updatePrompt();
            echoOutput("> You have returned to the <span class='completed'>home directory</span>");
        } else {
            echoOutput("<span class='not-completed'>Error:</span> Directory doesn't exist!!");
        }
    }

    function cat(arg1) {
        if (!arg1) {
            echoOutput('Usage: cat <filename>');
            return;
        }
        
        const y = of[arg1];
        if (y === undefined) {
            echoOutput(`${arg1} doesn't exist.`);
        } else {
            arr[6] = 1;
            echoOutput(y.replace(/\n/g, '<br>'));
        }
        echoOutput("> The <span class='not-completed'>cat</span> command views the text inside a file on the terminal.");
    }

    function touch(arg1) {
        if (!arg1) {
            echoOutput('Usage: touch <filename>');
            return;
        }
        
        arr[7] = 1;
        echoOutput('> <span class="not-completed">touch</span> allows you to create new empty files. Type <span class="not-completed">ls</span> to see the new file created.');
        const x = o[pwdv[pwdv.length - 1]];
        f[x].push(arg1);
        of[arg1] = "";
    }

    function cp(arg1, arg2) {
        if (!arg1 || !arg2) {
            echoOutput('Usage: cp <source> <destination>');
            return;
        }
        
        arr[8] = 1;
        echoOutput('> The <span class="not-completed">cp</span> command copies your file to the given location.');
        const x = o[pwdv[pwdv.length - 1]];
        if (s[x].includes(arg1)) {
            o[arg2] = count;
            s[x].push(arg2);
            s[count] = s[o[arg1]];
            count++;
        } else if (f[x].includes(arg1)) {
            f[x].push(arg2);
            of[arg2] = of[arg1];
        } else {
            echoOutput(`> "<span class="not-completed">${arg1}</span>" directory or file doesn't exist.`);
        }
    }

    function rm(arg1) {
        if (!arg1) {
            echoOutput('Usage: rm <filename>');
            return;
        }
        
        arr[9] = 1;
        echoOutput('> The <span class="not-completed">rm</span> command is used to remove files or directories.');
        const x = o[pwdv[pwdv.length - 1]];
        if (s[x].includes(arg1)) {
            const index = s[x].indexOf(arg1);
            s[x].splice(index, 1);
        } else if (f[x].includes(arg1)) {
            const index = f[x].indexOf(arg1);
            f[x].splice(index, 1);
        } else {
            echoOutput(`> "<span class="not-completed">${arg1}</span>" directory or file doesn't exist.`);
        }
    }

    function mkdir(arg1) {
        if (!arg1) {
            echoOutput('Usage: mkdir <directory>');
            return;
        }
        
        arr[10] = 1;
        echoOutput('> The <span class="not-completed">mkdir</span> command (Make Directory) creates a directory.');
        const x = o[pwdv[pwdv.length - 1]];
        o[arg1] = count;
        s[x].push(arg1);
        s[count] = [];
        f[count] = [];
        count++;
    }

    function clear() {
        arr[11] = 1;
        terminal.innerHTML = '';
        echoOutput('> The clear command clears your terminal screen');
    }

    function uname() {
        arr[12] = 1;
        echoOutput('lterm');
    }

    function date() {
        arr[13] = 1;
        const d = new Date();
        const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentDay = days[d.getDay()];
        const currentMonth = months[d.getMonth()];
        const fullDate = `${currentDay}, ${currentMonth} ${d.getDate()} ${d.getFullYear()} ${time}`;
        echoOutput(fullDate);
    }

    function ifconfig() {
        arr[14] = 1;
        echoOutput("eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500");
        echoOutput("        inet 192.168.1.10  netmask 255.255.255.0  broadcast 192.168.1.255");
        echoOutput("        inet6 fe80::215:5dff:fe36:46  prefixlen 64  scopeid 0x20<link>");
        echoOutput("        ether 00:15:5d:36:00:46  txqueuelen 1000  (Ethernet)");
        echoOutput("        RX packets 744  bytes 428453 (428.4 KB)");
        echoOutput("        RX errors 0  dropped 0  overruns 0  frame 0");
        echoOutput("        TX packets 920  bytes 318058 (318.0 KB)");
        echoOutput("        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0");
    }

    function tty() {
        arr[15] = 1;
        echoOutput("/dev/pts/0");
    }

    function showHistory() {
        arr[16] = 1;
        let output = '';
        history.forEach((cmd, index) => {
            output += `${index + 1}  ${cmd}<br>`;
        });
        echoOutput(output);
    }

    function about() {
        echoOutput("<p>Linux Terminal Emulator is a web-based application that simulates a Linux terminal environment.</p>");
        echoOutput("<p>It provides a hands-on experience for learning basic Linux commands.</p>");
    }

    function contribute() {
        echoOutput("<p>This is an open-source project. Contributions are welcome!</p>");
    }
});
