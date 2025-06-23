#!/usr/bin/env node

import process from "node:process";
const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawn } = require('child_process');

const REPO_OWNER = 'bolt-foundry';
const REPO_NAME = 'bolt-foundry';
const BINARY_NAME = 'aibff';

// Platform mapping
const PLATFORM_MAP = {
  'darwin-arm64': 'darwin-aarch64',
  'darwin-x64': 'darwin-x86_64',
  'linux-arm64': 'linux-aarch64',
  'linux-x64': 'linux-x86_64',
  'win32-x64': 'windows-x86_64'
};

function getPlatform() {
  const platform = `${process.platform}-${process.arch}`;
  const mapped = PLATFORM_MAP[platform];
  
  if (!mapped) {
    console.error(`Unsupported platform: ${platform}`);
    console.error('Supported platforms:');
    Object.keys(PLATFORM_MAP).forEach(p => {
      console.error(`  - ${p}`);
    });
    process.exit(1);
  }
  
  return mapped;
}

function getBinaryName(platform) {
  const suffix = platform.startsWith('windows') ? '.exe' : '';
  return `${BINARY_NAME}-${platform}${suffix}`;
}

async function getRelease(version) {
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases/tags/aibff-v${version}`,
    headers: {
      'User-Agent': 'aibff-installer',
      'Accept': 'application/vnd.github.v3+json'
    }
  };

  return new Promise((resolve, reject) => {
    https.get(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 404) {
          reject(new Error(`NOT_FOUND`));
          return;
        }
        
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to get release: ${res.statusCode}`));
          return;
        }
        
        try {
          const release = JSON.parse(data);
          resolve(release);
        } catch (err) {
          reject(new Error(`Failed to parse release data: ${err.message}`));
        }
      });
    }).on('error', reject);
  });
}

async function listReleases() {
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases?per_page=10`,
    headers: {
      'User-Agent': 'aibff-installer',
      'Accept': 'application/vnd.github.v3+json'
    }
  };

  return new Promise((resolve, reject) => {
    https.get(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to list releases: ${res.statusCode}`));
          return;
        }
        
        try {
          const releases = JSON.parse(data);
          resolve(releases);
        } catch (err) {
          reject(new Error(`Failed to parse releases data: ${err.message}`));
        }
      });
    }).on('error', reject);
  });
}

async function downloadBinary(url, destPath) {
  console.log(`Downloading ${BINARY_NAME} from ${url}...`);
  
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        downloadBinary(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloaded = 0;
      
      response.on('data', (chunk) => {
        downloaded += chunk.length;
        const percent = ((downloaded / totalSize) * 100).toFixed(1);
        process.stdout.write(`\rDownloading... ${percent}%`);
      });
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log('\nDownload complete!');
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function install() {
  try {
    // Read version from package.json
    const packagePath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const version = packageJson.version;
    
    console.log(`Installing ${BINARY_NAME} v${version}...`);
    
    const platform = getPlatform();
    const binaryName = getBinaryName(platform);
    const binDir = path.join(__dirname, 'bin');
    const binaryPath = path.join(binDir, BINARY_NAME);
    
    // Create bin directory if it doesn't exist
    if (!fs.existsSync(binDir)) {
      fs.mkdirSync(binDir, { recursive: true });
    }
    
    // Check if binary already exists and is working
    if (fs.existsSync(binaryPath)) {
      try {
        const child = spawn(binaryPath, ['--version'], { stdio: 'pipe' });
        
        return new Promise((resolve) => {
          child.on('exit', (code) => {
            if (code === 0) {
              console.log(`${BINARY_NAME} is already installed and working!`);
              resolve();
            } else {
              // Binary exists but doesn't work, re-download
              downloadAndInstall();
            }
          });
        });
      } catch (err) {
        // Binary exists but can't be executed, re-download
        await downloadAndInstall();
      }
    } else {
      await downloadAndInstall();
    }
    
    async function downloadAndInstall() {
      console.log(`Platform: ${platform}`);
      console.log(`Binary: ${binaryName}`);
      
      // Get specific release
      console.log(`Fetching release v${version}...`);
      let release;
      try {
        release = await getRelease(version);
      } catch (err) {
        if (err.message === 'NOT_FOUND') {
          console.error(`\n❌ Release aibff-v${version} not found on GitHub.`);
          console.error('\nAvailable releases:');
          try {
            const releases = await listReleases();
            const aibffReleases = releases
              .filter(r => r.tag_name.startsWith('aibff-v'))
              .slice(0, 5);
            
            if (aibffReleases.length === 0) {
              console.error('  No aibff releases found.');
            } else {
              aibffReleases.forEach(r => {
                const releaseVersion = r.tag_name.replace('aibff-v', '');
                console.error(`  - ${releaseVersion}`);
              });
            }
            
            console.error(`\nTo use a different version, install with: npm install aibff@<version>`);
          } catch (listErr) {
            console.error('  Failed to list available releases:', listErr.message);
          }
          process.exit(1);
        }
        throw err;
      }
      
      // Find the asset for our platform
      const asset = release.assets.find(a => a.name === binaryName);
      
      if (!asset) {
        throw new Error(`No binary found for platform ${platform} in latest release`);
      }
      
      // Download the binary
      const tempPath = `${binaryPath}.tmp`;
      await downloadBinary(asset.browser_download_url, tempPath);
      
      // Move to final location
      fs.renameSync(tempPath, binaryPath);
      
      // Make executable (on Unix-like systems)
      if (process.platform !== 'win32') {
        fs.chmodSync(binaryPath, '755');
      }
      
      console.log(`\n✅ ${BINARY_NAME} installed successfully!`);
      console.log(`Binary location: ${binaryPath}`);
      
      // Verify installation
      try {
        const child = spawn(binaryPath, ['--version'], { stdio: 'inherit' });
        child.on('exit', (code) => {
          if (code !== 0) {
            console.error('\n⚠️  Warning: Binary installed but version check failed');
          }
        });
      } catch (err) {
        console.error('\n⚠️  Warning: Binary installed but could not be executed');
        console.error('Error:', err.message);
      }
    }
    
  } catch (err) {
    console.error(`\n❌ Installation failed: ${err.message}`);
    process.exit(1);
  }
}

// Run install if called directly
if (require.main === module) {
  install();
}

module.exports = { install };
