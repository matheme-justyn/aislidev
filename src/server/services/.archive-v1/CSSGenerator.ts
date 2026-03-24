/**
 * CSS Generator Service
 * 
 * Generates CSS from theme YAML configurations
 */

import {
  CustomThemeConfig,
  ColorsConfig,
  FontsConfig,
  CustomFont,
  FontSizesConfig,
  SpacingConfig,
} from '../../types/theme.js';
import { ThemeLoader } from './ThemeLoader.js';

export class CSSGenerator {
  /**
   * Generate complete CSS from custom theme configuration
   */
  static generateCSS(config: CustomThemeConfig): string {
    // Merge with defaults
    const fullConfig = ThemeLoader.mergeWithDefaults(config);
    
    const sections: string[] = [
      '/* Generated from theme.yaml */',
      '',
      this.generateCSSVariables(fullConfig.colors, fullConfig.fonts, fullConfig.fontSizes, fullConfig.spacing),
    ];
    
    // Add custom font faces if provided
    if (fullConfig.fonts.custom && fullConfig.fonts.custom.length > 0) {
      sections.push('');
      sections.push(this.generateFontFaces(fullConfig.fonts.custom));
    }
    
    // Add base styles
    sections.push('');
    sections.push(this.generateBaseStyles());
    
    return sections.join('\n');
  }
  
  /**
   * Generate CSS variables from configuration
   */
  static generateCSSVariables(
    colors: ColorsConfig,
    fonts: FontsConfig,
    fontSizes: FontSizesConfig,
    spacing: SpacingConfig,
  ): string {
    const vars: string[] = [':root {'];
    
    // Color variables
    Object.entries(colors).forEach(([key, value]) => {
      const varName = `--slidev-theme-${this.kebabCase(key)}`;
      vars.push(`  ${varName}: ${value};`);
    });
    
    // Font variables
    if (fonts.sans) {
      vars.push(`  --slidev-font-sans: ${fonts.sans};`);
    }
    if (fonts.serif) {
      vars.push(`  --slidev-font-serif: ${fonts.serif};`);
    }
    if (fonts.mono) {
      vars.push(`  --slidev-font-mono: ${fonts.mono};`);
    }
    
    // Font size variables
    Object.entries(fontSizes).forEach(([key, value]) => {
      const varName = `--slidev-font-size-${this.kebabCase(key)}`;
      vars.push(`  ${varName}: ${value}rem;`);
    });
    
    // Spacing variables
    Object.entries(spacing).forEach(([key, value]) => {
      const varName = `--slidev-spacing-${this.kebabCase(key)}`;
      vars.push(`  ${varName}: ${value}rem;`);
    });
    
    vars.push('}');
    return vars.join('\n');
  }
  
  /**
   * Generate @font-face declarations for custom fonts
   */
  static generateFontFaces(customFonts: CustomFont[]): string {
    const fontFaces: string[] = [];
    
    customFonts.forEach(font => {
      font.files.forEach(file => {
        fontFaces.push('@font-face {');
        fontFaces.push(`  font-family: '${font.family}';`);
        fontFaces.push(`  src: url('${file.path}');`);
        
        if (file.weight) {
          fontFaces.push(`  font-weight: ${file.weight};`);
        }
        if (file.style) {
          fontFaces.push(`  font-style: ${file.style};`);
        }
        
        fontFaces.push('}');
        fontFaces.push('');
      });
    });
    
    return fontFaces.join('\n');
  }
  
  /**
   * Generate base styles applying the theme
   */
  private static generateBaseStyles(): string {
    const styles: string[] = [
      '/* Base layout styles */',
      '.slidev-layout {',
      '  background-color: var(--slidev-theme-background);',
      '  color: var(--slidev-theme-text);',
      '  font-family: var(--slidev-font-sans);',
      '  line-height: 1.6;',
      '}',
      '',
      '/* Headings */',
      'h1 {',
      '  font-size: var(--slidev-font-size-h1);',
      '  font-weight: 600;',
      '  color: var(--slidev-theme-text);',
      '  margin-bottom: 1.5rem;',
      '  line-height: 1.2;',
      '}',
      '',
      'h2 {',
      '  font-size: var(--slidev-font-size-h2);',
      '  font-weight: 500;',
      '  color: var(--slidev-theme-primary);',
      '  margin-bottom: 1.25rem;',
      '  line-height: 1.3;',
      '}',
      '',
      'h3 {',
      '  font-size: var(--slidev-font-size-h3);',
      '  font-weight: 500;',
      '  color: var(--slidev-theme-text);',
      '  margin-bottom: 1rem;',
      '}',
      '',
      'h4 {',
      '  font-size: var(--slidev-font-size-h4);',
      '  font-weight: 500;',
      '  color: var(--slidev-theme-text-secondary);',
      '  margin-bottom: 0.75rem;',
      '}',
      '',
      '/* Text */',
      'p {',
      '  font-size: var(--slidev-font-size-body);',
      '  margin-bottom: 1rem;',
      '  color: var(--slidev-theme-text);',
      '}',
      '',
      'a {',
      '  color: var(--slidev-theme-primary);',
      '  text-decoration: underline;',
      '}',
      '',
      'a:hover {',
      '  color: var(--slidev-theme-accent);',
      '}',
      '',
      '/* Code */',
      'code {',
      '  font-family: var(--slidev-font-mono);',
      '  font-size: var(--slidev-font-size-code);',
      '  background-color: var(--slidev-theme-code-background);',
      '  color: var(--slidev-theme-code-foreground);',
      '  padding: 0.2em 0.4em;',
      '  border-radius: 0.25rem;',
      '}',
      '',
      'pre {',
      '  background-color: var(--slidev-theme-code-background);',
      '  border: 1px solid var(--slidev-theme-border);',
      '  border-radius: 0.5rem;',
      '  padding: 1rem;',
      '  overflow-x: auto;',
      '}',
      '',
      'pre code {',
      '  background: none;',
      '  padding: 0;',
      '}',
      '',
      '/* Lists */',
      'ul, ol {',
      '  margin-left: 1.5rem;',
      '  margin-bottom: 1rem;',
      '  color: var(--slidev-theme-text);',
      '}',
      '',
      'li {',
      '  margin-bottom: 0.5rem;',
      '}',
      '',
      '/* Blockquote */',
      'blockquote {',
      '  border-left: 4px solid var(--slidev-theme-primary);',
      '  padding-left: 1rem;',
      '  margin: 1rem 0;',
      '  color: var(--slidev-theme-text-secondary);',
      '  font-style: italic;',
      '}',
      '',
      '/* Tables */',
      'table {',
      '  width: 100%;',
      '  border-collapse: collapse;',
      '  margin: 1rem 0;',
      '}',
      '',
      'th, td {',
      '  border: 1px solid var(--slidev-theme-border);',
      '  padding: 0.5rem;',
      '  text-align: left;',
      '}',
      '',
      'th {',
      '  background-color: var(--slidev-theme-background-alt);',
      '  font-weight: 600;',
      '  color: var(--slidev-theme-text);',
      '}',
      '',
      'tr:nth-child(even) {',
      '  background-color: var(--slidev-theme-background-alt);',
      '}',
    ];
    
    return styles.join('\n');
  }
  
  /**
   * Convert camelCase to kebab-case
   */
  private static kebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }
}
