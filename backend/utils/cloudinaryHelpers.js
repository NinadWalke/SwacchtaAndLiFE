function extractPublicId(url) {
    const parts = url.split('/');
    const filenameWithExt = parts[parts.length - 1]; // e.g., abcd1234.jpg
    const publicId = filenameWithExt.split('.')[0];  // e.g., abcd1234
    return `swacchtaAndLiFE/${publicId}`; // Folder name + publicId
  }
  
module.exports = { extractPublicId };