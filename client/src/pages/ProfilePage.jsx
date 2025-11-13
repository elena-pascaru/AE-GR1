// client/src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserProfile } from "../api/user.routes"; 
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProfilePage() {
  const tokenUser = useSelector((state) => state.user.user); // user din token
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!tokenUser?.id) return;

      const response = await getUserProfile(tokenUser.id);

      if (response?.success) {
        setProfile(response.data);
      } else {
      toast.error("Failed to show profile");
    }

      setLoading(false);
    };

    loadProfile();
  }, [tokenUser]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white min-h-screen flex justify-center items-start pt-20">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Profile</h1>

        <div className="space-y-4 text-gray-700">

          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-medium">
              {profile?.name || "No name provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">{profile?.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg font-medium capitalize">{profile?.role}</p>
          </div>

        </div>
      </div>
    </div>
  );
}
