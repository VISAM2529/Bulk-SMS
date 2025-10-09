"use client";
import { useEffect, useState } from "react";

interface MediaUploadProps {
  onUpload: (url: string) => void;
}

export default function MediaUpload({ onUpload }: MediaUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Cloudinary widget script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openUploadWidget = () => {
    if (!window.cloudinary) {
      setError("Cloudinary widget not loaded");
      return;
    }

    setLoading(true);
    setError(null);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError("Cloudinary configuration missing");
      setLoading(false);
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ["local", "url", "camera"],
        multiple: false,
        resourceType: "auto", // Supports images and videos
        clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "mp4", "mov"],
        maxFileSize: 16000000, // 16MB, matching Twilio's limit
      },
      (error: any, result: any) => {
        if (error) {
          setError("Upload failed: " + error.message);
          setLoading(false);
          return;
        }
        if (result.event === "success") {
          onUpload(result.info.secure_url);
          setLoading(false);
        }
      }
    );

    widget.open();
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={openUploadWidget}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Media"}
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}