import Image from "next/image";
import Link from "next/link";
import task from "../assets/images/task.png"
import Footer from "@/components/Footer";

export default function Home() {

  return (
    <>
      <div className="flex flex-col items-center ">
          <Image className="mt-15" src={task} alt="Task" width={150} />

          <h1 className="mt-10 text-3xl font-bold text-red-700">
            My Run Tracker
          </h1>

          <h1 className="text-2xl text-red-700">
            บริหารจัดการการวิ่งที่ทำ
          </h1>

          <Link href="/alltask" className="bg-green-500 px-15 py-2 rounded mt-5 text-gray-800
                                            hover:bg-purple-500">
            เข้าใช้งานแอปพลิเคชั่น
          </Link>
      </div>
      <Footer/>
    </>
  );
}
