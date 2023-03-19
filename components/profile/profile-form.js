import { useRef } from "react";

function ProfileForm(props) {
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();

  async function submitHandler(event) {
    event.preventDefault();

    const enteredOldPassword = oldPasswordRef.current.value;
    const enteredNewPassword = newPasswordRef.current.value;

    props.onChangePassword({
      oldPassword: enteredOldPassword,
      newPassword: enteredNewPassword,
    });

    oldPasswordRef.current.value = "";
    newPasswordRef.current.value = "";
  }

  return (
    <form className="max-w-md mx-auto" onSubmit={submitHandler}>
      <div className="mb-4">
        <label htmlFor="new-password" className="block font-semibold mb-1">
          New Password
        </label>
        <input
          ref={newPasswordRef}
          type="password"
          id="new-password"
          className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="old-password" className="block font-semibold mb-1">
          Old Password
        </label>
        <input
          ref={oldPasswordRef}
          type="password"
          id="old-password"
          className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-full"
        />
      </div>
      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out">
          Change Password
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;
