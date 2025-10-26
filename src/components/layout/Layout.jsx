import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }){
  return (
    <div className="flex text-gray-100 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Sidebar />
      <div className="flex-1 ml-0 sm:ml-60">
        <Navbar />
        <main className="pt-20 px-4 sm:px-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}