import Layout from "@/components/layout/layout";
import UserProfile from "../components/profile/user-profile";
import { getServerSideProps } from "@/helpers/getServerSideProps";

function ProfilePage() {
  return (
    <Layout>
      <section className="mt-8">
        <UserProfile />
      </section>
    </Layout>
  );
}

export { getServerSideProps };

export default ProfilePage;
