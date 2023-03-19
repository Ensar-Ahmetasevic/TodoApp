import ProfileForm from "./profile-form";
import { useState } from "react";
import { toast } from "react-toastify";

function UserProfile() {
  async function changePasswordHandler(passwordData) {
    const response = await fetch("/api/user/change-password", {
      method: "PATCH",
      body: JSON.stringify(passwordData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.status === true) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  }

  return (
    <section>
      <h1 className="text-3xl text-center font-bold mb-8">Your User Profile</h1>

      <ProfileForm onChangePassword={changePasswordHandler} />
    </section>
  );
}

export default UserProfile;
