import Layout from "@/components/layout/layout";
import ChangePasswordForm from "@/components/profile/change-password/change-password-form";
import { getServerSideProps } from "@/helpers/verification-of-user-auth";

function ChangePassword() {
  return (
    <Layout>
      <section>
        <h1 className="text-3xl text-center font-bold mb-8 sm:text-2xl mt-20">
          Change Your Password
        </h1>
        <ChangePasswordForm />
      </section>
    </Layout>
  );
}

export { getServerSideProps };

export default ChangePassword;
