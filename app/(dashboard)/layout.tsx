import { Header } from "@/components/Header";

type Props = {
  children: React.ReactNode;
};

const dashboardlayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main className="px-3 lg:px-14">{children}</main>
    </>
  );
};

export default dashboardlayout;
