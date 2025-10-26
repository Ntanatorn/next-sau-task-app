"use client";

import Image from "next/image";
import taskImage from "../../../assets/images/task.png";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";

export default function UpdateRunPage() {
  const router = useRouter();
  const { id } = useParams(); // ดึง id จาก route

  const [runDate, setRunDate] = useState("");
  const [runDistance, setRunDistance] = useState<number | "">("");
  const [runPlace, setRunPlace] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // fetch ข้อมูล run เดิมตอนหน้าโหลด
  useEffect(() => {
    if (!id) return;

    const fetchRun = async () => {
      const { data, error } = await supabase
        .from("myrun_tb")
        .select("*")
        .eq("id", id) // ใช้ UUID เป็น string ตรง ๆ
        .single();

      if (error) {
        alert("ไม่พบข้อมูลการวิ่งนี้");
        console.log(error.message);
        return;
      }

      // แปลง run_date ให้เป็น YYYY-MM-DD
      const runDateString = data.run_date
        ? new Date(data.run_date).toISOString().split("T")[0]
        : "";

      setRunDate(runDateString);
      setRunDistance(data.run_distance);
      setRunPlace(data.run_place);
      setImagePreview(data.run_image_url || "");
    };

    fetchRun();
  }, [id]);

  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAndUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    if (!runDate || runDistance === "" || !runPlace) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    let imageUrl: string | null = imagePreview;

    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("run_images")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("เกิดข้อผิดพลาดในการอัปโหลดรูป กรุณาลองใหม่อีกครั้ง");
        console.log(uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("run_images")
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("myrun_tb")
      .update({
        run_date: runDate,
        run_distance: runDistance,
        run_place: runPlace,
        run_image_url: imageUrl,
      })
      .eq("id", id); // ใช้ UUID ตรง ๆ

    if (updateError) {
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล กรุณาลองใหม่อีกครั้ง");
      console.log(updateError.message);
      return;
    }

    alert("อัปเดตข้อมูลการวิ่งเรียบร้อยแล้ว");
    router.push("/"); // กลับหน้า My Run Tracker
  };

  return (
    <>
      <div className="flex flex-col items-center pb-30">
        <Image className="mt-20" src={taskImage} alt="Run" width={120} priority />
        <h1 className="mt-8 text-2xl font-bold text-red-700">My Run Tracker</h1>
        <h2 className="mt-2 text-lg text-red-700">แก้ไขข้อมูลการวิ่ง</h2>

        <div className="w-3xl border border-gray-500 p-10 mx-auto rounded-xl mt-5">
          <h1 className="text-xl font-bold text-center">✏️ แก้ไขการวิ่ง</h1>

          <form onSubmit={handleUploadAndUpdate} className="w-full space-y-4">
            <div>
              <label>วันที่วิ่ง</label>
              <input
                type="date"
                value={runDate}
                onChange={(e) => setRunDate(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label>ระยะทาง (กม.)</label>
              <input
                type="number"
                value={runDistance}
                onChange={(e) => setRunDistance(Number(e.target.value))}
                className="w-full border rounded-lg p-2"
                min={0}
                step={0.1}
                required
              />
            </div>

            <div>
              <label>สถานที่วิ่ง</label>
              <input
                type="text"
                value={runPlace}
                onChange={(e) => setRunPlace(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">รูปภาพ</label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSelectImage}
              />
              <label
                htmlFor="fileInput"
                className="inline-block bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-purple-500"
              >
                เลือกรูปใหม่
              </label>
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="preview"
                  width={150}
                  height={150}
                  style={{ objectFit: "contain" }} // maintain aspect ratio
                  className="mt-2"
                />
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-purple-400"
              >
                อัปเดตการวิ่ง
              </button>
            </div>
          </form>

          <Link
            href="/alltask"
            className="text-blue-500 w-full text-center mt-5 block hover:text-blue-600"
          >
            กลับไปหน้าหลัก
          </Link>
        </div>

        <Footer />
      </div>
    </>
  );
}
