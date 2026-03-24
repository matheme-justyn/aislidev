/**
 * NPM Theme Manager Service
 * 
 * Manages NPM theme installation and status checking
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

export interface NPMThemeStatus {
  packageName: string;
  installed: boolean;
  version?: string;
}

export class NPMThemeManager {
  private projectRoot: string;
  
  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }
  
  /**
   * Check if an NPM package is installed
   */
  async isPackageInstalled(packageName: string): Promise<boolean> {
    try {
      const packageJsonPath = path.join(
        this.projectRoot,
        'node_modules',
        packageName,
        'package.json'
      );
      
      await fs.access(packageJsonPath);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Get installed package version
   */
  async getPackageVersion(packageName: string): Promise<string | null> {
    try {
      const packageJsonPath = path.join(
        this.projectRoot,
        'node_modules',
        packageName,
        'package.json'
      );
      
      const content = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(content);
      return packageJson.version || null;
    } catch {
      return null;
    }
  }
  
  /**
   * Get NPM theme status
   */
  async getThemeStatus(packageName: string): Promise<NPMThemeStatus> {
    const installed = await this.isPackageInstalled(packageName);
    
    if (installed) {
      const version = await this.getPackageVersion(packageName);
      return {
        packageName,
        installed: true,
        version: version || undefined,
      };
    }
    
    return {
      packageName,
      installed: false,
    };
  }
  
  /**
   * Install NPM package
   */
  async installPackage(packageName: string): Promise<{
    success: boolean;
    error?: string;
    stdout?: string;
    stderr?: string;
  }> {
    try {
      console.log(`Installing NPM package: ${packageName}`);
      
      // Use npm install with specific package
      const { stdout, stderr } = await execAsync(
        `npm install ${packageName}`,
        {
          cwd: this.projectRoot,
          timeout: 120000, // 2 minutes timeout
        }
      );
      
      console.log(`Successfully installed ${packageName}`);
      
      return {
        success: true,
        stdout,
        stderr,
      };
    } catch (error: any) {
      console.error(`Failed to install ${packageName}:`, error);
      
      return {
        success: false,
        error: error.message,
        stdout: error.stdout,
        stderr: error.stderr,
      };
    }
  }
  
  /**
   * Uninstall NPM package
   */
  async uninstallPackage(packageName: string): Promise<{
    success: boolean;
    error?: string;
    stdout?: string;
    stderr?: string;
  }> {
    try {
      console.log(`Uninstalling NPM package: ${packageName}`);
      
      const { stdout, stderr } = await execAsync(
        `npm uninstall ${packageName}`,
        {
          cwd: this.projectRoot,
          timeout: 60000, // 1 minute timeout
        }
      );
      
      console.log(`Successfully uninstalled ${packageName}`);
      
      return {
        success: true,
        stdout,
        stderr,
      };
    } catch (error: any) {
      console.error(`Failed to uninstall ${packageName}:`, error);
      
      return {
        success: false,
        error: error.message,
        stdout: error.stdout,
        stderr: error.stderr,
      };
    }
  }
  
  /**
   * Check and install NPM theme if needed
   */
  async ensureThemeInstalled(packageName: string): Promise<NPMThemeStatus> {
    const status = await this.getThemeStatus(packageName);
    
    if (status.installed) {
      console.log(`NPM theme ${packageName} is already installed (v${status.version})`);
      return status;
    }
    
    console.log(`NPM theme ${packageName} not found, installing...`);
    
    const installResult = await this.installPackage(packageName);
    
    if (!installResult.success) {
      throw new Error(`Failed to install ${packageName}: ${installResult.error}`);
    }
    
    // Return updated status
    return await this.getThemeStatus(packageName);
  }
  
  /**
   * List all installed Slidev themes
   */
  async listInstalledSlidevThemes(): Promise<Array<{
    packageName: string;
    version: string;
  }>> {
    try {
      const nodeModulesPath = path.join(this.projectRoot, 'node_modules');
      const themes: Array<{ packageName: string; version: string }> = [];
      
      // Check @slidev scope
      const slidevScopePath = path.join(nodeModulesPath, '@slidev');
      
      try {
        const scopeEntries = await fs.readdir(slidevScopePath);
        
        for (const entry of scopeEntries) {
          if (entry.startsWith('theme-')) {
            const packageName = `@slidev/${entry}`;
            const version = await this.getPackageVersion(packageName);
            
            if (version) {
              themes.push({ packageName, version });
            }
          }
        }
      } catch {
        // @slidev scope doesn't exist
      }
      
      // Check root level slidev-theme-* packages
      try {
        const rootEntries = await fs.readdir(nodeModulesPath);
        
        for (const entry of rootEntries) {
          if (entry.startsWith('slidev-theme-')) {
            const version = await this.getPackageVersion(entry);
            
            if (version) {
              themes.push({ packageName: entry, version });
            }
          }
        }
      } catch {
        // No root themes
      }
      
      return themes;
    } catch (error) {
      console.error('Failed to list installed Slidev themes:', error);
      return [];
    }
  }
}
