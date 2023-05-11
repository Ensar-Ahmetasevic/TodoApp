import Link from "next/link";
import { useSession, signOut } from "next-auth/client";

function MainNavigation() {
  const [session, loading] = useSession();
  // "session" object is describing the act of "session"

  function logoutHandler() {
    signOut();
  }

  return (
    <header className="bg-gray-700 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {!session && !loading ? (
          <Link
            href="/"
            className="text-white font-bold text-xl tracking-tight hover:border-red-500 border-b-2 border-transparent transition duration-200 ease-in-out"
          >
            ToDo`s
          </Link>
        ) : (
          <Link
            href="/lists"
            className="text-white font-bold text-xl tracking-tight hover:border-red-500 border-b-2 border-transparent transition duration-200 ease-in-out"
          >
            ToDo`s
          </Link>
        )}

        <nav>
          <ul className=" items-center flex space-x-4 sm:ml-2">
            {!session && !loading && (
              <li>
                <Link
                  href="/auth"
                  className="text-gray-300 hover:text-white transition duration-300 ease-in-out sm:px-1.5 sm:py-1"
                >
                  Login
                </Link>
              </li>
            )}

            {session && (
              <li>
                <Link
                  href="/lists"
                  className="text-gray-300 hover:text-white transition duration-300 ease-in-out"
                >
                  My ToDo's
                </Link>
              </li>
            )}

            {session && (
              <li>
                <Link
                  href="/profile"
                  className="text-gray-300 hover:text-white transition duration-300 ease-in-out mx-2 sm:mx:0"
                >
                  Profile
                </Link>
              </li>
            )}
            {session && (
              <li>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-300 ease-in-out sm:px-1.5 sm:py-1"
                  onClick={logoutHandler}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default MainNavigation;
