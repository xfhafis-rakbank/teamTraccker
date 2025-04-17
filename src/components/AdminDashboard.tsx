import { useEffect, useState } from "react";
import { sanity } from "../sanityClient";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await sanity.fetch(`*[_type == "user" && role == "member"]{username}`);
      setUsers(res);
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">All Team Members</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.username}
            onClick={() => navigate(`/admin/user/${user.username}`)}
            className="cursor-pointer bg-white rounded-xl shadow hover:shadow-md p-4 transition"
          >
            <p className="font-semibold text-lg text-indigo-600">{user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
