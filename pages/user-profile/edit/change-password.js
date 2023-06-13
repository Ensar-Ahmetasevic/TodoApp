import Layout from "@/components/pages/layout/layout";
import ChangePasswordForm from "@/components/pages/profile/change-password/change-password-form";
import { getServerSideProps } from "@/components/shared/verification-of-user-auth";

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
