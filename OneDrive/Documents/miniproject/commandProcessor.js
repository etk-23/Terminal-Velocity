
import FileSystem from '../utils/fileSystem';

class CommandProcessor {
  constructor() {
    this.fileSystem = new FileSystem();
    this.commandHistory = [];
    this.historyIndex = -1;
  }

  // Process a command and return the result
  processCommand(commandStr) {
    // Add command to history
    this.commandHistory.push(commandStr);
    this.historyIndex = this.commandHistory.length;
    
    // Parse the command and arguments
    const parts = commandStr.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Process based on command
    switch (command) {
      case 'ls':
        return this.ls(args);
      case 'cd':
        return this.cd(args);
      case 'pwd':
        return this.pwd();
      case 'mkdir':
        return this.mkdir(args);
      case 'rmdir':
        return this.rmdir(args);
      case 'touch':
        return this.touch(args);
      case 'cat':
        return this.cat(args);
      case 'rm':
        return this.rm(args);
      case 'cp':
        return this.cp(args);
      case 'mv':
        return this.mv(args);
      case 'find':
        return this.find(args);
      case 'grep':
        return this.grep(args);
      case 'clear':
        return { type: 'clear' };
      case 'help':
        return this.help();
      case '':
        return { type: 'empty' };
      default:
        return {
          type: 'error',
          content: `Command not found: ${command}`
        };
    }
  }

  // Get previous command from history
  getPreviousCommand() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      return this.commandHistory[this.historyIndex];
    }
    return null;
  }

  // Get next command from history
  getNextCommand() {
    if (this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
      return this.commandHistory[this.historyIndex];
    } else if (this.historyIndex === this.commandHistory.length - 1) {
      this.historyIndex = this.commandHistory.length;
      return '';
    }
    return null;
  }

  // Command implementations
  ls(args) {
    const items = this.fileSystem.listDirectory();
    return {
      type: 'success',
      content: items.map(item => {
        if (item.type === 'directory') {
          return `<span class="folder">${item.name}/</span>`;
        } else {
          return `<span class="file">${item.name}</span>`;
        }
      }).join('   ')
    };
  }

  cd(args) {
    const path = args[0] || '~';
    const success = this.fileSystem.changeDirectory(path);
    
    if (success) {
      return {
        type: 'success',
        content: ''
      };
    } else {
      return {
        type: 'error',
        content: `cd: no such directory: ${path}`
      };
    }
  }

  pwd() {
    return {
      type: 'success',
      content: this.fileSystem.getCurrentPathString().replace('~', '/home/user')
    };
  }

  mkdir(args) {
    if (!args.length) {
      return {
        type: 'error',
        content: 'mkdir: missing operand'
      };
    }
    
    const results = [];
    for (const dir of args) {
      const success = this.fileSystem.makeDirectory(dir);
      if (!success) {
        results.push(`mkdir: cannot create directory '${dir}': File exists or invalid name`);
      }
    }
    
    if (results.length) {
      return {
        type: 'error',
        content: results.join('\n')
      };
    } else {
      return {
        type: 'success',
        content: ''
      };
    }
  }

  rmdir(args) {
    if (!args.length) {
      return {
        type: 'error',
        content: 'rmdir: missing operand'
      };
    }
    
    const results = [];
    for (const dir of args) {
      const success = this.fileSystem.removeDirectory(dir);
      if (!success) {
        results.push(`rmdir: failed to remove '${dir}': No such directory or directory not empty`);
      }
    }
    
    if (results.length) {
      return {
        type: 'error',
        content: results.join('\n')
      };
    } else {
      return {
        type: 'success',
        content: ''
      };
    }
  }

  touch(args) {
    if (!args.length) {
      return {
        type: 'error',
        content: 'touch: missing file operand'
      };
    }
    
    const results = [];
    for (const file of args) {
      const success = this.fileSystem.touchFile(file);
      if (!success) {
        results.push(`touch: cannot touch '${file}': Invalid argument`);
      }
    }
    
    if (results.length) {
      return {
        type: 'error',
        content: results.join('\n')
      };
    } else {
      return {
        type: 'success',
        content: ''
      };
    }
  }

  cat(args) {
    if (!args.length) {
      return {
        type: 'error',
        content: 'cat: missing file operand'
      };
    }
    
    const results = [];
    for (const file of args) {
      const content = this.fileSystem.getFileContent(file);
      if (content === null) {
        results.push(`cat: ${file}: No such file`);
      } else {
        results.push(content);
      }
    }
    
    return {
      type: results.some(r => r.startsWith('cat:')) ? 'error' : 'success',
      content: results.join('\n')
    };
  }

  rm(args) {
    if (!args.length) {
      return {
        type: 'error',
        content: 'rm: missing operand'
      };
    }
    
    const results = [];
    for (const file of args) {
      const success = this.fileSystem.removeFile(file);
      if (!success) {
        results.push(`rm: cannot remove '${file}': No such file`);
      }
    }
    
    if (results.length) {
      return {
        type: 'error',
        content: results.join('\n')
      };
    } else {
      return {
        type: 'success',
        content: ''
      };
    }
  }

  cp(args) {
    if (args.length < 2) {
      return {
        type: 'error',
        content: 'cp: missing destination file operand'
      };
    }
    
    const source = args[0];
    const destination = args[1];
    const success = this.fileSystem.copyItem(source, destination);
    
    if (success) {
      return {
        type: 'success',
        content: ''
      };
    } else {
      return {
        type: 'error',
        content: `cp: cannot copy '${source}' to '${destination}': No such file or invalid operation`
      };
    }
  }

  mv(args) {
    if (args.length < 2) {
      return {
        type: 'error',
        content: 'mv: missing destination file operand'
      };
    }
    
    const source = args[0];
    const destination = args[1];
    const success = this.fileSystem.moveItem(source, destination);
    
    if (success) {
      return {
        type: 'success',
        content: ''
      };
    } else {
      return {
        type: 'error',
        content: `mv: cannot move '${source}' to '${destination}': No such file or invalid operation`
      };
    }
  }

  find(args) {
    if (!args.length) {
      return {
        type: 'error',
        content: 'find: missing arguments'
      };
    }
    
    // Simplified find that just searches by name
    const pattern = args[args.indexOf('-name') + 1] || args[0];
    const results = this.fileSystem.findItems(pattern.replace(/['"]/g, ''));
    
    if (results.length) {
      return {
        type: 'success',
        content: results.map(r => r.path).join('\n')
      };
    } else {
      return {
        type: 'success',
        content: ''
      };
    }
  }

  grep(args) {
    if (args.length < 1) {
      return {
        type: 'error',
        content: 'grep: missing pattern'
      };
    }
    
    const pattern = args[0];
    const results = this.fileSystem.grepInFiles(pattern);
    
    if (results.length) {
      const formatted = results.flatMap(r => 
        r.matches.map(m => `${r.path}:${m}`)
      );
      
      return {
        type: 'success',
        content: formatted.join('\n')
      };
    } else {
      return {
        type: 'success',
        content: ''
      };
    }
  }

  help() {
    return {
      type: 'success',
      content: `Available commands:
- Navigation: ls, cd, pwd
- File Management: touch, cat, rm, cp, mv, find
- Directory Management: mkdir, rmdir
- Text Processing: grep
- System: clear, help`
    };
  }

  // Get the current prompt
  getPrompt() {
    return {
      hostname: 'Terminal Velocity',
      path: this.fileSystem.getCurrentPathString()
    };
  }
}

export default CommandProcessor;