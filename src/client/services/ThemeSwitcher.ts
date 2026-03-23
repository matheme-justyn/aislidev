/**
 * Theme Switcher Service
 * Handles theme switching by modifying only the frontmatter theme field
 * while preserving all slide content
 */

export class ThemeSwitcher {
  /**
   * Apply a theme to markdown content
   * @param markdown - Original markdown content
   * @param themeName - Theme name to apply (e.g., 'default', 'seriph', 'professional-dark')
   * @returns Modified markdown with new theme
   */
  static applyTheme(markdown: string, themeName: string): string {
    // Check if markdown has frontmatter
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);

    if (!match) {
      // No frontmatter, add one with theme
      return `---\ntheme: ${themeName}\n---\n\n${markdown}`;
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
        newLines.push(`theme: ${themeName}`);
        themeFound = true;
      } else {
        newLines.push(line);
      }
    }

    // If theme wasn't found, add it at the beginning
    if (!themeFound) {
      newLines.unshift(`theme: ${themeName}`);
    }

    // Reconstruct markdown
    return `---\n${newLines.join('\n')}\n---\n${slideContent}`;
  }

  /**
   * Get current theme from markdown
   * @param markdown - Markdown content
   * @returns Current theme name or 'default' if not specified
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
   * Get list of available themes
   * @returns Array of theme objects with name and display name
   */
  static getAvailableThemes(): Array<{ name: string; display: string; description: string }> {
    return [
      {
        name: 'default',
        display: 'Default',
        description: 'Slidev default theme - clean and versatile'
      },
      {
        name: 'seriph',
        display: 'Seriph',
        description: 'Elegant serif font theme'
      },
      {
        name: '../../themes/theme-professional-dark',
        display: 'Professional Dark',
        description: 'Dark theme optimized for business presentations'
      },
      {
        name: '../../themes/theme-creative-gradient',
        display: 'Creative Gradient',
        description: 'Vibrant gradient theme for creative presentations'
      },
      {
        name: '../../themes/theme-minimal-clean',
        display: 'Minimal Clean',
        description: 'Ultra-minimal theme focused on content'
      }
    ];
  }
}
