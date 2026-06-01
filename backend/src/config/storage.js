// src/config/storage.js
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  // Cloud Run otomatis menggunakan service account yang sedang berjalan
});

const bucket = storage.bucket(
  process.env.GCS_BUCKET_NAME || "camping-rental-photos",
);

module.exports = { storage, bucket };
