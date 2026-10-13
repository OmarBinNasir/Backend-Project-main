import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function Profile() {
    const { username } = useParams();

    const [user, setUser] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loadingSub, setLoadingSub] = useState(false);

    useEffect(() => {
        api.get(`/users/channel/${username}`)
            .then((res) => setUser(res.data.data))
            .catch((err) => console.log(err));
    }, [username]);                  

    useEffect(() => {
        if (!user?._id) return;

        api.get(`/videos?userId=${user._id}`)
            .then((res) => setVideos(res.data.videos))
            .catch((err) => console.log(err));
    }, [user]);

    // --------------------
    // Subscribe / Unsubscribe
    // --------------------
    const toggleSubscribe = async () => {
        if (!user?._id) return;

        setLoadingSub(true);

        try {
            const endpoint = user.isSubscribed
                ? `/users/unsubscribe/${user._id}`
                : `/users/subscribe/${user._id}`;

            const res = await api.post(endpoint);

            // update UI locally
            setUser((prev) => ({
                ...prev,
                isSubscribed: !prev.isSubscribed,
                subscribersCount: prev.isSubscribed
                    ? prev.subscribersCount - 1
                    : prev.subscribersCount + 1,
            }));
        } catch (err) {
            console.log(err);
        }

        setLoadingSub(false);
    };

    if (!user) return <div className="p-5">Loading...</div>;

    return (
        <div className="p-5 max-w-5xl mx-auto">

            {user.coverImage && (
                <img
                    src={user.coverImage}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                />
            )}

            <div className="flex items-center justify-between mb-4">

                {/* Avatar + Info */}
                <div className="flex items-center gap-4">
                    <img
                        src={user.avatar}
                        className="w-28 h-28 rounded-full object-cover border"
                    />

                    <div>
                        <h2 className="text-2xl font-bold">{user.fullName}</h2>
                        <p className="text-gray-600">@{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>

                        <div className="flex gap-5 mt-2 text-sm">
                            <span>
                                <b>{user.subscribersCount}</b> Subscribers
                            </span>
                            <span>
                                <b>{user.channelsSubscribedToCount}</b> Subscribed
                            </span>
                        </div>
                    </div>
                </div>

                {/* Subscribe button - hide if viewing own profile */}
                {!user.isOwner && (
                    <button
                        disabled={loadingSub}
                        onClick={toggleSubscribe}
                        className={`px-4 py-2 rounded text-white font-semibold 
              ${user.isSubscribed ? "bg-gray-600" : "bg-red-600"}`}
                    >
                        {loadingSub
                            ? "..."
                            : user.isSubscribed
                                ? "Subscribed"
                                : "Subscribe"}
                    </button>
                )}
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-3">
                Videos by {user.fullName}
            </h2>

            {videos.length === 0 && (
                <p className="text-gray-600">This user has no videos.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {videos.map((video) => (
                    <Link to={`/watch/${video._id}`} key={video._id}>
                        <div className="shadow rounded hover:scale-[1.02] transition">
                            <img
                                src={video.thumbnail}
                                className="rounded-t h-40 w-full object-cover"
                            />
                            <div className="p-2">
                                <h3 className="font-semibold">{video.title}</h3>
                                <p className="text-sm text-gray-600">
                                    {video.views} views
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
