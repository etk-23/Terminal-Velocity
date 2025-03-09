
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements for terminal interaction
    const terminal = document.getElementById('output');         // The output area of the terminal
    const commandInput = document.getElementById('command-input'); // The input field for commands
    const prompt = document.getElementById('prompt');           // The prompt element that shows the current directory

    // Command history variables
    let history = [];         // Array to store command history
    let historyIndex = -1;    // Current position when navigating through history (-1 = NOT navigating)

    // --------------------------- TASK TRACKING VARIABLES ---------------------------
    let arr = Array(25).fill(0); // Keeps track of command completion status (0 = not completed, 1 = completed)
    let arr2 = [
        'echo', 'pwd', 'ls', 'cd', 'cd ..', 'cd ~', 'cat', 'touch', 'cp', 'rm', 'mkdir', 
        'clear', 'uname', 'date', 'ifconfig', 'tty', 'history', 'tac', 'rmdir', 'mv',   
        'find', 'sed', 'awk', 'grep', 'ping'
    ]; // List of all commands to track
    let task = ['<span class="not-completed">Not Completed</span>', '<span class="completed">Completed</span>']; // HTML for displaying task status

    // --------------------------- FILE SYSTEM VARIABLES --------------------------- 
    let pwdv = ["TerminalVelocity"];  // Array representing current directory path, starting with home directory
    let s = [];  // 2D array for directories: s[0] contains directories in root, s[1] in Documents, etc.
    let f = [];  // 2D array for files: f[0] contains files in root, f[1] in Documents, etc.
    let count = 6;  // Counter for assigning new directory IDs when creating directories
    // Object mapping directory names to their array indices
    let o = { "TerminalVelocity": "0", "Documents": "1", "Downloads": "2", "Music": "3", "Pictures": "4", "Videos": "5" };
    // Object mapping filenames to their contents
    let of = { 
        "hello.txt": "Hey there newbie!\nHaving fun? I hope so.",
        "sample.txt": "This is a sample text file.\nIt contains multiple lines.\nUseful for testing commands like grep, sed, and awk.\nLinux is awesome!"
    };

    // --------------------------- INITIALIZE FILE SYSTEM STRUCTURE --------------------------- 
    f[0] = ["hello.txt", "sample.txt"];      // Files in root directory
    s[0] = ["Documents", "Downloads", "Music", "Pictures", "Videos"]; // Directories in root
    // Initialize empty subdirectories
    s[1] = []; f[1] = []; // Documents directory (empty)
    s[2] = []; f[2] = []; // Downloads directory (empty)
    s[3] = []; f[3] = []; // Music directory (empty)
    s[4] = []; f[4] = []; // Pictures directory (empty)
    s[5] = []; f[5] = []; // Videos directory (empty)

    // ----- EVENT LISTENER ----- : FOCUS input field when terminal is clicked
    // This improves user experience by allowing clicks anywhere in terminal to focus input
    terminal.addEventListener('click', function() {
        commandInput.focus();
    });

    // ----- EVENT LISTENER ----- : Handle keyboard input for COMMAND PROCESSING and HISTORY NAVIGATION
    commandInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            // Process command when ENTER KEY IS PRESSED
            const command = commandInput.value.trim(); // Remove whitespace from command

            if (command) {
                // Add command to history
                history.push(command);                // Add the command to history array
                historyIndex = history.length;       // Set index to point after the last command

                // Display command in terminal
                echoOutput(`<span id="prompt">${prompt.textContent}</span> ${command}`);

                // Process the command
                processCommand(command);

                // Clear input field after processing
                commandInput.value = '';
            }
            e.preventDefault(); // Prevent default behavior of Enter key in input field
        } else if (e.key === 'ArrowUp') {
            // Navigate command history upward (OLDER COMMANDS)
            if (historyIndex > 0) {
                historyIndex--; // Move to previous command in history
                commandInput.value = history[historyIndex]; // Display that command in input
            }
            e.preventDefault(); // Prevent cursor from moving to start of input
        } else if (e.key === 'ArrowDown') {
            // Navigate command history downward (NEWER COMMANDS)
            if (historyIndex < history.length - 1) {
                historyIndex++; // Move to next command in history
                commandInput.value = history[historyIndex]; // Display that command in input
            } else {
                // If at end of history, CLEAR input field
                historyIndex = history.length;
                commandInput.value = '';
            }
            e.preventDefault(); // Prevent cursor from moving to end of input
        }
    });

    // --------------------------- Display INITIAL WELCOME MESSAGES ---------------------------
    echoOutput("Welcome to the Linux Terminal Emulator!");
    echoOutput("Type 'help' to see available commands.");
    echoOutput("Start with 'echo hello' to begin learning command line basics.");
    echoOutput("");

    /**  --------------------------- PROCESS USER INPUT / COMMANDS ---------------------------
     * Process a command string and dispatch to the appropriate function
     * @param {string} commandStr - The full command entered by the user
     */
    function processCommand(commandStr) {
        const args = commandStr.split(' ');       // Split command into array of words [ command = <command name> + <args> ]
        const command = args[0];                  // First word == command name
        const restArgs = args.slice(1);           // Remaining words == arguments

        // Route command to the appropriate function based on first word
        switch (command) {
            case 'help':
                help();
                break;
            case 'echo':
                echo(restArgs.join(' ')); // Join arguments back with spaces
                break;
            case 'pwd':
                pwd();
                break;
            case 'ls':
                ls();
                break;
            case 'cd':
                cd(restArgs[0] || ''); // Pass first argument or empty string
                break;
            case 'cat':
                cat(restArgs[0]); // Pass first argument
                break;
            case 'touch':
                touch(restArgs[0]); // Pass first argument
                break;
            case 'cp':
                cp(restArgs[0], restArgs[1]); // Pass first two arguments
                break;
            case 'rm':
                rm(restArgs[0]); // Pass first argument
                break;
            case 'mkdir':
                mkdir(restArgs[0]); // Pass first argument
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
            case 'tac':
                tac(restArgs[0]);
                break;
            case 'rmdir':
                rmdir(restArgs[0]);
                break;
            case 'mv':
                mv(restArgs[0], restArgs[1]);
                break;
            case 'find':
                find(restArgs[0], restArgs[1], restArgs[2]);
                break;
            case 'sed':
                sed(restArgs[0], restArgs[1]);
                break;
            case 'awk':
                awk(restArgs.join(' '));
                break;
            case 'grep':
                grep(restArgs[0], restArgs[1]);
                break;
            case 'ping':
                ping(restArgs[0]);
                break;
            case 'about':
                about();
                break;
            case 'contribute':
                contribute();
                break;
            default:
                echoOutput(`Command not found: ${command}`); // Handle unknown commands
        }
    }

    /**   --------------------------- DISPLAY OUTPUT ON TERMINAL ---------------------------
     * Output text to the terminal
     * @param {string} output - The HTML content to display in the terminal
     */
    function echoOutput(output) {
        const outputElement = document.createElement('div'); // Create a new div element
        outputElement.innerHTML = output;                    // Set its HTML content
        terminal.appendChild(outputElement);                 // Add it to the terminal

        // AUTO-SCROLL to bottom to show latest output
        terminal.scrollTop = terminal.scrollHeight;
    }

    //  --------------------------- UPDATE THE TERMINAL PROMPT to reflect the CURRENT directory ---------------------------
    function updatePrompt() {
        const pwdvNew = pwdv.length > 1 ? `/${pwdv.slice(1).join('/')}` : ''; // Format subdirectories if present
        prompt.innerHTML = `TerminalVelocity:<span class="path">~${pwdvNew}</span>$`; // Update prompt with colored path
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** HELP *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Display list of available commands and their completion status  
     * This function shows help information and tracks which commands the user has tried
     */
    function help() {
        let output = "List of commands available:<br>===========================<br>";
        output += "> <b>about</b><br>";
        output += "> <b>contribute</b><br>";

        // For each command, show its completion status
        arr2.forEach((cmd, index) => {
            // Uses the arr array to determine if a command has been completed
            // task[0] shows "Not Completed", task[1] shows "Completed"
            output += `> ${cmd} ----------- ${task[arr[index]]}<br>`;
        });

        echoOutput(output);
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** ECHO *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Echo - displays the provided text
     * @param {string} arg1 - The text to display
     */
    function echo(arg1) {
        arr[0] = 1; // Mark 'echo' command as completed
        echoOutput(arg1); // Display the provided argument
        echoOutput('> The <span class="not-completed">echo</span> command prints back your arguments.');
        echoOutput('> Type <span class="not-completed">help</span> and check your first task is completed.');
        echoOutput('> Now type <span class="not-completed">pwd</span> to continue.');
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** PWD *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Print Working Directory - shows current directory path
     */
    function pwd() {
        arr[1] = 1; // Mark 'pwd' command as completed
        const pwdvNew = pwdv.join('/'); // Join path components with slashes
        echoOutput(`/home/${pwdvNew}`); // Display full path
        echoOutput('> The <span class="not-completed">pwd</span> command shows you the current directory.');
        echoOutput('> Now type <span class="not-completed">ls</span> to see the directories and files present in the current directory');
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** LS *****$*****$*****$*****$*****$*****$*****$*****$*****
     * List Directory Contents - displays files and folders in current directory
     */
    function ls() {
        arr[2] = 1; // Mark 'ls' command as completed
        // Get index of current directory from object mapping
        const x = o[pwdv[pwdv.length - 1]];

        // Format directory output with folder class styling
        let foldersOutput = '';
        if (s[x] && s[x].length > 0) {
            // Map each folder name to HTML with folder class, then join with spaces
            foldersOutput = s[x].map(folder => `<span class="folder">${folder}</span>`).join('  ');
        }

        // Format file output with file class styling
        let filesOutput = '';
        if (f[x] && f[x].length > 0) {
            // Map each file name to HTML with file class, then join with spaces
            filesOutput = f[x].map(file => `<span class="file">${file}</span>`).join('  ');
        }

        // Display folders and files, or empty message if none
        if (foldersOutput || filesOutput) {
            echoOutput(`${foldersOutput}  ${filesOutput}`);
        } else {
            echoOutput('(empty directory)');
        }

        echoOutput('> The <span class="not-completed">ls</span> command will list directories and files in the current directory.');
        echoOutput('> Now type <span class="not-completed">cd Documents</span> to enter a sub directory.');
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** CD *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Change Directory - navigates to a specified directory
     * @param {string} arg1 - The directory to navigate to
     */
    function cd(arg1) {
        if (!arg1) {
            echoOutput('Usage: cd <directory>'); // Show usage if no argument provided
            return;
        }

        const x = o[pwdv[pwdv.length - 1]]; // Get current directory index
        let e = 0; // Flag to determine which type of cd operation

        // Check which type of cd operation to perform
        if (s[x] && s[x].includes(arg1)) {
            e = 1; // Navigate to subdirectory
        } else if (arg1 === "..") {
            e = 2; // Navigate to parent directory
        } else if (arg1 === "~") {
            e = 3; // Navigate to home directory
        }

        // Perform the appropriate navigation
        if (e === 1) {
            // Navigate to subdirectory
            arr[3] = 1; // Mark 'cd' command as completed
            pwdv.push(arg1); // Add new directory to path
            echoOutput("> <span class='not-completed'>cd</span> stands for Change Directory. You just changed your directory.");
            echoOutput("> You can check your present directory by typing <span class='not-completed'>pwd</span>.");
            echoOutput("> To return back to the <span class='completed'>previous directory</span> you should type <span class='not-completed'>cd ..</span>.");
            updatePrompt(); // Update prompt to show new path
        } else if (e === 2) {
            // Navigate to parent directory
            if (pwdv.length > 1) {
                arr[4] = 1; // Mark 'cd ..' command as completed
                pwdv.pop(); // Remove last directory from path
                updatePrompt(); // Update prompt to show new path
                echoOutput("> You have returned to the <span class='completed'>parent directory</span>");
            } else {
                echoOutput("<span class='not-completed'>Error:</span> This is the root directory!!"); // Can't go up from root
            }
        } else if (e === 3) {
            // Navigate to home directory
            arr[5] = 1; // Mark 'cd ~' command as completed
            pwdv = ["TerminalVelocity"]; // Reset path to just home
            updatePrompt(); // Update prompt to show new path
            echoOutput("> You have returned to the <span class='completed'>home directory</span>");
        } else {
            // Directory doesn't exist
            echoOutput("<span class='not-completed'>Error:</span> Directory doesn't exist!!");
        }
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** CAT *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Concatenate - displays contents of a file
     * @param {string} arg1 - The filename to display
     */
    function cat(arg1) {
        if (!arg1) {
            echoOutput('Usage: cat <filename>'); // Show usage if no argument provided
            return;
        }

        const y = of[arg1]; // Get file content from file mapping
        if (y === undefined) {
            echoOutput(`${arg1} doesn't exist.`); // File not found
        } else {
            arr[6] = 1; // Mark 'cat' command as completed
            echoOutput(y.replace(/\n/g, '<br>')); // Display file content with newlines as HTML breaks
        }
        echoOutput("> The <span class='not-completed'>cat</span> command views the text inside a file on the terminal.");
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** TAC *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Tac - displays contents of a file in reverse line order (opposite of cat)
     * @param {string} arg1 - The filename to display
     */
    function tac(arg1) {
        if (!arg1) {
            echoOutput('Usage: tac <filename>'); // Show usage if no argument provided
            return;
        }

        const y = of[arg1]; // Get file content from file mapping
        if (y === undefined) {
            echoOutput(`${arg1} doesn't exist.`); // File not found
        } else {
            arr[17] = 1; // Mark 'tac' command as completed
            // Split by newlines, reverse the lines, then join with HTML breaks
            const reversedContent = y.split('\n').reverse().join('<br>');
            echoOutput(reversedContent); // Display reversed file content
        }
        echoOutput("> The <span class='not-completed'>tac</span> command displays file content in reverse line order (opposite of cat).");
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** TOUCH *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Touch - creates a new empty file
     * @param {string} arg1 - The filename to create
     */
    function touch(arg1) {
        if (!arg1) {
            echoOutput('Usage: touch <filename>'); // Show usage if no argument provided
            return;
        }

        arr[7] = 1; // Mark 'touch' command as completed
        echoOutput('> <span class="not-completed">touch</span> allows you to create new empty files. Type <span class="not-completed">ls</span> to see the new file created.');

        const x = o[pwdv[pwdv.length - 1]]; // Get current directory index
        if (f[x]) {
            f[x].push(arg1); // Add file to current directory's file list
            of[arg1] = ""; // Initialize file with empty content
        }
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** CP *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Copy - copies a file or directory
     * @param {string} arg1 - Source file/directory
     * @param {string} arg2 - Destination file/directory
     */
    function cp(arg1, arg2) {
        if (!arg1 || !arg2) {
            echoOutput('Usage: cp <source> <destination>'); // Show usage if arguments missing
            return;
        }

        arr[8] = 1; // Mark 'cp' command as completed
        echoOutput('> The <span class="not-completed">cp</span> command copies your file to the given location.');

        const x = o[pwdv[pwdv.length - 1]]; // Get current directory index

        if (s[x] && s[x].includes(arg1)) {
            // Copy directory
            o[arg2] = count; // Assign new index for copied directory

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** RMDIR *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Remove Directory - removes an empty directory
     * @param {string} arg1 - The directory name to remove
     */
    function rmdir(arg1) {
        if (!arg1) {
            echoOutput('Usage: rmdir <directory>'); // Show usage if no argument provided
            return;
        }

        const x = o[pwdv[pwdv.length - 1]]; // Get current directory index

        if (s[x] && s[x].includes(arg1)) {
            const dirIndex = o[arg1]; // Get index of directory to remove
            
            // Check if directory is empty (no subdirectories or files)
            if ((s[dirIndex] && s[dirIndex].length > 0) || (f[dirIndex] && f[dirIndex].length > 0)) {
                echoOutput(`rmdir: failed to remove '${arg1}': Directory not empty`);
                return;
            }
            
            // Remove directory
            arr[18] = 1; // Mark 'rmdir' command as completed
            const index = s[x].indexOf(arg1); // Find directory's index in array
            s[x].splice(index, 1); // Remove directory from array
            echoOutput(`> Directory '${arg1}' removed successfully.`);
        } else {
            // Directory doesn't exist
            echoOutput(`rmdir: failed to remove '${arg1}': No such file or directory`);
        }
        
        echoOutput("> The <span class='not-completed'>rmdir</span> command removes empty directories.");
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** MV *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Move - moves a file or directory to another location or renames it
     * @param {string} arg1 - Source file/directory
     * @param {string} arg2 - Destination file/directory
     */
    function mv(arg1, arg2) {
        if (!arg1 || !arg2) {
            echoOutput('Usage: mv <source> <destination>'); // Show usage if arguments missing
            return;
        }

        arr[19] = 1; // Mark 'mv' command as completed
        
        const x = o[pwdv[pwdv.length - 1]]; // Get current directory index

        if (s[x] && s[x].includes(arg1)) {
            // Move/rename directory
            const dirIndex = o[arg1]; // Get index of directory to move
            
            // Add destination directory
            o[arg2] = dirIndex; // Assign same index to new name
            s[x].push(arg2); // Add directory with new name to current directory
            
            // Remove source directory
            const index = s[x].indexOf(arg1); // Find directory's index in array
            s[x].splice(index, 1); // Remove old directory name from array
            
            // Remove old name from mapping
            delete o[arg1];
            
            echoOutput(`> Directory '${arg1}' renamed to '${arg2}'`);
        } else if (f[x] && f[x].includes(arg1)) {
            // Move/rename file
            // Add file with new name
            f[x].push(arg2); // Add file with new name to current directory
            of[arg2] = of[arg1]; // Copy file content to new name
            
            // Remove old file
            const index = f[x].indexOf(arg1); // Find file's index in array
            f[x].splice(index, 1); // Remove old file from array
            
            // Remove old content
            delete of[arg1];
            
            echoOutput(`> File '${arg1}' renamed to '${arg2}'`);
        } else {
            // Source doesn't exist
            echoOutput(`mv: cannot stat '${arg1}': No such file or directory`);
        }
        
        echoOutput("> The <span class='not-completed'>mv</span> command moves or renames files and directories.");
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** FIND *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Find - search for files in a directory hierarchy
     * @param {string} path - Directory to search in (optional)
     * @param {string} option - Search option (e.g., -name)
     * @param {string} pattern - Search pattern
     */
    function find(path, option, pattern) {
        arr[20] = 1; // Mark 'find' command as completed
        
        // Default path to current directory if not provided
        if (!path || (path !== '.' && option === undefined)) {
            echoOutput('Usage: find [path] -name "pattern"');
            echoOutput("> The <span class='not-completed'>find</span> command searches for files in directory hierarchy.");
            return;
        }
        
        // Handle case where path is omitted and first argument is option
        if (path === '-name') {
            pattern = option;
            option = path;
            path = '.';
        }
        
        // Validate option
        if (option !== '-name') {
            echoOutput('find: Only -name option is supported in this emulator');
            return;
        }
        
        // Remove quotes around pattern if present
        if (pattern) {
            pattern = pattern.replace(/^["'](.*)["']$/, '$1');
        } else {
            echoOutput('find: missing argument to `-name`');
            return;
        }
        
        const results = []; // Array to store found files/directories
        
        // Helper function to search in a directory
        function searchInDir(dirIndex, currentPath) {
            // Add matching files
            if (f[dirIndex]) {
                for (const file of f[dirIndex]) {
                    // Simple wildcard pattern matching
                    if (matchesPattern(file, pattern)) {
                        results.push(`${currentPath}/${file}`);
                    }
                }
            }
            
            // Add matching directories and recursively search in them
            if (s[dirIndex]) {
                for (const dir of s[dirIndex]) {
                    // Simple wildcard pattern matching
                    if (matchesPattern(dir, pattern)) {
                        results.push(`${currentPath}/${dir}`);
                    }
                    
                    // Recursively search in this subdirectory
                    const subDirIndex = o[dir];
                    if (subDirIndex !== undefined) {
                        searchInDir(subDirIndex, `${currentPath}/${dir}`);
                    }
                }
            }
        }
        
        // Simple wildcard pattern matching function
        function matchesPattern(str, pattern) {
            // Convert file pattern to regex
            const regexPattern = pattern
                .replace(/\./g, '\\.')   // Escape dots
                .replace(/\*/g, '.*')    // Convert * to .*
                .replace(/\?/g, '.');    // Convert ? to .
            
            return new RegExp(`^${regexPattern}$`).test(str);
        }
        
        // Start search from the appropriate directory
        let startDirIndex = 0; // Default to root
        let startPath = '.';
        
        if (path === '.') {
            // Search from current directory
            startDirIndex = o[pwdv[pwdv.length - 1]];
            startPath = '.';
        } else {
            // Not implementing complex path handling for this emulator
            echoOutput('find: Only searching in current directory (.) is supported');
            return;
        }
        
        searchInDir(startDirIndex, startPath);
        
        // Display results
        if (results.length > 0) {
            results.forEach(result => {
                // Clean up path for display (remove leading ./)
                const displayPath = result.replace(/^\.\//, '');
                echoOutput(displayPath);
            });
        } else {
            echoOutput(`No matches found for ${pattern}`);
        }
        
        echoOutput("> The <span class='not-completed'>find</span> command searches for files and directories that match a pattern.");
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** SED *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Sed - stream editor for filtering and transforming text
     * @param {string} pattern - Sed pattern (e.g., 's/old/new/g')
     * @param {string} filename - File to process
     */
    function sed(pattern, filename) {
        if (!pattern || !filename) {
            echoOutput('Usage: sed "s/pattern/replacement/g" <filename>');
            return;
        }
        
        arr[21] = 1; // Mark 'sed' command as completed
        
        // Get file content
        const content = of[filename];
        if (content === undefined) {
            echoOutput(`sed: ${filename}: No such file or directory`);
            return;
        }
        
        // Parse the sed pattern
        const match = pattern.match(/^s\/(.*?)\/(.*?)\/([gi]*)$/);
        if (!match) {
            echoOutput('sed: Invalid pattern. Only s/pattern/replacement/[gi] is supported');
            return;
        }
        
        const [, searchPattern, replacement, flags] = match;
        
        // Create regex with appropriate flags
        const regex = new RegExp(searchPattern, flags);
        
        // Apply transformation
        const lines = content.split('\n');
        const transformedLines = lines.map(line => line.replace(regex, replacement));
        
        // Display result
        echoOutput(transformedLines.join('<br>'));
        
        echoOutput("> The <span class='not-completed'>sed</span> command is a stream editor for filtering and transforming text.");
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** AWK *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Awk - pattern scanning and processing language
     * @param {string} args - Awk command and arguments
     */
    function awk(args) {
        arr[22] = 1; // Mark 'awk' command as completed
        
        // Parse awk command - simplified version
        const argsParts = args.match(/(['"])([^'"]*)\1\s+(.+)/);
        
        if (!argsParts) {
            echoOutput('Usage: awk \'pattern {action}\' <filename>');
            echoOutput("> Try: awk '{print $1}' sample.txt");
            return;
        }
        
        const [, , pattern, filename] = argsParts;
        
        // Get file content
        const content = of[filename];
        if (content === undefined) {
            echoOutput(`awk: ${filename}: No such file or directory`);
            return;
        }
        
        // Process the file content based on pattern
        // Simplified implementation that supports basic {print $N} patterns
        const lines = content.split('\n');
        let output = '';
        
        // Match pattern for basic field printing: {print $N}
        const printMatch = pattern.match(/^\{print\s+\$(\d+)\}$/);
        
        if (printMatch) {
            const fieldNum = parseInt(printMatch[1]);
            
            lines.forEach(line => {
                const fields = line.trim().split(/\s+/);
                if (fieldNum <= fields.length) {
                    output += fields[fieldNum - 1] + '<br>';
                }
            });
            
            echoOutput(output);
        } else {
            echoOutput('awk: Only simple field printing patterns like {print $N} are supported');
        }
        
        echoOutput("> The <span class='not-completed'>awk</span> command is a powerful text processing language.");
        echoOutput("> This implementation supports basic field printing (e.g., '{print $1}').");
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** GREP *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Grep - search for patterns in text
     * @param {string} pattern - Pattern to search for
     * @param {string} filename - File to search in
     */
    function grep(pattern, filename) {
        if (!pattern || !filename) {
            echoOutput('Usage: grep "pattern" <filename>');
            return;
        }
        
        arr[23] = 1; // Mark 'grep' command as completed
        
        // Get file content
        const content = of[filename];
        if (content === undefined) {
            echoOutput(`grep: ${filename}: No such file or directory`);
            return;
        }
        
        // Remove quotes around pattern if present
        pattern = pattern.replace(/^["'](.*)["']$/, '$1');
        
        // Search for pattern in each line
        const lines = content.split('\n');
        let matchFound = false;
        
        lines.forEach(line => {
            if (line.includes(pattern)) {
                matchFound = true;
                // Highlight the matching pattern
                const highlightedLine = line.replace(
                    new RegExp(pattern, 'g'), 
                    `<span style="background-color: #ffff00; color: #000000">${pattern}</span>`
                );
                echoOutput(highlightedLine);
            }
        });
        
        if (!matchFound) {
            echoOutput(`No matches found for '${pattern}' in ${filename}`);
        }
        
        echoOutput("> The <span class='not-completed'>grep</span> command searches for patterns in text files.");
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** PING *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Ping - test network connectivity to a host
     * @param {string} host - Hostname or IP address to ping
     */
    function ping(host) {
        if (!host) {
            echoOutput('Usage: ping <hostname or IP>');
            return;
        }
        
        arr[24] = 1; // Mark 'ping' command as completed
        
        echoOutput(`PING ${host} (${generateRandomIP()}) 56(84) bytes of data.`);
        
        // Generate 4 ping responses with random times
        let totalTime = 0;
        const pingCount = 4;
        
        for (let i = 0; i < pingCount; i++) {
            // Simulate delay
            setTimeout(() => {
                const time = (20 + Math.random() * 15).toFixed(3);
                totalTime += parseFloat(time);
                
                echoOutput(`64 bytes from ${host} (${generateRandomIP()}): icmp_seq=${i+1} ttl=64 time=${time} ms`);
                
                // If this is the last ping, show statistics
                if (i === pingCount - 1) {
                    const avgTime = (totalTime / pingCount).toFixed(3);
                    echoOutput(`<br>--- ${host} ping statistics ---`);
                    echoOutput(`${pingCount} packets transmitted, ${pingCount} received, 0% packet loss, time ${(totalTime * 1.2).toFixed(0)}ms`);
                    echoOutput(`rtt min/avg/max/mdev = ${(totalTime / pingCount * 0.8).toFixed(3)}/${avgTime}/${(totalTime / pingCount * 1.2).toFixed(3)}/${(totalTime / pingCount * 0.1).toFixed(3)} ms`);
                }
            }, i * 500); // Spaced out by 500ms
        }
        
        echoOutput("> The <span class='not-completed'>ping</span> command tests network connectivity to a host.");
        
        // Helper function to generate a random IP for simulation
        function generateRandomIP() {
            return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        }
    }

            s[x].push(arg2); // Add directory name to current directory
            s[count] = s[o[arg1]]; // Copy subdirectory structure
            count++; // Increment directory counter
        } else if (f[x] && f[x].includes(arg1)) {
            // Copy file
            f[x].push(arg2); // Add file to current directory
            of[arg2] = of[arg1]; // Copy file content
        } else {
            // Source doesn't exist
            echoOutput(`> "<span class="not-completed">${arg1}</span>" directory or file doesn't exist.`);
        }
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** RM *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Remove - deletes a file or directory
     * @param {string} arg1 - The file/directory to remove
     */
    function rm(arg1) {
        if (!arg1) {
            echoOutput('Usage: rm <filename>'); // Show usage if no argument provided
            return;
        }

        arr[9] = 1; // Mark 'rm' command as completed
        echoOutput('> The <span class="not-completed">rm</span> command is used to remove files or directories.');

        const x = o[pwdv[pwdv.length - 1]]; // Get current directory index

        if (s[x] && s[x].includes(arg1)) {
            // Remove directory
            const index = s[x].indexOf(arg1); // Find directory's index in array
            s[x].splice(index, 1); // Remove directory from array
        } else if (f[x] && f[x].includes(arg1)) {
            // Remove file
            const index = f[x].indexOf(arg1); // Find file's index in array
            f[x].splice(index, 1); // Remove file from array
        } else {
            // Target doesn't exist
            echoOutput(`> "<span class="not-completed">${arg1}</span>" directory or file doesn't exist.`);
        }
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** MKDIR *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Make Directory - creates a new directory
     * @param {string} arg1 - The directory name to create
     */
    function mkdir(arg1) {
        if (!arg1) {
            echoOutput('Usage: mkdir <directory>'); // Show usage if no argument provided
            return;
        }

        arr[10] = 1; // Mark 'mkdir' command as completed
        echoOutput('> The <span class="not-completed">mkdir</span> command (Make Directory) creates a directory.');

        const x = o[pwdv[pwdv.length - 1]]; // Get current directory index

        if (s[x]) {
            o[arg1] = count; // Assign new index for new directory
            s[x].push(arg1); // Add directory to current directory's list
            s[count] = []; // Initialize empty subdirectory list
            f[count] = []; // Initialize empty file list
            count++; // Increment directory counter
        }
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** CLEAR *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Clear - clears the terminal screen
     */
    function clear() {
        arr[11] = 1; // Mark 'clear' command as completed
        terminal.innerHTML = ''; // Remove all content from terminal
        echoOutput('> The clear command clears your terminal screen');
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** UNAME *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Uname - displays system name
     */
    function uname() {
        arr[12] = 1; // Mark 'uname' command as completed
        echoOutput('TerminalVelocity'); // Display system name
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** DATE *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Date - displays current date and time
     */
    function date() {
        arr[13] = 1; // Mark 'date' command as completed

        // Create a new Date object for current time
        const d = new Date();

        // Format time as HH:MM:SS
        const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

        // Arrays for day and month names
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Get current day and month names
        const currentDay = days[d.getDay()]; // getDay() returns 0-6 for day of week
        const currentMonth = months[d.getMonth()]; // getMonth() returns 0-11 for month

        // Format full date string
        const fullDate = `${currentDay}, ${currentMonth} ${d.getDate()} ${d.getFullYear()} ${time}`;

        echoOutput(fullDate); // Display formatted date
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** IFCONFIG *****$*****$*****$*****$*****$*****$*****$*****$*****
     * Ifconfig - displays network interface information
     */
    function ifconfig() {
        arr[14] = 1; // Mark 'ifconfig' command as completed

        // Display simulated network interface information
        echoOutput("eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500");
        echoOutput("        inet 192.168.1.10  netmask 255.255.255.0  broadcast 192.168.1.255");
        echoOutput("        inet6 fe80::215:5dff:fe36:46  prefixlen 64  scopeid 0x20<link>");
        echoOutput("        ether 00:15:5d:36:00:46  txqueuelen 1000  (Ethernet)");
        echoOutput("        RX packets 744  bytes 428453 (428.4 KB)");
        echoOutput("        RX errors 0  dropped 0  overruns 0  frame 0");
        echoOutput("        TX packets 920  bytes 318058 (318.0 KB)");
        echoOutput("        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0");
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** TTY *****$*****$*****$*****$*****$*****$*****$*****$*****
     * TTY - displays terminal device name
     */
    function tty() {
        arr[15] = 1; // Mark 'tty' command as completed
        echoOutput("/dev/pts/0"); // Display simulated terminal device
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** HISTORY *****$*****$*****$*****$*****$*****$*****$*****$*****
     * History - displays command history
     */
    function showHistory() {
        arr[16] = 1; // Mark 'history' command as completed

        let output = '';
        // Loop through history array and format each entry with a number
        history.forEach((cmd, index) => {
            output += `${index + 1}  ${cmd}<br>`;
        });

        echoOutput(output); // Display formatted history
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** ABOUT *****$*****$*****$*****$*****$*****$*****$*****$*****
     * About - displays information about the application
     */
    function about() {
        echoOutput("<p>Linux Terminal Emulator is a web-based application that simulates a Linux terminal environment.</p>");
        echoOutput("<p>It provides a hands-on experience for learning basic Linux commands.</p>");
    }

    /**  *****$*****$*****$*****$*****$*****$*****$*****$***** CONTRIBUTE *****$*****$*****$*****$*****$*****$*****$*****$*****        ????????????????????????
     * Contribute - displays information about contributing to the project
     */
    function contribute() {
        echoOutput("<p>This is an open-source project. Contributions are welcome!</p>");
    }
});
