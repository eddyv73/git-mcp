# Git MCP (Model Context Protocol)

A comprehensive MCP tool for Git version control operations, providing seamless integration with Git repositories directly from your AI assistant.

## 📋 Features

- **Repository Management**: Initialize, clone, and manage Git repositories
- **Commit Operations**: Stage, commit, and track changes
- **Branch Management**: Create, switch, merge, and delete branches
- **Remote Operations**: Push, pull, fetch from remote repositories
- **History & Inspection**: View logs, diffs, and repository status
- **Stash Management**: Save and restore work in progress
- **Tag Management**: Create and manage version tags
- **Advanced Operations**: Reset, rebase, cherry-pick

## 🚀 Installation

```bash
# Clone this repository
git clone https://github.com/[your-username]/git-mcp.git
cd git-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## 🔧 Prerequisites

### Git Installation
Ensure Git is installed and configured:

```bash
# Check Git version
git --version

# Configure Git (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 📚 Available Functions

### Repository Initialization

#### `git_init`
Initialize a new Git repository.

```javascript
// Initialize in current directory
git_init({ 
  path: "./"
})

// Initialize with custom branch name
git_init({ 
  path: "./my-project",
  initialBranch: "main"
})

// Initialize bare repository
git_init({ 
  path: "./my-repo.git",
  bare: true
})
```

### Repository Cloning

#### `git_clone`
Clone an existing repository.

```javascript
// Basic clone
git_clone({ 
  url: "https://github.com/user/repo.git"
})

// Clone to specific directory
git_clone({ 
  url: "https://github.com/user/repo.git",
  path: "./projects/my-repo"
})

// Clone specific branch
git_clone({ 
  url: "https://github.com/user/repo.git",
  branch: "develop",
  path: "./my-repo"
})

// Shallow clone
git_clone({ 
  url: "https://github.com/user/repo.git",
  depth: 1
})

// Clone with submodules
git_clone({ 
  url: "https://github.com/user/repo.git",
  recursive: true
})
```

### Status Checking

#### `git_status`
Check repository status.

```javascript
// Get status
git_status({ 
  path: "./my-repo"
})

// Short format
git_status({ 
  path: "./my-repo",
  short: true
})

// Machine-readable format
git_status({ 
  path: "./my-repo",
  porcelain: true
})

// Include branch info
git_status({ 
  path: "./my-repo",
  branch: true
})
```

### Staging Files

#### `git_add`
Add files to staging area.

```javascript
// Add specific files
git_add({ 
  files: ["index.js", "README.md"],
  path: "./my-repo"
})

// Add all changes
git_add({ 
  all: true,
  path: "./my-repo"
})

// Add only tracked files
git_add({ 
  update: true,
  path: "./my-repo"
})

// Add with pattern
git_add({ 
  files: ["*.js", "src/**/*.css"],
  path: "./my-repo"
})
```

### Committing Changes

#### `git_commit`
Commit staged changes.

```javascript
// Basic commit
git_commit({ 
  message: "Add new feature",
  path: "./my-repo"
})

// Commit with detailed message
git_commit({ 
  message: "feat: Add user authentication\n\nImplemented JWT-based auth",
  path: "./my-repo"
})

// Commit all changes
git_commit({ 
  message: "Update configuration",
  all: true,
  path: "./my-repo"
})

// Amend last commit
git_commit({ 
  message: "Updated commit message",
  amend: true,
  path: "./my-repo"
})

// Commit with author
git_commit({ 
  message: "Fix bug",
  author: "John Doe <john@example.com>",
  path: "./my-repo"
})
```

### Branch Management

#### `git_branch`
Manage branches.

```javascript
// List branches
git_branch({ 
  action: "list",
  path: "./my-repo"
})

// List all branches (including remote)
git_branch({ 
  action: "list",
  all: true,
  path: "./my-repo"
})

// Create new branch
git_branch({ 
  action: "create",
  name: "feature/new-feature",
  path: "./my-repo"
})

// Delete branch
git_branch({ 
  action: "delete",
  name: "old-feature",
  path: "./my-repo"
})

// Rename branch
git_branch({ 
  action: "rename",
  name: "old-name",
  newName: "new-name",
  path: "./my-repo"
})
```

### Branch Switching

#### `git_checkout`
Switch branches or restore files.

```javascript
// Switch branch
git_checkout({ 
  branch: "develop",
  path: "./my-repo"
})

// Create and switch
git_checkout({ 
  branch: "feature/new",
  create: true,
  path: "./my-repo"
})

// Force checkout
git_checkout({ 
  branch: "main",
  force: true,
  path: "./my-repo"
})

// Checkout specific commit
git_checkout({ 
  branch: "abc123",
  path: "./my-repo"
})
```

### Remote Operations

#### `git_push`
Push commits to remote repository.

