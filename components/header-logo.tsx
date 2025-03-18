import Link from "next/link";
import Image from "next/image";

export const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="items-center hidden lg:flex">
        <Image src="./logo.svg" alt="logo" height={30} width={30}/>
        <p className="font-semibold text-white text-2xl ml-2.5">TrackPaisa</p>
      </div>
    </Link>
  );
};
