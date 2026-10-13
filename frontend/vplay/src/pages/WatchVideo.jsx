import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, Link } from "react-router-dom";

export default function WatchVideo() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    api.get(`/videos/${id}`).then((res) => setVideo(res.data.data[0]));
  }, [id]);

  const like = async () => {
    await api.post(`/videos/${id}/like`);
    setVideo((prev) =>
      prev ? { ...prev, likes: (prev.likes || 0) + 1 } : prev
    );
  };

  const postComment = async () => {
    if (!comment.trim()) return;
    await api.post(`/videos/${id}/comments`, { text: comment });
    setComment("");
    // optionally re-fetch comments here
  };

  const subscribe = async () => {
    if (!video?.owner?._id) return;
    await api.post(`/users/${video.channelOwner.username}/subscribe`);
    // optimistic UI toggle
    setVideo((prev) =>
      prev
        ? {
            ...prev,
            owner: {
              ...prev.owner,
              isSubscribed: !prev.owner.isSubscribed,
              subscribersCount: prev.owner.isSubscribed
                ? prev.owner.subscribersCount - 1
                : prev.owner.subscribersCount + 1,
            },
          }
        : prev
    );
  };

  if (!video) return <div className="p-5">Loading...</div>;

  const owner = video.channelOwner;
 
  return (
    <div className="p-5 flex flex-col gap-4 max-w-5xl mx-auto">
      {/* Video */}
      <video className="w-full rounded" src={video.videoFile} controls />

      {/* Title */}
      <h1 className="text-2xl font-bold">{video.title}</h1>

      {/* Channel info row */}
      {owner && (
        <div className="flex items-center justify-between mt-2">
          {/* Left: avatar + name + subs */}
          <Link
            to={`/profile/${owner.username}`}
            className="flex items-center gap-3"
          >
            <img
              src={owner.avatar}
              alt={owner.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-semibold">
                {owner.fullName || owner.username}
              </span>
              <span className="text-xs text-gray-500">
                @{owner.username}
              </span>
              <span className="text-xs text-gray-500">
                {owner.subscribersCount ?? 0} subscribers
              </span>
            </div>
          </Link>

          {/* Right: Subscribe + Like */}
          <div className="flex items-center gap-3">
            <button
              className={`px-4 py-1 rounded text-white ${
                owner.isSubscribed ? "bg-gray-600" : "bg-red-600"
              }`}
              onClick={subscribe}
            >
              {owner.isSubscribed ? "Subscribed" : "Subscribe"}
            </button>

            <button
              className="bg-blue-600 px-4 py-1 rounded text-white"
              onClick={like}
            >
              Like ({video.likes ?? 0})
            </button>
          </div>
        </div>
      )}

      {/* Description (optional) */}
      {video.description && (
        <div className="mt-3 bg-gray-100 rounded p-3 text-sm">
          {video.description}
        </div>
      )}

      {/* Comment box */}
      <div className="mt-4">
        <h2 className="font-semibold mb-2">Comments</h2>
        <textarea
          className="border p-2 w-full rounded"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-1 rounded mt-2"
          onClick={postComment}
        >
          Post Comment
        </button>
      </div>
    </div>
  );
}
