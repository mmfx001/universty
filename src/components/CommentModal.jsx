import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { XMarkIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const CommentModal = ({ isOpen, onClose, allComments, productId, onCommentSubmit }) => {
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  if (!isOpen) return null;

  const filteredComments = allComments
    .filter((comment) => comment.post_id === productId)
    .sort((a, b) => new Date(b.commented_at) - new Date(a.commented_at));

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      setErrorMessage("You must enter a comment text.");
      return;
    }

    try {
      let response;
      if (editingCommentId) {
        response = await axios.put(
          `http://37.140.216.178/api/v1/posts/club/comments/${editingCommentId}/`,
          { text: newComment, post_id: productId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      } else {
        response = await axios.post(
          `http://37.140.216.178/api/v1/posts/club/comments/`,
          { text: newComment, post_id: productId, commented_at: new Date().toISOString() },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }

      onCommentSubmit(response.data);
      setNewComment("");
      setEditingCommentId(null);
      setErrorMessage("");
    } catch (error) {
      console.error("Errer set comment", error);
      setErrorMessage("Error set commnet.");
    }
  };

  const handleEdit = (comment) => {
    setNewComment(comment.text);
    setEditingCommentId(comment.id);
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`http://37.140.216.178/api/v1/posts/club/comments/${commentId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      onCommentSubmit(allComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      setErrorMessage("error comment delete!");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Comments</h2>
        <div className="overflow-y-auto max-h-60 mb-4 space-y-4">
          {filteredComments.length === 0 ? (
            <p className="text-gray-500 text-center">No comments</p>
          ) : (
            filteredComments.map((comment) => (
              <div key={comment.id} className="flex justify-between items-start border-b pb-2">
                <div>
                  <p className="font-medium text-gray-900">{comment.text}</p>
                  <p className="text-sm text-gray-500 font-semibold ">
                    {new Date(comment.commented_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full border p-2 rounded mb-2"
          placeholder="comment..."
          rows={3}
        />
        {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
        <button
          onClick={handleCommentSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
        >
          {editingCommentId ? "Izohni saqlash" : "Izohni yuborish"}
        </button>
      </div>
    </div>,
    document.body
  );
};

export default CommentModal;
