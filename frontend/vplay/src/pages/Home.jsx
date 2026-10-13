import { useEffect, useState } from "react";
import api from "../api/axios";
import VideoCard from "../components/VideoCard";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
     api.get("/videos")
      .then((res) => setVideos(res.data.videos))
      .catch(() => {});
  }, []);

  return (
    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {videos.map((v) => (
        <VideoCard video={v} key={v._id} />
      ))}
    </div>
  );
}
