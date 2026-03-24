/**
 * Theme Switcher Service
 * Handles theme switching by modifying only the frontmatter theme field
 * while preserving all slide content
 * 
 * Supports:
 * - NPM themes: '@slidev/theme-seriph'
 * - Local Slidev themes: '../themes/my-theme'
 */

export class ThemeSwitcher {
  /**
   * Apply a theme to markdown content
   * @param markdown - Original markdown content
   * @param themePath - Theme path (NPM package or relative path)
   * @returns Modified markdown with new theme
   */
  static applyTheme(markdown: string, themePath: string): string {
    // Check if markdown has frontmatter
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);

    if (!match) {
      // No frontmatter, add one with theme
      return `---\ntheme: '${themePath}'\n---\n\n${markdown}`;
    }

    const [, frontmatterContent, slideContent] = match;

    // Parse frontmatter YAML manually (simple key-value parsing)
    const lines = frontmatterContent.split('\n');
    let themeFound = false;
    const newLines: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check if this line defines theme
      if (trimmedLine.startsWith('theme:')) {
        newLines.push(`theme: '${themePath}'`);
        themeFound = true;
      } else {
        newLines.push(line);
      }
    }

    // If theme wasn't found, add it at the beginning
    if (!themeFound) {
      newLines.unshift(`theme: '${themePath}'`);
    }

    // Reconstruct markdown
    return `---\n${newLines.join('\n')}\n---\n${slideContent}`;
  }

  /**
   * Get current theme from markdown
   * @param markdown - Markdown content
   * @returns Current theme name/path or 'default' if not specified
   */
  static getCurrentTheme(markdown: string): string {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = markdown.match(frontmatterRegex);

    if (!match) {
      return 'default';
    }

    const frontmatterContent = match[1];
    const themeMatch = frontmatterContent.match(/^theme:\s*(.+)$/m);

    return themeMatch ? themeMatch[1].trim() : 'default';
  }

  /**
   * Get list of available themes from server
   * @returns Promise with array of theme objects
   */
  static async getAvailableThemes(): Promise<
    Array<{ 
      name: string; 
      display: string; 
      description: string; 
      type: 'npm' | 'custom' | 'local-slidev';
      themePath?: string;
    }> | null
  > {
    try {
      const response = await fetch('/api/files/themes');
      
      if (!response.ok) {
        console.error('Failed to fetch themes:', response.statusText);
        return null;
      }
      
      const data = await response.json();
      return data.themes;
    } catch (error) {
      console.error('Failed to load themes:', error);
      return null;
    }
  }
}
