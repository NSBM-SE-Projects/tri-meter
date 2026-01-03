import { BlobServiceClient } from '@azure/storage-blob';
import path from 'path';

class AzureBlobService {
  constructor() {
    // Check if Azure Blob Storage is configured
    if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
      console.warn('AZURE BLOB NOT CONFIGURED. FILE UPLOADS WILL BE DISABLED.');
      this.isConfigured = false;
      return;
    }

    this.isConfigured = true;
    this.connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'customer-id-images';

    // Initialize blob service client
    this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
    this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
  }

// Initialize container (create if doesn't exist)
  async initializeContainer() {
    if (!this.isConfigured) {
      throw new Error('Azure Blob Storage is not configured');
    }

    try {
      // Create container if it doesn't exist (public access for images)
      await this.containerClient.createIfNotExists({
        access: 'blob' // Public read access for blobs
      });
      console.log(`AZURE BLOB CONTAINER "${this.containerName}" IS READY!`);
    } catch (error) {
      console.error('ERROR INITIALIZING AZURE BLOB CONTAINER:', error.message);
      throw error;
    }
  }

  /**
   * Upload a file to Azure Blob Storage
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} identityNumber - Customer NIC/BRN number (e.g., 123456V)
   * @param {string} originalFilename - Original filename (for extension)
   * @param {string} mimeType - File MIME type
   * @returns {Promise<string>} - Blob URL
   */
  async uploadFile(fileBuffer, identityNumber, originalFilename, mimeType) {
    if (!this.isConfigured) {
      throw new Error('Azure Blob Storage is not configured');
    }

    try {
      // Use identity number as filename (e.g., 123456V.jpg)
      const ext = path.extname(originalFilename);
      const blobName = `${identityNumber}${ext}`;

      // Get blob client
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

      // Upload file (will overwrite if exists with same NIC)
      await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
        blobHTTPHeaders: {
          blobContentType: mimeType
        }
      });

      // Return public URL
      return blockBlobClient.url;
    } catch (error) {
      console.error('ERROR UPLOADING FILE TO AZURE BLOB:', error.message);
      throw error;
    }
  }

  /**
   * Delete a file from Azure Blob Storage
   * @param {string} blobUrl - Full blob URL
   * @returns {Promise<boolean>} - Success status
   */
  async deleteFile(blobUrl) {
    if (!this.isConfigured) {
      return false;
    }

    try {
      // Extract blob name from URL
      const url = new URL(blobUrl);
      const blobName = path.basename(url.pathname);

      // Get blob client and delete
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.deleteIfExists();

      return true;
    } catch (error) {
      console.error('ERROR DELETING FILE FROM AZURE BLOB:', error.message);
      return false;
    }
  }

// Check if service is configured
  isReady() {
    return this.isConfigured;
  }
}

export default new AzureBlobService();