```javascript
// Basic push
git_push({ 
  path: "./my-repo"
})

// Push to specific remote and branch
git_push({ 
  remote: "origin",
  branch: "main",
  path: "./my-repo"
})

// Force push (use carefully!)
git_push({ 
  force: true,
  path: "./my-repo"
})

// Push with upstream
git_push({ 
  setUpstream: true,
  branch: "feature/new",
  path: "./my-repo"
})

// Push tags
git_push({ 
  tags: true,
  path: "./my-repo"
})
```

#### `git_pull`
Pull changes from remote repository.

```javascript
// Basic pull
git_pull({ 
  path: "./my-repo"
})

// Pull from specific remote and branch
git_pull({ 
  remote: "origin",
  branch: "main",
  path: "./my-repo"
})

// Pull with rebase
git_pull({ 
  rebase: true,
  path: "./my-repo"
})

// Pull with fast-forward only
git_pull({ 
  ff: true,
  path: "./my-repo"
})
```

### Merging

#### `git_merge`
Merge branches.

```javascript
// Basic merge
git_merge({ 
  branch: "feature/complete",
  path: "./my-repo"
})

// Merge with custom message
git_merge({ 
  branch: "hotfix/urgent",
  message: "Merge urgent hotfix",
  path: "./my-repo"
})

// No fast-forward merge
git_merge({ 
  branch: "feature/new",
  noFf: true,
  path: "./my-repo"
})

// Squash merge
git_merge({ 
  branch: "feature/messy",
  squash: true,
  path: "./my-repo"
})
```

### History Viewing

#### `git_log`
View commit history.

```javascript
// Basic log
git_log({ 
  path: "./my-repo"
})

// Limit number of commits
git_log({ 
  limit: 10,
  path: "./my-repo"
})

// One line format
git_log({ 
  oneline: true,
  path: "./my-repo"
})

// Graph view
git_log({ 
  graph: true,
  oneline: true,
  path: "./my-repo"
})

// Filter by author
git_log({ 
  author: "john@example.com",
  path: "./my-repo"
})

// Filter by date
git_log({ 
  since: "2024-01-01",
  until: "2024-12-31",
  path: "./my-repo"
})
```

### Viewing Differences

#### `git_diff`
Show changes between commits.

```javascript
// Working directory changes
git_diff({ 
  path: "./my-repo"
})

// Staged changes
git_diff({ 
  cached: true,
  path: "./my-repo"
})

// Diff specific commit
git_diff({ 
  commit: "HEAD~1",
  path: "./my-repo"
})

// Show statistics only
git_diff({ 
  stat: true,
  path: "./my-repo"
})

// Show file names only
git_diff({ 
  nameOnly: true,
  path: "./my-repo"
})
```

### Stash Management

#### `git_stash`
Save and restore work in progress.

```javascript
// Save to stash
git_stash({ 
  action: "save",
  message: "WIP: Working on feature",
  path: "./my-repo"
})

// Include untracked files
git_stash({ 
  action: "save",
  includeUntracked: true,
  path: "./my-repo"
})

// List stashes
git_stash({ 
  action: "list",
  path: "./my-repo"
})

// Apply stash
git_stash({ 
  action: "apply",
  index: 0,
  path: "./my-repo"
})

// Pop stash
git_stash({ 
  action: "pop",
  path: "./my-repo"
})

// Drop stash
git_stash({ 
  action: "drop",
  index: 0,
  path: "./my-repo"
})

// Clear all stashes
git_stash({ 
  action: "clear",
  path: "./my-repo"
})
```

### Remote Management

#### `git_remote`
Manage remote repositories.

```javascript
// List remotes
git_remote({ 
  action: "list",
  path: "./my-repo"
})

// List with URLs
git_remote({ 
  action: "list",
  verbose: true,
  path: "./my-repo"
})

// Add remote
git_remote({ 
  action: "add",
  name: "upstream",
  url: "https://github.com/original/repo.git",
  path: "./my-repo"
})

// Remove remote
git_remote({ 
  action: "remove",
  name: "old-remote",
  path: "./my-repo"
})

// Change remote URL
git_remote({ 
  action: "set-url",
  name: "origin",
  url: "https://github.com/new/repo.git",
  path: "./my-repo"
})
```

### Tag Management

#### `git_tag`
Create and manage tags.

```javascript
// List tags
git_tag({ 
  action: "list",
  path: "./my-repo"
})

// Create lightweight tag
git_tag({ 
  action: "create",
  name: "v1.0.0",
  path: "./my-repo"
})

// Create annotated tag
git_tag({ 
  action: "create",
  name: "v2.0.0",
  message: "Release version 2.0.0",
  annotated: true,
  path: "./my-repo"
})

// Delete tag
git_tag({ 
  action: "delete",
  name: "old-tag",
  path: "./my-repo"
})

// Force create tag
git_tag({ 
  action: "create",
  name: "v1.0.1",
  force: true,
  path: "./my-repo"
})
```

### Reset Operations

#### `git_reset`
Reset current HEAD to specified state.

