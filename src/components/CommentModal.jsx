import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const CommentModal = ({ isOpen, onClose, allComments, productId, onCommentSubmit }) => {
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null); // Tracks the comment being edited
    const [errorMessage, setErrorMessage] = useState('');
    const accessToken = localStorage.getItem('accessToken');

    if (!isOpen) return null;

    const filteredComments = allComments
        .filter((comment) => comment.post_id === productId)
        .sort((a, b) => new Date(b.commented_at) - new Date(a.commented_at));

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) {
            setErrorMessage('Izoh matnini kiritishingiz kerak.');
            return;
        }

        try {
            let response;
            if (editingCommentId) {
                // PUT request for editing
                response = await axios.put(
                    `http://37.140.216.178/api/v1/posts/club/comments/${editingCommentId}/`,
                    {
                        text: newComment,
                        post_id: productId,
                    },
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );
            } else {
                // POST request for adding a new comment
                response = await axios.post(
                    `http://37.140.216.178/api/v1/posts/club/comments/`,
                    {
                        text: newComment,
                        post_id: productId,
                        commented_at: new Date().toISOString(),
                    },
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );
            }

            onCommentSubmit(response.data);
            setNewComment('');
            setEditingCommentId(null);
            setErrorMessage('');
        } catch (error) {
            console.error('Izoh yuborishda xatolik yuz berdi:', error);
            setErrorMessage('Izoh yuborishda xatolik yuz berdi.');
        }
    };

    const handleEdit = (comment) => {
        setNewComment(comment.text);
        setEditingCommentId(comment.id);
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
                >
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-4">Izohlar</h2>
                <div className="overflow-y-auto max-h-60 mb-4">
                    {filteredComments.length === 0 ? (
                        <p className="text-gray-500">Hozircha izohlar yo'q.</p>
                    ) : (
                        filteredComments.map((comment) => (
                            <div key={comment.id} className="mb-4">
                                <p className="font-semibold text-gray-800">{comment.text}</p>
                                <p className="text-sm text-gray-500">{comment.commented_at}</p>
                                <button
                                    onClick={() => handleEdit(comment)}
                                    className="text-blue-500 text-sm underline"
                                >
                                    Tahrirlash
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    placeholder="Izoh qo'shing yoki tahrirlang..."
                />
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                <button
                    onClick={handleCommentSubmit}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    {editingCommentId ? 'Izohni saqlash' : 'Izohni yuborish'}
                </button>
            </div>
        </div>,
        document.body
    );
};

export default CommentModal;
