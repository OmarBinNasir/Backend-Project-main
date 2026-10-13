import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
    // format time ago
    const timeAgo = (dateString) => {
        const diff = Date.now() - new Date(dateString).getTime();
        const seconds = diff / 1000;

        if (seconds < 60) return "just now";
        if (seconds < 3600) return Math.floor(seconds / 60) + " min ago";
        if (seconds < 86400) return Math.floor(seconds / 3600) + " hrs ago";
        return Math.floor(seconds / 86400) + " days ago";
    };

    return (
        <Link to={`/watch/${video._id}`}>
            <div className="rounded overflow-hidden hover:scale-[1.01] transition shadow bg-white">

                {/* Thumbnail */}
                <div className="relative">
                    <img
                        src={video.thumbnail}
                        className="w-full h-48 object-cover"
                    />

                    {/* Duration overlay */}
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {(() => {
                            const dur = Number(video.duration) || 0;
                            const min = Math.floor(dur / 60);
                            const sec = Math.floor(dur % 60).toString().padStart(2, "0");
                            return `${min}:${sec}`;
                        })()}

                    </span>
                </div>

                {/* Video info */}
                <div className="flex p-3 gap-3">

                    {/* Channel avatar */}
                    {video.owner?.avatar && (
                        <Link to={`/users/${video.owner._id}`}>
                            <img
                                src={video.owner.avatar}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        </Link>
                    )}

                    <div className="flex flex-col">

                        {/* Title */}
                        <h2 className="font-semibold line-clamp-2">{video.title}</h2>

                        {/* Owner name */}
                        {video.owner && (
                            <Link
                                to={`/users/${video.owner._id}`}
                                className="text-sm text-gray-600 hover:underline"
                            >
                                {video.owner.username}
                            </Link>
                        )}

                        {/* Views + upload time */}
                        <p className="text-xs text-gray-500">
                            {video.views} views • {timeAgo(video.createdAt)}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
