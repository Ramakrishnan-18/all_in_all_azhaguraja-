import { useCallback, useRef, useState } from "react";
import { UploadCloud, X, FileImage, FileVideo } from "lucide-react";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "video/mp4", "video/quicktime", "video/webm"];

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Drag-and-drop uploader. In production, onFilesReady should push each file to your
// media storage service (e.g. S3 / Cloudinary) and only the returned URL gets saved to MongoDB.
export default function MediaUploader({ label = "Upload media", multiple = true, onFilesReady }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback(
    (fileList) => {
      const accepted = Array.from(fileList).filter((f) => ACCEPTED.includes(f.type));
      const withPreview = accepted.map((file) => ({
        file,
        id: crypto.randomUUID(),
        preview: URL.createObjectURL(file),
        progress: 0,
        status: "uploading",
      }));
      setFiles((prev) => [...prev, ...withPreview]);

      // Simulated upload progress — replace with a real upload call to your media service.
      withPreview.forEach((item) => {
        let pct = 0;
        const interval = setInterval(() => {
          pct += Math.random() * 30;
          setFiles((prev) =>
            prev.map((f) =>
              f.id === item.id
                ? { ...f, progress: Math.min(pct, 100), status: pct >= 100 ? "done" : "uploading" }
                : f
            )
          );
          if (pct >= 100) {
            clearInterval(interval);
            onFilesReady?.(item.file);
          }
        }, 250);
      });
    },
    [onFilesReady]
  );

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));

  return (
    <div>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed px-6 py-10 cursor-pointer transition-colors ${
          dragOver ? "border-studio-blue bg-studio-blue/5" : "border-slate/20 hover:border-studio-blue/50"
        }`}
      >
        <UploadCloud className="text-studio-blue" size={28} />
        <p className="text-sm text-slate-soft text-center">
          <span className="text-studio-blue font-medium">{label}</span> — drag & drop or click to browse
        </p>
        <p className="font-mono text-[11px] text-slate-soft/60">JPG · JPEG · PNG · WEBP · HEIC · MP4 · MOV</p>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </label>

      {files.length > 0 && (
        <ul className="mt-5 flex flex-col gap-3">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-3 border border-slate/10 p-3">
              {f.file.type.startsWith("video") ? (
                <FileVideo size={18} className="text-studio-blue shrink-0" />
              ) : (
                <FileImage size={18} className="text-studio-blue shrink-0" />
              )}
              <img
                src={f.preview}
                alt=""
                className="w-10 h-10 object-cover shrink-0"
                style={{ display: f.file.type.startsWith("video") ? "none" : "block" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{f.file.name}</p>
                <p className="text-xs text-slate-soft">{formatSize(f.file.size)}</p>
                <div className="h-1 bg-slate/10 mt-1.5">
                  <div
                    className={`h-full ${f.status === "done" ? "bg-green-600" : "bg-studio-blue"}`}
                    style={{ width: `${f.progress}%`, transition: "width .2s" }}
                  />
                </div>
              </div>
              <span className="eyebrow text-[10px] text-slate-soft shrink-0">
                {f.status === "done" ? "Uploaded" : `${Math.floor(f.progress)}%`}
              </span>
              <button onClick={() => removeFile(f.id)} aria-label="Remove" className="text-slate-soft hover:text-red-600 shrink-0">
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
