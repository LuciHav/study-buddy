import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 px-8 py-8 grid min-h-[calc(100vh-8rem)]">
        <main className="max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
