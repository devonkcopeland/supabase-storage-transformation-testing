import { useEffect, useState } from "react";
import { supabase } from "./App";
import { Editor } from "@monaco-editor/react";

function StorageTestFileDownloadButton({
  imageId,
  transform,
}: {
  imageId: string;
  transform: boolean;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setImageSize(null);
    setImageUrl(null);
  }, [imageId]);

  const handleDownload = async () => {
    const link = document.createElement("a");
    link.href = imageUrl ?? "";
    link.download = "image.png";
    link.click();
  };

  async function getImageWithTransform() {
    return await supabase.storage.from("testing").download(imageId, {
      transform: {
        width: 100,
        resize: "contain",
        quality: 20,
      },
    });
  }

  async function getImageWithoutTransform() {
    return await supabase.storage.from("testing").download(imageId);
  }

  const handleGetImage = async () => {
    setLoading(true);
    setImageSize(null);
    setImageUrl(null);
    const { data, error } = await (transform
      ? getImageWithTransform()
      : getImageWithoutTransform());
    if (error) {
      console.error(error);
      return;
    }
    const blob = new Blob([data], { type: data.type });
    const url = URL.createObjectURL(blob);
    setImageUrl(url);
    setImageSize(blob.size);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-1 w-full">
      <div className="font-bold text-lg inline">
        <span>Download </span>
        <span className="underline">{transform ? "With" : "Without"}</span>
        <span> Transformation</span>
      </div>
      <div className="w-3/4">
        <Editor
          height="160px"
          theme="vs-dark"
          defaultLanguage="typescript"
          defaultValue={
            transform
              ? getImageWithTransform.toString()
              : getImageWithoutTransform.toString()
          }
          options={{
            readOnly: true,
            minimap: { enabled: false },
            lineNumbers: "off",
          }}
        />
      </div>
      <div className="flex shrink-0 bg-gray-100 rounded-lg w-3/4 h-64 overflow-hidden">
        {imageUrl && <img src={imageUrl} className="w-full object-cover" />}
      </div>
      {loading && <div>Loading...</div>}
      {imageSize && !loading && (
        <div className="text-xs inline">
          <span>Image Size:</span>
          <span>{(imageSize / 1024 / 1024).toFixed(2)} Mb</span>
        </div>
      )}{" "}
      {!imageSize && !loading && (
        <div className="text-xs inline">
          <span>Click here to download </span>
          <span className="bg-slate-200 rounded font-mono px-1">{imageId}</span>
          <span className="underline">
            {transform ? " with " : " without "}
          </span>
          <span>transformations</span>
        </div>
      )}
      <div className="flex gap-2">
        <button
          className="bg-black text-white rounded-md px-2"
          onClick={handleGetImage}
        >
          Get Image
        </button>
        <button
          className="bg-black disabled:bg-slate-200 text-white rounded-md px-2"
          disabled={!imageUrl}
          onClick={handleDownload}
        >
          Send to Downloads
        </button>
      </div>
    </div>
  );
}

export default StorageTestFileDownloadButton;
