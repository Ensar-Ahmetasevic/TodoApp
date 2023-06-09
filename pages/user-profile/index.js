import Link from "next/link";

import Layout from "@/components/pages/layout/layout";
import { getServerSideProps } from "@/components/shared/verification-of-user-auth";

function UseProfile() {
  return (
    <Layout>
      <div className="grid grid-cols-6 gap-4 mx-20 sm:mx-5 mt-20">
        <section className="col-start-1 col-span-3 py-5 border-solid border-2 rounded-lg border-blue-600 hover:border-blue-400 hover:bg-gray-800">
          <div className=" flex flex-col justify-between">
            <h1 className="text-2xl sm:text-lg font-bold mb-8">
              <span className="break-words sm:break-normal">
                Change
                <br className="hidden sm:inline" /> Password
              </span>
            </h1>
            <div>
              <Link
                className="border-2 rounded-md p-2 hover:bg-blue-600"
                href="/user-profile/edit/change-password"
              >
                Change
              </Link>
            </div>
          </div>
        </section>

        <section className="col-start-4 col-span-3 py-5 border-solid border-2 rounded-lg border-red-600  hover:border-red-400 hover:bg-gray-800">
          <div className=" flex flex-col justify-between">
            <h1 className="text-2xl sm:text-lg font-bold mb-8">
              <span className="break-words sm:break-normal">
                Delete
                <br className="hidden sm:inline" /> Account
              </span>
            </h1>
            <div className="">
              <Link
                className="border-2 rounded-md p-2 hover:bg-red-600"
                href="/user-profile/edit/delete-user"
              >
                Delete
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export { getServerSideProps };

export default UseProfile;
