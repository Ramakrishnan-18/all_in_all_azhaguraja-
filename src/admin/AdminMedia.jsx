import MediaUploader from "../components/MediaUploader";

export default function AdminMedia() {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display text-3xl mb-1">Media Library</h1>
      <p className="text-slate-soft text-sm mb-8">
        Upload photography and video assets here, then attach them to a project from the project editor.
      </p>
      <div className="flex flex-col gap-8">
        <div>
          <p className="eyebrow text-studio-blue mb-3">Photography</p>
          <MediaUploader label="Upload photos" />
        </div>
        <div>
          <p className="eyebrow text-studio-blue mb-3">Videography</p>
          <MediaUploader label="Upload videos or reels" />
        </div>
      </div>
    </div>
  );
}
