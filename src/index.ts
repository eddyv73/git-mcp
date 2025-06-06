import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

class GitMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'git-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'git_init',
          description: 'Initialize a new Git repository',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Directory path to initialize',
              },
              initialBranch: {
                type: 'string',
                default: 'main',
              },
              bare: {
                type: 'boolean',
                default: false,
              },
            },
          },
        },
        {
          name: 'git_clone',
          description: 'Clone a repository',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'Repository URL to clone',
              },
              path: {
                type: 'string',
                description: 'Destination path',
              },
              branch: {
                type: 'string',
                description: 'Branch to checkout',
              },
              depth: {
                type: 'number',
                description: 'Clone depth',
              },
              recursive: {
                type: 'boolean',
                default: true,
              },
            },
            required: ['url'],
          },
        },
        {
          name: 'git_status',
          description: 'Show working tree status',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Repository path',
              },
              short: {
                type: 'boolean',
                default: false,
              },
              branch: {
                type: 'boolean',
                default: true,
              },
              porcelain: {
                type: 'boolean',
                default: false,
              },
            },
          },
        },
        {
          name: 'git_add',
          description: 'Add files to staging area',
          inputSchema: {
            type: 'object',
            properties: {
              files: {
                type: 'array',
                items: { type: 'string' },
                description: 'Files to add',
              },
              path: {
                type: 'string',
                description: 'Repository path',
              },
              all: {
                type: 'boolean',
                default: false,
              },
              update: {
                type: 'boolean',
                default: false,
              },
            },
          },
        },
        {
          name: 'git_commit',
          description: 'Commit changes',
          inputSchema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Commit message',
              },
              path: {
                type: 'string',
                description: 'Repository path',
              },
              all: {
                type: 'boolean',
                default: false,
              },
              amend: {
                type: 'boolean',
                default: false,
              },
              author: {
                type: 'string',
                description: 'Author name and email',
              },
            },
            required: ['message'],
          },
        },
        {
          name: 'git_push',
          description: 'Push commits to remote',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Repository path',
              },
              remote: {
                type: 'string',
                default: 'origin',
              },
              branch: {
                type: 'string',
                description: 'Branch to push',
              },
              force: {
                type: 'boolean',
                default: false,
              },
              setUpstream: {
                type: 'boolean',
                default: false,
              },
              tags: {
                type: 'boolean',
                default: false,
              },
            },
          },
        },
        {
          name: 'git_pull',
          description: 'Pull changes from remote',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Repository path',
              },
              remote: {
                type: 'string',
                default: 'origin',
              },
              branch: {
                type: 'string',
                description: 'Branch to pull',
              },
              rebase: {
                type: 'boolean',
                default: false,
              },
              ff: {
                type: 'boolean',
                default: true,
              },
            },
          },
        },
        {
          name: 'git_branch',
          description: 'Manage branches',
          inputSchema: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                enum: ['list', 'create', 'delete', 'rename'],
                default: 'list',
              },
              name: {
                type: 'string',
                description: 'Branch name',
              },
              newName: {
                type: 'string',
                description: 'New branch name (for rename)',
              },
              path: {
                type: 'string',
                description: 'Repository path',
              },
              all: {
                type: 'boolean',
                default: false,
              },
              remote: {
                type: 'boolean',
                default: false,
              },
            },
          },
        },
        {
          name: 'git_checkout',
          description: 'Switch branches or restore files',
          inputSchema: {
            type: 'object',
            properties: {
              branch: {
                type: 'string',
                description: 'Branch or commit to checkout',
              },
              path: {
                type: 'string',
                description: 'Repository path',
              },
              create: {
                type: 'boolean',
                default: false,
              },
              force: {
                type: 'boolean',
                default: false,
              },
            },
            required: ['branch'],
          },
        },
        {
          name: 'git_merge',
          description: 'Merge branches',
          inputSchema: {
            type: 'object',
            properties: {
              branch: {
                type: 'string',
                description: 'Branch to merge',
              },
              path: {
                type: 'string',
                description: 'Repository path',
              },
              message: {
                type: 'string',
                description: 'Merge commit message',
              },
              noFf: {
                type: 'boolean',
                default: false,
              },
              squash: {
                type: 'boolean',
                default: false,
              },
            },
            required: ['branch'],
          },
        },
        {
          name: 'git_log',
          description: 'Show commit logs',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Repository path',
              },
              limit: {
                type: 'number',
                default: 10,
              },
              oneline: {
                type: 'boolean',
                default: false,
              },
              graph: {
                type: 'boolean',
                default: false,
              },
              author: {
                type: 'string',
                description: 'Filter by author',
              },
              since: {
                type: 'string',
                description: 'Show commits since date',
              },
              until: {
                type: 'string',
                description: 'Show commits until date',
              },
            },
          },
        },
        {
          name: 'git_diff',
          description: 'Show changes between commits',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Repository path',
              },
              cached: {
                type: 'boolean',
                default: false,
              },
              commit: {
                type: 'string',
                description: 'Specific commit to diff',
              },
              stat: {
                type: 'boolean',
                default: false,
              },
              nameOnly: {
                type: 'boolean',
                default: false,
              },
            },
          },
        },
        {
          name: 'git_stash',
          description: 'Stash changes',
          inputSchema: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                enum: ['save', 'pop', 'list', 'apply', 'drop', 'clear'],
                default: 'save',
              },
              message: {
                type: 'string',
                description: 'Stash message',
              },
              path: {
                type: 'string',
                description: 'Repository path',
              },
              index: {
                type: 'number',
                description: 'Stash index',
              },
              includeUntracked: {
                type: 'boolean',
                default: false,
              },
            },
          },
        },
        {
          name: 'git_remote',
          description: 'Manage remotes',
          inputSchema: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                enum: ['list', 'add', 'remove', 'show', 'set-url'],
                default: 'list',
              },
              name: {
                type: 'string',
                description: 'Remote name',
              },
              url: {
                type: 'string',
                description: 'Remote URL',
              },
              path: {
                type: 'string',
                description: 'Repository path',
              },
              verbose: {
                type: 'boolean',
                default: false,
              },
            },
          },
        },
        {
          name: 'git_tag',
          description: 'Manage tags',
          inputSchema: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                enum: ['list', 'create', 'delete'],
                default: 'list',
              },
              name: {
                type: 'string',
                description: 'Tag name',
              },
              message: {
                type: 'string',
                description: 'Tag message',
              },
              path: {
                type: 'string',
                description: 'Repository path',
              },
              annotated: {
                type: 'boolean',
                default: false,
              },
              force: {
                type: 'boolean',
                default: false,
              },
            },
          },
        },
        {
          name: 'git_reset',
          description: 'Reset current HEAD to specified state',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Repository path',
              },
              mode: {
                type: 'string',
                enum: ['soft', 'mixed', 'hard'],
                default: 'mixed',
              },
              commit: {
                type: 'string',
                default: 'HEAD',
                description: 'Commit to reset to',
              },
            },
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'git_init':
            return await this.handleInit(args);
          case 'git_clone':
            return await this.handleClone(args);
          case 'git_status':
            return await this.handleStatus(args);
          case 'git_add':
            return await this.handleAdd(args);
          case 'git_commit':
            return await this.handleCommit(args);
          case 'git_push':
            return await this.handlePush(args);
          case 'git_pull':
            return await this.handlePull(args);
          case 'git_branch':
            return await this.handleBranch(args);
          case 'git_checkout':
            return await this.handleCheckout(args);
          case 'git_merge':
            return await this.handleMerge(args);
          case 'git_log':
            return await this.handleLog(args);
          case 'git_diff':
            return await this.handleDiff(args);
          case 'git_stash':
            return await this.handleStash(args);
          case 'git_remote':
            return await this.handleRemote(args);
          case 'git_tag':
            return await this.handleTag(args);
          case 'git_reset':
            return await this.handleReset(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) throw error;
        throw new McpError(
          ErrorCode.InternalError,
          `Git error: ${error.message}`
        );
      }
    });
  }

  private async execGit(command: string, cwd?: string) {
    const options = cwd ? { cwd } : {};
    const { stdout, stderr } = await execAsync(`git ${command}`, options);
    return { stdout, stderr };
  }

  private async handleInit(args: any) {
    let command = 'init';
    if (args.initialBranch) command += ` --initial-branch="${args.initialBranch}"`;
    if (args.bare) command += ' --bare';
    if (args.path) command += ` "${args.path}"`;

    const { stdout } = await this.execGit(command);
    return {
      content: [
        {
          type: 'text',
          text: stdout || 'Git repository initialized successfully',
        },
      ],
    };
  }

  private async handleClone(args: any) {
    let command = `clone "${args.url}"`;
    if (args.path) command += ` "${args.path}"`;
    if (args.branch) command += ` --branch "${args.branch}"`;
    if (args.depth) command += ` --depth ${args.depth}`;
    if (args.recursive) command += ' --recursive';

    const { stdout } = await this.execGit(command);
    return {
      content: [
        {
          type: 'text',
          text: stdout || 'Repository cloned successfully',
        },
      ],
    };
  }

  private async handleStatus(args: any) {
    let command = 'status';
    if (args.short) command += ' --short';
    if (args.branch) command += ' --branch';
    if (args.porcelain) command += ' --porcelain';

    const { stdout } = await this.execGit(command, args.path);
    return {
      content: [
        {
          type: 'text',
          text: stdout,
        },
      ],
    };
  }

  private async handleAdd(args: any) {
    let command = 'add';
    if (args.all) {
      command += ' --all';
    } else if (args.update) {
      command += ' --update';
    } else if (args.files && args.files.length > 0) {
      command += ' ' + args.files.map(f => `"${f}"`).join(' ');
    } else {
      command += ' .';
    }

    const { stdout } = await this.execGit(command, args.path);
    return {
      content: [
        {
          type: 'text',
          text: stdout || 'Files added to staging area',
        },
      ],
    };
  }

  private async handleCommit(args: any) {
    let command = 'commit';
    command += ` -m "${args.message}"`;
    if (args.all) command += ' --all';
    if (args.amend) command += ' --amend';
    if (args.author) command += ` --author="${args.author}"`;

    const { stdout } = await this.execGit(command, args.path);
    return {
      content: [
        {
          type: 'text',
          text: stdout,
        },
      ],
    };
  }

  private async handlePush(args: any) {
    let command = 'push';
    if (args.force) command += ' --force';
    if (args.setUpstream) command += ' --set-upstream';
    if (args.tags) command += ' --tags';
    command += ` ${args.remote || 'origin'}`;
    if (args.branch) command += ` ${args.branch}`;

    const { stdout } = await this.execGit(command, args.path);
    return {
      content: [
        {
          type: 'text',
          text: stdout || 'Push completed successfully',
        },
      ],
    };
  }

  private async handlePull(args: any) {
    let command = 'pull';
    if (args.rebase) command += ' --rebase';
    if (args.ff === false) command += ' --no-ff';
    command += ` ${args.remote || 'origin'}`;
    if (args.branch) command += ` ${args.branch}`;

    const { stdout } = await this.execGit(command, args.path);
    return {
      content: [
        {
          type: 'text',
          text: stdout,
        },
      ],
    };
  }

  private async handleBranch(args: any) {
    let command = 'branch';
    
    switch (args.action) {
      case 'create':
        command += ` "${args.name}"`;
        break;
      case 'delete':
        command += ` -d "${args.name}"`;
        break;
      case 'rename':
        command += ` -m "${args.name}" "${args.newName}"`;
        break;
      case 'list':
      default:
        if (args.all) command += ' --all';
        if (args.remote) command += ' --remote';
        break;
    }

    const { stdout } = await this.execGit(command, args.path);
    return {
      content: [
        {
          type: 'text',
          text: stdout || 'Branch operation completed',
        },
      ],
    };
  }

  private async handleCheckout(args: any) {
    let command = 'checkout';
    if (args.create) command += ' -b';
    if (args.force) command += ' --force';
    command += ` "${args.branch}"`;

    const { stdout } = await this.execGit(command, args.path);
    return {
      content: [
        {
          type: 'text',
          text: stdout || `Switched to branch '${args.branch}'`,
        },
      ],
    };
  }

  private async handleMerge(args: any) {
    let command = `merge "${args.branch}"`;
    if (args.message) command += ` -m "${args.message}"`;
    if (args.noFf) command += ' --no-ff';
    if (args.squash) command += ' --squash';

    const { stdout } = await this.execGit(command, args.path);
    return {
      content: [
        {
          type: 'text',
          text: stdout,
        },
      ],
    };
  }

  private async handleLog(args: any) {
    let command = 'log';
    if (args.limit) command += ` -${args.limit}`;
    if (args.oneline) command += ' --oneline';
    if (args.graph) command += ' --graph';
    if (args.author) command += ` --author="${args.author}"`;
    if (args.since) command += ` --since="${args.since}"`;
    if (args.until) command += ` --until="${args.until}"`;

    const { stdout } = await this.execGit(command, args.path);
    return {
      content: [
        {
          type: 'text',
          text: stdout,
        },
      ],
    };
  }

  private async handleDiff(args: any) {
    let command = 'diff';
    if (args.cached) command += ' --cached';
    if (args.stat) command += ' --stat';
    if (args.nameOnly) command += ' --name-only';
    if (args.commit) command += ` ${args.commit}`;

    const { stdout } = await this.execGit(command, args.path);
    return {
      content: [
        {
          type: 'text',
          text: stdout || 'No differences found',
        },
      ],
    };
  }

  private async handleStash(args: any) {
    let command = 'stash';
    
    switch (args.action) {
      case 'save':
        command += ' push';
        if (args.message) command += ` -m "${args.message}"`;
        if (args.includeUntracked) command += ' --include-untracked';
        break;
      case 'pop':
        command += ' pop';
        if (args.index !== undefined) command += ` stash@{${args.index}}`;
        break;
      case 'apply':
        command += ' apply';
        if (args.index !== undefined) command += ` stash@{${args.index}}`;
        break;
      case 'drop':
        command += ' drop';
        if (args.index !== undefined) command += ` stash@{${args.index}}`;
        break;
      case 'clear':
        command += ' clear';
        break;
      case 'list':
      default:
        command += ' list';
        break;
    }

    const { stdout } = await this.execGit(command, args.path);
    return {
      content: [
        {
          type: 'text',
          text: stdout || 'Stash operation completed',
        },
      ],
    };
  }

  private async handleRemote(args: any) {
    let command = 'remote';
    
    switch (args.action) {
      case 'add':
        command += ` add "${args.name}" "${args.url}"`;
        break;
      case 'remove':
        command += ` remove "${args.name}"`;
        break;
      case 'set-url':
        command += ` set-url "${args.name}" "${args.url}"`;
        break;
      case 'show':
        command += ` show ${args.name || ''}`;
        break;
      case 'list':
      default:
        if (args.verbose) command += ' -v';
        break;
    }

    const { stdout } = await this.execGit(command, args.path);
    return {
      content: [
        {
          type: 'text',
          text: stdout || 'Remote operation completed',
        },
      ],
    };
  }

  private async handleTag(args: any) {
    let command = 'tag';
    
    switch (args.action) {
      case 'create':
        if (args.annotated && args.message) {
          command += ` -a "${args.name}" -m "${args.message}"`;
        } else {
          command += ` "${args.name}"`;
        }
        if (args.force) command += ' -f';
        break;
      case 'delete':
        command += ` -d "${args.name}"`;
        break;
      case 'list':
      default:
        // Just 'tag' lists all tags
        break;
    }

    const { stdout } = await this.execGit(command, args.path);
    return {
      content: [
        {
          type: 'text',
          text: stdout || 'Tag operation completed',
        },
      ],
    };
  }

  private async handleReset(args: any) {
    let command = `reset --${args.mode} ${args.commit || 'HEAD'}`;

    const { stdout } = await this.execGit(command, args.path);
    return {
      content: [
        {
          type: 'text',
          text: stdout || 'Reset completed',
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Git MCP server running on stdio');
  }
}

const server = new GitMCPServer();
server.run().catch(console.error);
