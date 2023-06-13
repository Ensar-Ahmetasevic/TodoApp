import Layout from "@/components/pages/layout/layout";
import DeleteUSerForm from "@/components/pages/profile/delete-user/delete-user-form";
import { getServerSideProps } from "@/components/shared/verification-of-user-auth";

function DeleteUSer() {
  return (
    <Layout>
      <section>
        <h1 className="text-3xl text-center font-bold mb-8 sm:text-2xl mt-20">
          Delete Account
        </h1>
        <DeleteUSerForm />
      </section>
    </Layout>
  );
}

export { getServerSideProps };

export default DeleteUSer;
