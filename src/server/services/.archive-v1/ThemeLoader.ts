/**
 * Theme Loader Service
 * 
 * Loads and validates theme configurations from theme.yaml files
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';
import {
  ThemeConfig,
  NpmThemeConfig,
  CustomThemeConfig,
  isNpmTheme,
  isCustomTheme,
  DEFAULT_THEME_CONFIG,
} from '../../types/theme.js';

export class ThemeLoader {
  private themesDir: string;
  
  constructor(themesDir: string) {
    this.themesDir = themesDir;
  }
  /**
   * Load theme configuration from a theme directory
   */
  static async loadTheme(themePath: string): Promise<ThemeConfig> {
    const yamlPath = path.join(themePath, 'theme.yaml');
    
    try {
      const yamlContent = await fs.readFile(yamlPath, 'utf-8');
      const config = yaml.load(yamlContent) as any;
      
      return this.validateThemeConfig(config);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`Theme configuration not found: ${yamlPath}`);
      }
      throw new Error(`Failed to load theme: ${(error as Error).message}`);
    }
  }
  
  /**
   * Validate theme configuration
   */
  static validateThemeConfig(config: any): ThemeConfig {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid theme configuration: must be an object');
    }
    
    // Check if it's NPM theme (Type A)
    if ('npm' in config) {
      return this.validateNpmTheme(config);
    }
    
    // Check if it's custom theme (Type B)
    if ('name' in config) {
      return this.validateCustomTheme(config);
    }
    
    throw new Error('Invalid theme configuration: must have either "npm" or "name" field');
  }
  
  /**
   * Validate NPM theme configuration
   */
  private static validateNpmTheme(config: any): NpmThemeConfig {
    if (typeof config.npm !== 'string' || config.npm.trim() === '') {
      throw new Error('Invalid NPM theme: "npm" field must be a non-empty string');
    }
    
    const npmTheme: NpmThemeConfig = {
      npm: config.npm.trim(),
    };
    
    // Optional overrides
    if (config.colors) {
      npmTheme.colors = config.colors;
    }
    if (config.fonts) {
      npmTheme.fonts = config.fonts;
    }
    if (config.fontSizes) {
      npmTheme.fontSizes = config.fontSizes;
    }
    if (config.spacing) {
      npmTheme.spacing = config.spacing;
    }
    
    return npmTheme;
  }
  
  /**
   * Validate custom theme configuration
   */
  private static validateCustomTheme(config: any): CustomThemeConfig {
    if (typeof config.name !== 'string' || config.name.trim() === '') {
      throw new Error('Invalid custom theme: "name" field must be a non-empty string');
    }
    
    const customTheme: CustomThemeConfig = {
      name: config.name.trim(),
      description: config.description || '',
      author: config.author || '',
      version: config.version || '1.0.0',
      colorSchema: this.validateColorSchema(config.colorSchema),
    };
    
    // Optional configurations
    if (config.colors) {
      customTheme.colors = config.colors;
    }
    if (config.fonts) {
      customTheme.fonts = config.fonts;
    }
    if (config.fontSizes) {
      customTheme.fontSizes = config.fontSizes;
    }
    if (config.spacing) {
      customTheme.spacing = config.spacing;
    }
    if (config.backgrounds) {
      customTheme.backgrounds = config.backgrounds;
    }
    if (config.customCSS) {
      customTheme.customCSS = config.customCSS;
    }
    
    return customTheme;
  }
  
  /**
   * Validate color schema
   */
  private static validateColorSchema(value: any): 'light' | 'dark' | 'auto' {
    if (!value) return 'light';
    
    if (value === 'light' || value === 'dark' || value === 'auto') {
      return value;
    }
    
    throw new Error(`Invalid colorSchema: must be "light", "dark", or "auto", got "${value}"`);
  }
  
  /**
   * Check if theme configuration is NPM theme
   */
  static isNpmTheme(config: ThemeConfig): config is NpmThemeConfig {
    return isNpmTheme(config);
  }
  
  /**
   * Check if theme configuration is custom theme
   */
  static isCustomTheme(config: ThemeConfig): config is CustomThemeConfig {
    return isCustomTheme(config);
  }
  
  /**
   * Merge theme config with defaults
   */
  static mergeWithDefaults(config: CustomThemeConfig): Required<CustomThemeConfig> {
    return {
      name: config.name,
      description: config.description || DEFAULT_THEME_CONFIG.description,
      author: config.author || DEFAULT_THEME_CONFIG.author,
      version: config.version || DEFAULT_THEME_CONFIG.version,
      colorSchema: config.colorSchema || DEFAULT_THEME_CONFIG.colorSchema,
      colors: { ...DEFAULT_THEME_CONFIG.colors, ...config.colors },
      fonts: { ...DEFAULT_THEME_CONFIG.fonts, ...config.fonts },
      fontSizes: { ...DEFAULT_THEME_CONFIG.fontSizes, ...config.fontSizes },
      spacing: { ...DEFAULT_THEME_CONFIG.spacing, ...config.spacing },
      backgrounds: config.backgrounds || {},
      customCSS: config.customCSS || '',
    };
  }
  
  /**
   * List all available themes
   */
  async listThemes(): Promise<Array<{
    name: string;
    display: string;
    description: string;
    type: 'npm' | 'custom' | 'local-slidev';
    themePath?: string;
  }>> {
    try {
      const themes: Array<{
        name: string;
        display: string;
        description: string;
        type: 'npm' | 'custom' | 'local-slidev';
        themePath?: string;
      }> = [];
      
      // Scan themes directory
      const themeNames = await fs.readdir(this.themesDir);
      
      for (const themeName of themeNames) {
        // Skip hidden files and templates
        if (themeName.startsWith('.')) {
          continue;
        }
        
        const themePath = path.join(this.themesDir, themeName);
        
        try {
          const stat = await fs.stat(themePath);
          
          // Skip if not a directory
          if (!stat.isDirectory()) {
            continue;
          }
          
          // Check for Slidev v2 theme (package.json + styles/)
          const packageJsonPath = path.join(themePath, 'package.json');
          const stylesPath = path.join(themePath, 'styles');
          
          try {
            await fs.access(packageJsonPath);
            await fs.access(stylesPath);
            
            // This is a Slidev v2 theme
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
            themes.push({
              name: themeName,
              display: packageJson.name?.replace(/^slidev-theme-/, '') || themeName,
              description: packageJson.description || `Local Slidev theme: ${themeName}`,
              type: 'local-slidev',
              themePath: `../themes/${themeName}`,
            });
            continue;
          } catch {
            // Not a Slidev v2 theme, try v1 YAML format
          }
          
          // Try loading v1 YAML theme
          const config = await ThemeLoader.loadTheme(themePath);
          
          // Extract metadata
          if (ThemeLoader.isNpmTheme(config)) {
            themes.push({
              name: themeName,
              display: themeName
                .replace(/^theme-/, '')
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
              description: `NPM Theme: ${config.npm}`,
              type: 'npm',
              themePath: config.npm,
            });
          } else if (ThemeLoader.isCustomTheme(config)) {
            themes.push({
              name: themeName,
              display: config.name,
              description: config.description || `Custom theme: ${themeName}`,
              type: 'custom',
            });
          }
        } catch (error) {
          // Skip invalid themes
          console.warn(`Skipping theme ${themeName}: ${(error as Error).message}`);
        }
      }
      
      return themes;
    } catch (error) {
      throw new Error(`Failed to list themes: ${(error as Error).message}`);
    }
  }
}