```javascript
// Soft reset (keep changes staged)
git_reset({ 
  mode: "soft",
  commit: "HEAD~1",
  path: "./my-repo"
})

// Mixed reset (default, unstage changes)
git_reset({ 
  mode: "mixed",
  commit: "HEAD~2",
  path: "./my-repo"
})

// Hard reset (discard all changes)
git_reset({ 
  mode: "hard",
  commit: "origin/main",
  path: "./my-repo"
})
```

## 🎯 Common Workflows

### 1. Feature Branch Workflow
```javascript
// Create feature branch
await git_checkout({ 
  branch: "feature/user-auth",
  create: true,
  path: "./project"
});

// Make changes and commit
await git_add({ all: true, path: "./project" });
await git_commit({ 
  message: "feat: Add user authentication",
  path: "./project"
});

// Push to remote
await git_push({ 
  setUpstream: true,
  branch: "feature/user-auth",
  path: "./project"
});

// Merge to main
await git_checkout({ branch: "main", path: "./project" });
await git_merge({ 
  branch: "feature/user-auth",
  path: "./project"
});
```

### 2. Hotfix Workflow
```javascript
// Create hotfix from main
await git_checkout({ branch: "main", path: "./project" });
await git_checkout({ 
  branch: "hotfix/critical-bug",
  create: true,
  path: "./project"
});

// Fix and commit
await git_add({ files: ["bugfix.js"], path: "./project" });
await git_commit({ 
  message: "fix: Resolve critical bug",
  path: "./project"
});

// Merge to main and develop
await git_checkout({ branch: "main", path: "./project" });
await git_merge({ branch: "hotfix/critical-bug", path: "./project" });
await git_push({ path: "./project" });

await git_checkout({ branch: "develop", path: "./project" });
await git_merge({ branch: "hotfix/critical-bug", path: "./project" });
```

### 3. Release Tagging
```javascript
// Ensure on main branch
await git_checkout({ branch: "main", path: "./project" });

// Create release tag
await git_tag({ 
  action: "create",
  name: "v1.2.0",
  message: "Release version 1.2.0\n\n- New features\n- Bug fixes",
  annotated: true,
  path: "./project"
});

// Push tags
await git_push({ tags: true, path: "./project" });
```

### 4. Sync Fork with Upstream
```javascript
// Add upstream remote
await git_remote({ 
  action: "add",
  name: "upstream",
  url: "https://github.com/original/repo.git",
  path: "./forked-repo"
});

// Fetch upstream
await git_pull({ 
  remote: "upstream",
  branch: "main",
  path: "./forked-repo"
});

// Merge upstream changes
await git_checkout({ branch: "main", path: "./forked-repo" });
await git_merge({ 
  branch: "upstream/main",
  path: "./forked-repo"
});

// Push to fork
await git_push({ path: "./forked-repo" });
```

## 🛠️ Advanced Usage

### Interactive Rebase Workflow
```javascript
// Note: Interactive rebase requires manual intervention
// This example shows the concept

// Start rebase
await git_reset({ 
  mode: "soft",
  commit: "HEAD~3",
  path: "./project"
});

// Re-commit with better organization
await git_commit({ 
  message: "refactor: Reorganize module structure",
  path: "./project"
});
```

### Cherry-pick Operations
```javascript
// Cherry-pick would require additional implementation
// Example workflow:
// 1. Identify commit hash
// 2. Switch to target branch
// 3. Apply specific commit
```

## 🐛 Troubleshooting

### Common Issues

1. **Merge Conflicts**
   ```bash
   # Check status
   git status
   
   # Resolve conflicts manually
   # Then add resolved files
   git add <resolved-files>
   git commit
   ```

2. **Detached HEAD**
   ```javascript
   // Return to branch
   git_checkout({ 
     branch: "main",
     path: "./project"
   })
   ```

3. **Push Rejected**
   ```javascript
   // Pull first
   await git_pull({ path: "./project" });
   
   // Then push
   await git_push({ path: "./project" });
   ```

4. **Lost Commits**
   ```bash
   # Use reflog to find lost commits
   git reflog
   
   # Restore commit
   git checkout <commit-hash>
   ```

## 📊 Best Practices

1. **Commit Messages**: Follow conventional commits (feat:, fix:, docs:, etc.)
2. **Branch Naming**: Use descriptive names (feature/, bugfix/, hotfix/)
3. **Regular Commits**: Make small, focused commits
4. **Pull Before Push**: Always sync before pushing
5. **Review Before Commit**: Use `git diff` to review changes

## 🔒 Security Considerations

1. **Never commit sensitive data** (passwords, API keys)
2. **Use `.gitignore`** for private files
3. **Verify remote URLs** before pushing
4. **Use SSH keys** for authentication
5. **Sign commits** with GPG when possible

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Resources

- [Git Documentation](https://git-scm.com/doc)
- [Pro Git Book](https://git-scm.com/book)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
