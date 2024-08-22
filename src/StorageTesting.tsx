import { useEffect, useState } from "react";
import StorageTestingExample from "./StorageTestingExample";
import { supabase } from "./App";

function StorageTest() {
  const [testFileId, setTestFileId] = useState<string | null>(null);
  const [fileIds, setFileIds] = useState<string[]>([]);

  useEffect(() => {
    supabase.storage
      .from("testing")
      .list()
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setFileIds(data.map((file) => file.name));
      });
  }, [supabase]);

  return (
    <div className="flex items-center flex-col gap-8 w-full">
      <div className="flex gap-3">
        <div>Select a File:</div>
        <select
          className="border rounded"
          onChange={(e) => setTestFileId(e.target.value)}
          value={testFileId ?? ""}
        >
          <option>None Selected</option>
          {fileIds.map((fileId) => (
            <option key={fileId} onClick={() => setTestFileId(fileId)}>
              {fileId}
            </option>
          ))}
        </select>
      </div>

      {testFileId && (
        <div className="flex gap-8 w-full justify-between">
          <StorageTestingExample imageId={testFileId} transform={true} />
          <StorageTestingExample imageId={testFileId} transform={false} />
        </div>
      )}
    </div>
  );
}

export default StorageTest;
