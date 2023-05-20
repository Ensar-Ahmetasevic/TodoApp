import MainNavigation from "./main-navigation";

function Layout(props) {
  return (
    <div className="text-center items-center justify-center min-h-screen bg-gray-700 text-gray-100">
      <MainNavigation />
      <main>{props.children}</main>
    </div>
  );
}

export default Layout;
