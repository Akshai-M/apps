import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // Redirect to workspace dashboard
      router.push("/workspaces");
    }
  }, [session]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      {status === "loading" ? (
        <p className="text-gray-600 text-lg">Checking session...</p>
      ) : !session ? (
        <div className="bg-white p-8 rounded-lg shadow-md space-y-4">
          <h2 className="text-red-600 text-3xl font-bold text-center">Sign In</h2>
          <button
            onClick={() => signIn("github")}
            className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 cursor-pointer transition duration-300"
          >
            Sign in with GitHub
          </button>
        </div>
      ) : null}
    </div>
  );
}
