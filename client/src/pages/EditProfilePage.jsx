// client/src/pages/EditProfilePage.jsx
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../api/user.routes";
import { updateUser } from "../store/slices/userSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage() {
  const user = useSelector((state) => state.user.user);
  const [name, setName] = useState(user?.name || "");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const saveProfile = async () => {
    const response = await updateUserProfile(user.id, name);

    if (response.success) {
      toast.success("Profile updated!");
      dispatch(updateUser({ name }));
      navigate("/profile");
    } else {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="bg-white min-h-screen flex justify-center items-start pt-20">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded border mt-1"
            />
          </div>

          <button
            onClick={saveProfile}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
