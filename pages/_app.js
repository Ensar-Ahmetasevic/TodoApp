//import "@/styles/tailwind.css";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <div className="h-screen bg-gray-700 text-gray-100  ">
      <Component {...pageProps} />
    </div>
  );
}
