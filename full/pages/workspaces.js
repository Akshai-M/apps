import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CreateModal from "../components/CreateModal";

export default function WorkspacesPage() {
  const { data: session } = useSession();
  const [workspaces, setWorkspaces] = useState({ own: [], joined: [] });
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetch("/api/workspaces")
        .then(res => res.json())
        .then(data => setWorkspaces(data));
    }
  }, [session]);

  const handleCreated = (newWs) => {
    setWorkspaces(prev => ({
      ...prev,
      own: [newWs, ...prev.own]
    }));
  };

  return (
    <div className="p-10 space-y-10 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-red-600">Your Workspaces</h1>
        <button onClick={() => setShowModal(true)} className="bg-green-600 text-white px-4 py-2 rounded">
          + Create Workspace
        </button>
      </div>

      {/* Same rendering blocks from earlier... */}

      {showModal && <CreateModal onClose={() => setShowModal(false)} onCreated={handleCreated} />}
    </div>
  );
}
