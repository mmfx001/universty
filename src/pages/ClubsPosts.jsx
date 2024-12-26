import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentModal from '../components/CommentModal';
import { useLocation } from 'react-router-dom';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
    </div>
);

const HeartIcon = ({ isLiked, onClick, likeCount, disabled }) => (
    <div className="flex items-center space-x-2">
        <svg
            onClick={(e) => {
                if (disabled) return;
                e.stopPropagation();
                onClick();
            }}
            className={`w-8 h-8 fill-current transition-colors duration-300 ${isLiked ? 'text-red-500' : 'text-gray-400'} ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:text-red-500 cursor-pointer'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        {likeCount > 0 && <span className="text-lg font-semibold text-gray-600">{likeCount}</span>}
    </div>
);

const ClubPosts = () => {
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [likedStates, setLikedStates] = useState({});
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const clubId = location.state?.club.id;

    useEffect(() => {
        const fetchPosts = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('Access token is missing.');
                return;
            }

            try {
                const [postsResponse, usersResponse] = await Promise.all([
                    axios.get(`http://37.140.216.178/api/v1/posts/getclubposts/${clubId}/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }),
                    axios.get('http://37.140.216.178/api/v1/users/userinfo/', {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }),
                ]);

                setData(postsResponse.data);
                setUsers(usersResponse.data);

                // Foydalanuvchining ID ni olish
                const currentUser = usersResponse.data[0];  // usersResponse.data massivning 1-chi elementini olish
                const currentUserId = currentUser?.id;
                if (!currentUserId) {
                    console.error('Foydalanuvchi ID topilmadi.');
                    return;
                }

                // Liked states ni yaratish
                const initialLikedStates = {};
                postsResponse.data.forEach((item) => {
                    const likedUsers = item.likes || [];
                    const isLikedByUser = likedUsers.includes(currentUserId);

                    initialLikedStates[item.id] = {
                        likedUsers,
                        isLikedByUser,
                    };
                });

                setLikedStates(initialLikedStates);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [clubId]);

    const fetchComments = async (postId) => {
        try {
            const response = await axios.post(
                'http://37.140.216.178/api/v1/posts/user/getcomments/',
                { post_id: postId }
            );
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
            alert('Izohlarni olishda xatolik yuz berdi.');
        }
    };

    const handleLikeToggle = async (post) => {
        if (!users || users.email === 'guest@example.com') {
            alert('Guests cannot like posts.');
            return;
        }

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('Authorization token is missing.');
            return;
        }

        const isLiked = likedStates[post.id]?.isLikedByUser;
        const url = 'http://37.140.216.178/api/v1/posts/like/';
        const method = isLiked ? 'DELETE' : 'POST';
        const payload = { post_id: post.id };

        try {
            const response = await axios({
                method,
                url,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                data: payload,
            });

            if (response.status === 201 || response.status === 200) {
                // Update the like state
                setLikedStates((prev) => {
                    const newLikedUsers = isLiked
                        ? prev[post.id].likedUsers.filter((userId) => userId !== users.id)
                        : [...prev[post.id].likedUsers, users.id];

                    return {
                        ...prev,
                        [post.id]: {
                            likedUsers: newLikedUsers,
                            isLikedByUser: !isLiked,
                        },
                    };
                });
            } else {
                alert('Failed to toggle like. Please try again later.');
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            alert('Xatolik yuz berdi. Like amalini bajara olmadik.');
        }
    };

    const handleCardClick = (post) => {
        setSelectedPost(post);
        setModalOpen(true);
        fetchComments(post.id);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedPost(null);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="w-full flex items-center justify-center bg-indigo-50">
            <div className="max-w-3xl h-[520px] w-full mx-auto p-2 lg:p-6 overflow-auto">
                <div className="flex flex-col space-y-8">
                    {data.length === 0 ? (
                        <p className="text-center text-lg font-poppins text-gray-600">
                            No posts available at the moment.
                        </p>
                    ) : (
                        data.map((post) => {
                            const postUser = users.find((user) => user.id === post.userid); // Match user by userid
                            const likeCount = likedStates[post.id]?.likedUsers.length || 0;
                            return (
                                <div
                                    key={post.id}
                                    className="bg-white p-4 rounded-lg duration-200 shadow-lg shadow-indigo-200"
                                >
                                    <div className="flex items-center space-x-4 mb-4">
                                        {post.club_id?.logo && (
                                            <img
                                                src={post.club_id.logo}
                                                alt={post.club_id.name || 'Club logo'}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        )}

                                        <div className="flex flex-col">
                                            <h3 className="text-lg font-semibold text-gray-800">{post.body}</h3>
                                            <p className="text-sm text-gray-500">{postUser?.name}</p>
                                        </div>
                                    </div>

                                    {post.images && post.images.length > 0 && (
                                        <img
                                            src={post.images[0]?.image}
                                            alt={post.title || 'Post image'}
                                            className="w-full h-[350px] object-cover rounded-md mb-4"
                                        />
                                    )}

                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center space-x-3">
                                            <HeartIcon
                                                isLiked={likedStates[post.id]?.isLikedByUser}
                                                onClick={() => handleLikeToggle(post)}
                                                disabled={users && users.email === 'guest@example.com'}
                                                likeCount={likeCount}
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleCardClick(post)}
                                            className="px-4 py-2 text-sm bg-gray-200 rounded-full hover:bg-gray-300"
                                        >
                                             Comments
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {modalOpen && (
                <CommentModal
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    allComments={comments}
                    productId={selectedPost.id}
                    onCommentSubmit={(newComment) => setComments([...comments, newComment])}
                />
            )}
        </div>
    );
};

export default ClubPosts;
