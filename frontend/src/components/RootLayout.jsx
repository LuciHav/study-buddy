import { Outlet } from "react-router";
import Header from "./Header";

export default function RootLayout() {
  return (
    <>
      <Header />
      <div className="flex-1 px-8 py-8 grid">
        <main className="max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </>
  );
}
