/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration specific to the Next.js development server
  allowedDevOrigins: [
    "https://unloyal-grayce-nonnecessitously.ngrok-free.dev",
    // "http://unloyal-grayce-nonnecessitously.ngrok-free.dev",
    // Include any other development domains if necessary
  ],
  dev: {
    // Explicitly allow requests coming from your ngrok domain during development.
    // This resolves the "Cross origin request detected" warning.
    allowedDevOrigins: [
      "https://unloyal-grayce-nonnecessitously.ngrok-free.dev",
      "http://localhost:8000"
      // "http://unloyal-grayce-nonnecessitously.ngrok-free.dev",
      // Include any other development domains if necessary
    ],
  },
};

export default nextConfig;
