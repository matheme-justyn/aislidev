/**
 * Theme Configuration Types
 * 
 * Defines the structure of theme.yaml configuration files.
 */

/**
 * Theme type - either NPM package or custom theme
 */
export type ThemeType = 'npm' | 'custom';

/**
 * Color schema - light, dark, or auto
 */
export type ColorSchema = 'light' | 'dark' | 'auto';

/**
 * Custom font file configuration
 */
export interface CustomFontFile {
  path: string;      // Relative path from theme directory (e.g., "assets/font.woff2")
  weight?: number;   // Font weight (e.g., 400, 700)
  style?: 'normal' | 'italic';
}

/**
 * Custom font configuration
 */
export interface CustomFont {
  name: string;           // Display name
  family: string;         // CSS font-family name
  files: CustomFontFile[]; // Font files
}

/**
 * Font configuration
 */
export interface FontsConfig {
  sans?: string;    // Sans-serif font stack
  serif?: string;   // Serif font stack
  mono?: string;    // Monospace font stack
  custom?: CustomFont[]; // Custom font files
}

/**
 * Color configuration - maps to CSS variables
 */
export interface ColorsConfig {
  // Primary colors
  primary?: string;
  accent?: string;
  
  // Background colors
  background?: string;
  backgroundAlt?: string;
  
  // Text colors
  text?: string;
  textSecondary?: string;
  textMuted?: string;
  
  // Code colors
  codeBackground?: string;
  codeForeground?: string;
  
  // Border colors
  border?: string;
  
  // Allow additional custom colors
  [key: string]: string | undefined;
}

/**
 * Font size configuration (in rem)
 */
export interface FontSizesConfig {
  h1?: number;
  h2?: number;
  h3?: number;
  h4?: number;
  body?: number;
  code?: number;
}

/**
 * Spacing configuration (in rem)
 */
export interface SpacingConfig {
  slidesPadding?: number;
  elementGap?: number;
}

/**
 * Background images configuration
 */
export interface BackgroundsConfig {
  default?: string;  // Default background
  cover?: string;    // Cover page background
  [key: string]: string | undefined; // Allow custom backgrounds
}

/**
 * NPM Theme Configuration (Type A - Proxy)
 */
export interface NpmThemeConfig {
  // Required: NPM package name
  npm: string;
  
  // Optional: Override configurations
  colors?: ColorsConfig;
  fonts?: FontsConfig;
  fontSizes?: FontSizesConfig;
  spacing?: SpacingConfig;
}

/**
 * Custom Theme Configuration (Type B - Full)
 */
export interface CustomThemeConfig {
  // Metadata
  name: string;
  description?: string;
  author?: string;
  version?: string;
  
  // Color schema
  colorSchema?: ColorSchema;
  
  // Configuration
  colors?: ColorsConfig;
  fonts?: FontsConfig;
  fontSizes?: FontSizesConfig;
  spacing?: SpacingConfig;
  backgrounds?: BackgroundsConfig;
  
  // Advanced: Custom CSS file
  customCSS?: string;
  
  // Future: Layout configuration
  // layouts?: LayoutsConfig;
}

/**
 * Union type for theme configuration
 */
export type ThemeConfig = NpmThemeConfig | CustomThemeConfig;

/**
 * Type guard to check if config is NPM theme
 */
export function isNpmTheme(config: ThemeConfig): config is NpmThemeConfig {
  return 'npm' in config;
}

/**
 * Type guard to check if config is custom theme
 */
export function isCustomTheme(config: ThemeConfig): config is CustomThemeConfig {
  return 'name' in config;
}

/**
 * Theme metadata for API responses
 */
export interface ThemeMetadata {
  id: string;           // Theme folder name
  name: string;         // Display name
  description: string;  // Description
  type: 'builtin' | 'npm' | 'custom'; // Theme type
  npm?: string;         // NPM package name (for NPM themes)
  path: string;         // Relative path for Slidev
}

/**
 * Default values for theme configuration
 */
export const DEFAULT_THEME_CONFIG: Required<Omit<CustomThemeConfig, 'name' | 'customCSS' | 'backgrounds'>> = {
  description: '',
  author: '',
  version: '1.0.0',
  colorSchema: 'light',
  colors: {
    primary: '#3b82f6',
    accent: '#8b5cf6',
    background: '#ffffff',
    backgroundAlt: '#f9fafb',
    text: '#1f2937',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    codeBackground: '#f3f4f6',
    codeForeground: '#1f2937',
    border: '#e5e7eb',
  },
  fonts: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: '"Fira Code", "Cascadia Code", Menlo, Monaco, "Courier New", monospace',
  },
  fontSizes: {
    h1: 3.5,
    h2: 2.5,
    h3: 2.0,
    h4: 1.5,
    body: 1.0,
    code: 0.9,
  },
  spacing: {
    slidesPadding: 2.0,
    elementGap: 1.0,
  },
};
