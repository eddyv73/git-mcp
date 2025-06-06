# Git MCP

A Model Context Protocol server for Git version control. This MCP allows Claude to perform Git operations like commits, branches, merges, and more.

## Features

- **Repository Management**
  - Initialize new repositories
  - Clone existing repositories
  - Check repository status

- **Commit Operations**
  - Stage files for commit
  - Create commits with messages
  - Amend previous commits

- **Branch Management**
  - Create, list, and delete branches
  - Switch between branches
  - Merge branches

- **Remote Operations**
  - Push to remote repositories
  - Pull changes from remotes
  - Manage remote URLs

- **History & Inspection**
  - View commit logs
  - Show differences between commits
  - Stash and restore changes

- **Tag Management**
  - Create version tags
  - List existing tags
  - Delete tags

## Installation

```bash
# Clone the repository
git clone https://github.com/eddyv73/git-mcp.git
cd git-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

Add to Claude Desktop configuration file (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "git": {
      "command": "node",
      "args": ["/path/to/git-mcp/dist/index.js"]
    }
  }
}
```

Replace `/path/to/git-mcp` with the actual path where you cloned this repository.

## Usage in Claude

Once configured, you can use commands like:

- "Initialize a new git repository"
- "Commit all changes with message 'Initial commit'"
- "Create a new branch called feature/login"
- "Push changes to origin"
- "Show me the last 10 commits"
- "Merge the develop branch into main"

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Start the server
npm start
```

## License

MIT
