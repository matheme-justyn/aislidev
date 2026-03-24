/**
 * Theme Loader Service v2
 *
 * Loads Slidev-native themes (package.json + styles/index.css)
 */

import * as fs from "fs/promises";
import * as path from "path";

export interface ThemeInfo {
  id: string;
  name: string;
  description: string;
  type: "local-slidev" | "npm";
  themePath: string;
}

export class ThemeLoaderV2 {
  private themesDir: string;

  constructor(themesDir: string) {
    this.themesDir = themesDir;
  }

  async listThemes(): Promise<ThemeInfo[]> {
    const themes: ThemeInfo[] = [];

    try {
      const entries = await fs.readdir(this.themesDir, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (entry.name.startsWith(".")) continue;

        const themePath = path.join(this.themesDir, entry.name);
        const packageJsonPath = path.join(themePath, "package.json");

        try {
          const packageJsonContent = await fs.readFile(
            packageJsonPath,
            "utf-8",
          );
          const packageJson = JSON.parse(packageJsonContent);

          const relativeThemePath = `../themes/${entry.name}`;

          themes.push({
            id: entry.name,
            name: packageJson.name || entry.name,
            description: packageJson.description || "",
            type: "local-slidev",
            themePath: relativeThemePath,
          });
        } catch (error) {
          console.warn(
            `Skipping ${entry.name}: not a valid v2 theme (no package.json)`,
          );
        }
      }

      return themes;
    } catch (error) {
      throw new Error(`Failed to list themes: ${(error as Error).message}`);
    }
  }
}
