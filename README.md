# skillyn

> A decentralized skill registry for [Claude Code](https://claude.ai/code) — publish, share, and install reusable AI skills from GitHub.

---

## What is a skill?

A **skill** is a small, self-contained script that Claude Code can run as a slash command or autonomous task. Skills are versioned, portable, and shareable via GitHub.

Instead of rewriting the same prompts and scripts in every project, you define a skill once and install it anywhere.

---

## How it works

skillyn has three parts:

| Part | Description |
|---|---|
| **skillyn** (this repo) | A GitHub-hosted skill registry — a curated collection of installable skills |
| **[skillyn-cli](https://github.com/yeahitsmejayyy/skillyn-cli)** | The npm CLI that installs and runs skills |
| **A skill** | A folder with `skill.json` + `run.ts` that does one focused thing |

When you run `skillyn add hello_world`, the CLI:
1. Fetches `registry.json` from this repo
2. Resolves the skill entry
3. Downloads `skill.json` and `run.ts` into `~/.skillyn/skills/<owner>/<skill>/`

When you run `skillyn run hello_world`, it executes `run.ts` locally via Bun.

---

## Quickstart

### 1. Install the CLI

```bash
npm install -g skillyn
```

### 2. Add a skill

```bash
# From this registry
skillyn add hello_world

# From any GitHub user's registry
skillyn add <github-username>/<skill-name>
```

### 3. Run a skill

```bash
skillyn run hello_world
```

---

## Registry structure

```
skillyn/
├── registry.json          # Index of all available skills
└── skills/
    └── hello_world/
        ├── skill.json     # Skill metadata
        └── run.ts         # Skill entry point (executed by Bun)
```

### `registry.json`

The top-level index. Every skill in this repo must have an entry here.

```json
{
  "skills": [
    {
      "name": "hello_world",
      "version": "1.0.0",
      "path": "skills/hello_world",
      "description": "Simple test skill"
    }
  ]
}
```

### `skill.json`

Per-skill metadata. Lives inside the skill's folder.

```json
{
  "name": "hello_world",
  "version": "1.0.0",
  "description": "Prints hello world",
  "entry": "run.ts"
}
```

### `run.ts`

The skill's entry point. Executed by Bun when `skillyn run` is called.

```ts
console.log("Hello from Skillyn!");
```

---

## Available skills

| Name | Version | Description |
|---|---|---|
| `hello_world` | 1.0.0 | Simple test skill — verify your setup works |

---

## Hosting your own registry

skillyn is designed to be decentralized. To host your own registry:

1. Create a GitHub repo named `skillyn`
2. Add a `registry.json` and `skills/` folder following the structure above
3. Publish skills with: `skillyn add <your-github-username>/<skill-name>`

Your registry is automatically resolved from `https://raw.githubusercontent.com/<username>/skillyn/main/registry.json`.

---

## Contributing a skill

1. Fork this repo
2. Create `skills/<your-skill-name>/skill.json` and `run.ts`
3. Add an entry to `registry.json`
4. Open a pull request

Keep skills focused — one skill, one job.

---

## Related

- [skillyn-cli](https://github.com/yeahitsmejayyy/skillyn-cli) — CLI source code
- [npm: skillyn](https://www.npmjs.com/package/skillyn) — published package
