import { useState } from "react";
import api from "../api/axios";

export default function UploadVideo() {
  const [data, setData] = useState({
    videoFile: null,
    thumbnail: null,
    title: "",
    description: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(data).forEach((k) => {
      if (data[k] !== null) form.append(k, data[k]);
    });

    try {
      const res = await api.post("/videos/publish-video", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Uploaded successfully!");
      console.log(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h1 className="text-2xl mb-6 font-bold text-gray-800">
        Upload a New Video
      </h1>

      <form className="flex flex-col gap-5 bg-white p-6 rounded shadow" onSubmit={submit}>
        
        {/* VIDEO FILE */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Video File
          </label>
          <input
            name="videoFile"
            type="file"
            accept="video/*"
            className="border rounded p-2 w-full"
            onChange={(e) =>
              setData({ ...data, videoFile: e.target.files[0] })
            }
          />
          {data.videoFile && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {data.videoFile.name}
            </p>
          )}
        </div>

        {/* THUMBNAIL */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Thumbnail Image
          </label>
          <input
            name="thumbnail"
            type="file"
            accept="image/*"
            className="border rounded p-2 w-full"
            onChange={(e) =>
              setData({ ...data, thumbnail: e.target.files[0] })
            }
          />
          {data.thumbnail && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {data.thumbnail.name}
            </p>
          )}
        </div>

        {/* TITLE */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Title
          </label>
          <input
            name="title"
            className="border rounded p-2 w-full"
            placeholder="Enter video title"
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            className="border rounded p-2 w-full h-28"
            placeholder="Write a short description..."
            onChange={(e) => setData({ ...data, description: e.target.value })}
          ></textarea>
        </div>

        {/* SUBMIT BUTTON */}
        <button className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
          Upload Video
        </button>
      </form>
    </div>
  );
}
