import Layout from "@/components/layout/layout";
import DeleteUSerForm from "@/components/profile/delete-user/delete-user-form";
import { getServerSideProps } from "@/helpers/verification-of-user-auth";

function DeleteUSer() {
  return (
    <Layout>
      <section>
        <h1 className="text-3xl text-center font-bold mb-8 sm:text-2xl">
          Delete Account
        </h1>
        <DeleteUSerForm />
      </section>
    </Layout>
  );
}

export { getServerSideProps };

export default DeleteUSer;
