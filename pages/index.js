import { toast } from "react-toastify";
import Layout from "@/components/layout/layout";

function HomePage() {
  return (
    <Layout>
      <section className="bg-gray-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-100">
            Welcome to ToDo App
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            To successfully use our application, please Login.
          </p>
        </div>
      </section>
    </Layout>
  );
}

export default HomePage;
