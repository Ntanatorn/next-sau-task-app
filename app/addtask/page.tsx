"use client";
import Image from "next/image";
import task from "./../../assets/images/task.png";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Page() {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAndSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() === '' || detail.trim() === '') {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    let imageUrl = "";

    if (imageFile) {
      const newFileName = `${Date.now()}_${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("task_bk")
        .upload(newFileName, imageFile);

      if (uploadError) {
        alert("เกิดข้อผิดพลาดในการอัปโหลดรูป กรุณาลองใหม่อีกครั้ง");
        console.log(uploadError.message);
        return;
      }

      const { data: urlData } = await supabase.storage
        .from("task_bk")
        .getPublicUrl(newFileName);

      imageUrl = urlData.publicUrl;
    }

    const { error: insertError } = await supabase
      .from("task_tb")
      .insert({
        title: title,
        detail: detail, 
        image_url: imageUrl,
        is_completed: isCompleted,
      });

    if (insertError) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
      console.log(insertError.message);
      return;
    }

    alert("บันทึกงานเรียบร้อยแล้ว");
    window.location.href = "/alltask";
  };

  return (
    <>
      <div className="flex flex-col items-center pb-30">
        {/* ส่วนบน */}
        <Image className="mt-20" src={task} alt="Task" width={120} />
        <h1 className="mt-8 text-2xl font-bold text-red-700">Manage Task App</h1>
        <h1 className="mt-2 text-lg text-red-700">บริการจัดการงานที่ทำ</h1>

        {/* ฟอร์มเพิ่มงาน */}
        <div className="w-3xl border border-gray-500 p-10 mx-auto rounded-xl mt-5">
          <h1 className="text-xl font-bold text-center">➕ เพิ่มงานใหม่</h1>

          <form onSubmit={handleUploadAndSave} className="w-full space-y-4">
            <div>
              <label>ชื่องาน</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
            <div>
              <label>รายละเอียด</label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="w-full border rounded-lg p-2"
                rows={5}
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
                  className="mt-2"
                />
              )}
            </div>
            <div>
              <label>สถานะ</label>
              <select
                value={isCompleted ? "1" : "0"}
                onChange={(e) => setIsCompleted(e.target.value === "1")}
                className="w-full border rounded-lg p-2"
              >
                <option value="0">❌ ยังไม่เสร็จ</option>
                <option value="1">✅ เสร็จแล้ว</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-purple-400"
              >
                บันทึกงานใหม่
              </button>
            </div>
          </form>

          <Link
            href="/alltask"
            className="text-blue-500 w-full text-center mt-5 block hover:text-blue-600"
          >
            กลับไปหน้าแสดงงานทั้งหมด
          </Link>
        </div>

        <Footer />
      </div>
    </>
  );
}
