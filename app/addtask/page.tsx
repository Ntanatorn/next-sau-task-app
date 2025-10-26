"use client";

import Image from "next/image";
import taskImage from "../../assets/images/task.png";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddRunPage() {
  const [runDate, setRunDate] = useState("");
  const [runDistance, setRunDistance] = useState<number | "">("");
  const [runPlace, setRunPlace] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAndSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!runDate || runDistance === "" || !runPlace) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    let imageUrl: string | null = null;

    if (imageFile) {
      // sanitize ชื่อไฟล์
      const safeName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `${Date.now()}_${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("myrun_bucket") // ใช้ bucket ที่ถูกต้อง
        .upload(fileName, imageFile, { upsert: false });

      if (uploadError) {
        alert("เกิดข้อผิดพลาดในการอัปโหลดรูป กรุณาลองใหม่อีกครั้ง");
        console.log(uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("myrun_bucket")
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    const { error: insertError } = await supabase.from("myrun_tb").insert({
      run_date: runDate,
      run_distance: runDistance,
      run_place: runPlace,
      run_image_url: imageUrl,
    });

    if (insertError) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
      console.log(insertError.message);
      return;
    }

    alert("บันทึกการวิ่งเรียบร้อยแล้ว");
    window.location.href = "/"; // กลับหน้า My Run Tracker
  };

  return (
    <>
      <div className="flex flex-col items-center pb-30">
        <Image className="mt-20" src={taskImage} alt="Run" width={120} priority />
        <h1 className="mt-8 text-2xl font-bold text-red-700">My Run Tracker</h1>
        <h2 className="mt-2 text-lg text-red-700">เพิ่มข้อมูลการวิ่ง</h2>

        <div className="w-3xl border border-gray-500 p-10 mx-auto rounded-xl mt-5">
          <h1 className="text-xl font-bold text-center">➕ เพิ่มการวิ่งใหม่</h1>

          <form onSubmit={handleUploadAndSave} className="w-full space-y-4">
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
              <label className="block mb-1 font-medium">อัปโหลดรูป</label>
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
                เลือกรูป
              </label>
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="preview"
                  width={150}
                  height={150}
                  style={{ objectFit: "cover" }}
                  className="mt-2"
                />
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-purple-400"
              >
                บันทึกการวิ่ง
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
