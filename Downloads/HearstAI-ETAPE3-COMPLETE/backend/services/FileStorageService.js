// File Storage Service
// Handles file storage for versions

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class FileStorageService {
    constructor() {
        this.storageRoot = path.join(__dirname, '../../storage/projects');
        this.ensureStorageExists();
    }

    /**
     * Ensure storage directory exists
     */
    ensureStorageExists() {
        if (!fs.existsSync(this.storageRoot)) {
            fs.mkdirSync(this.storageRoot, { recursive: true });
        }
    }

    /**
     * Get project storage path
     */
    getProjectPath(projectId) {
        return path.join(this.storageRoot, projectId);
    }

    /**
     * Get version storage path
     */
    getVersionPath(projectId, versionLabel) {
        return path.join(this.getProjectPath(projectId), 'versions', versionLabel);
    }

    /**
     * Save file for a version
     */
    saveFile(projectId, versionLabel, fileName, fileContent) {
        const versionPath = this.getVersionPath(projectId, versionLabel);
        
        // Create directory if doesn't exist
        if (!fs.existsSync(versionPath)) {
            fs.mkdirSync(versionPath, { recursive: true });
        }

        const filePath = path.join(versionPath, fileName);
        
        // Create subdirectories if needed
        const fileDir = path.dirname(filePath);
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
        }

        // Write file
        fs.writeFileSync(filePath, fileContent);

        // Calculate hash
        const hash = this.calculateHash(fileContent);

        return {
            path: fileName,
            storage_path: filePath,
            size_bytes: Buffer.byteLength(fileContent),
            content_hash: hash
        };
    }

    /**
     * Read file from version
     */
    readFile(projectId, versionLabel, fileName) {
        const filePath = path.join(this.getVersionPath(projectId, versionLabel), fileName);
        
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${fileName}`);
        }

        return fs.readFileSync(filePath);
    }

    /**
     * List files in version
     */
    listFiles(projectId, versionLabel) {
        const versionPath = this.getVersionPath(projectId, versionLabel);
        
        if (!fs.existsSync(versionPath)) {
            return [];
        }

        return this.getFilesRecursive(versionPath, versionPath);
    }

    /**
     * Get files recursively
     */
    getFilesRecursive(dir, baseDir) {
        const files = [];
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                files.push(...this.getFilesRecursive(fullPath, baseDir));
            } else {
                const relativePath = path.relative(baseDir, fullPath);
                files.push({
                    path: relativePath,
                    size: stat.size,
                    modified: stat.mtime
                });
            }
        }

        return files;
    }

    /**
     * Copy version files
     */
    copyVersion(projectId, fromVersionLabel, toVersionLabel) {
        const fromPath = this.getVersionPath(projectId, fromVersionLabel);
        const toPath = this.getVersionPath(projectId, toVersionLabel);

        if (!fs.existsSync(fromPath)) {
            throw new Error(`Source version not found: ${fromVersionLabel}`);
        }

        this.copyRecursive(fromPath, toPath);
    }

    /**
     * Copy directory recursively
     */
    copyRecursive(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const items = fs.readdirSync(src);

        for (const item of items) {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);
            const stat = fs.statSync(srcPath);

            if (stat.isDirectory()) {
                this.copyRecursive(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    /**
     * Delete version files
     */
    deleteVersion(projectId, versionLabel) {
        const versionPath = this.getVersionPath(projectId, versionLabel);
        
        if (fs.existsSync(versionPath)) {
            fs.rmSync(versionPath, { recursive: true, force: true });
        }
    }

    /**
     * Calculate file hash
     */
    calculateHash(content) {
        return crypto.createHash('sha256').update(content).digest('hex');
    }

    /**
     * Get storage stats for project
     */
    getProjectStats(projectId) {
        const projectPath = this.getProjectPath(projectId);
        
        if (!fs.existsSync(projectPath)) {
            return { totalSize: 0, fileCount: 0 };
        }

        let totalSize = 0;
        let fileCount = 0;

        const calculateSize = (dir) => {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    calculateSize(fullPath);
                } else {
                    totalSize += stat.size;
                    fileCount++;
                }
            }
        };

        calculateSize(projectPath);

        return { totalSize, fileCount };
    }
}

module.exports = new FileStorageService();
