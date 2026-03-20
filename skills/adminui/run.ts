import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

const TEMPLATE_REPO = "https://github.com/yeahitsmejayyy/skelly-admin";

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function replaceInFile(filePath: string, from: string, to: string): void {
  const content = fs.readFileSync(filePath, "utf8");
  const updated = content
    .replace(new RegExp(from, "g"), to)
    .replace(new RegExp(from.charAt(0).toUpperCase() + from.slice(1), "g"), to.charAt(0).toUpperCase() + to.slice(1))
    .replace(new RegExp(from.toUpperCase(), "g"), to.toUpperCase());
  if (content !== updated) {
    fs.writeFileSync(filePath, updated, "utf8");
  }
}

function walkAndReplace(dir: string, from: string, to: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAndReplace(fullPath, from, to);
    } else if (entry.isFile()) {
      try {
        replaceInFile(fullPath, from, to);
      } catch {
        // skip binary files
      }
    }
  }
}

function renamePathsContaining(dir: string, from: string, to: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      renamePathsContaining(fullPath, from, to);
    }
    if (entry.name.includes(from)) {
      const newName = entry.name.replace(new RegExp(from, "g"), to);
      fs.renameSync(fullPath, path.join(dir, newName));
    }
  }
}

async function main() {
  const slug = await prompt("Enter your project slug (replaces 'skelly'): ");

  if (!slug || !/^[a-z0-9-_]+$/i.test(slug)) {
    console.error("Invalid slug. Use only letters, numbers, hyphens, or underscores.");
    process.exit(1);
  }

  const destDir = path.resolve(process.cwd(), slug);

  if (fs.existsSync(destDir)) {
    console.error(`Directory '${slug}' already exists.`);
    process.exit(1);
  }

  console.log(`\nCloning skelly-admin template into ./${slug}...`);
  execSync(`git clone ${TEMPLATE_REPO} ${destDir}`, { stdio: "inherit" });

  console.log("Removing .git directory...");
  fs.rmSync(path.join(destDir, ".git"), { recursive: true, force: true });

  console.log(`Replacing all occurrences of 'skelly' with '${slug}'...`);
  walkAndReplace(destDir, "skelly", slug);

  console.log("Renaming files and folders containing 'skelly'...");
  renamePathsContaining(destDir, "skelly", slug);

  console.log(`\nDone! Your new project is ready at ./${slug}`);
  console.log("Next steps:");
  console.log(`  cd ${slug}`);
  console.log("  git init");
  console.log("  npm install  (or bun install)");
}

main();
