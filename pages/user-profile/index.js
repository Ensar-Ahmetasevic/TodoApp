import Layout from "@/components/layout/layout";
import UserProfile from "../../components/profile/user-profile";
import { getServerSideProps } from "@/helpers/verification-of-user-auth";

function UseProfile() {
  return (
    <Layout>
      <section className="mt-8">
        <UserProfile />
      </section>
    </Layout>
  );
}

export { getServerSideProps };

export default UseProfile;
