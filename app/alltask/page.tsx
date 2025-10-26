"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import taskImage from "../../assets/images/task.png";
import Footer from "@/components/Footer";

// ✅ เปลี่ยน type ให้ตรงกับตาราง myrun_tb
type Run = {
  id: string;
  created_at: string;
  run_date: string;
  run_distance: number;
  run_place: string;
  run_image_url: string | null;
};

export default function Page() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const validUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const fetchRuns = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("myrun_tb").select("*");
    if (error) {
      console.error("Error fetching runs:", error);
      setError(error.message);
      setRuns([]);
    } else {
      setRuns(data || []);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("แน่ใจหรือไม่ว่าจะลบข้อมูลการวิ่งนี้?");
    if (!confirmDelete) return;

    setDeletingId(id);
    const { error } = await supabase.from("myrun_tb").delete().eq("id", id);
    setDeletingId(null);

    if (error) {
      alert("เกิดข้อผิดพลาดในการลบข้อมูล: " + error.message);
    } else {
      alert("ลบข้อมูลสำเร็จ");
      fetchRuns();
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        {/* ✅ LCP image */}
        <Image
          className="mt-15"
          src={taskImage}
          alt="Run"
          width={100}
          height={100}
          priority
        />

        <h1 className="mt-10 text-2xl font-bold text-red-700">My Run Tracker</h1>
        <h2 className="text-lg text-red-700">บันทึกข้อมูลการวิ่งของคุณ</h2>

        <div className="flex justify-end w-10/12">
          <Link
            href="/addtask"
            className="bg-green-500 px-8 py-1 rounded mt-5 text-gray-800 hover:bg-purple-500"
          >
            เพิ่มข้อมูลการวิ่ง
          </Link>
        </div>

        {error && (
          <p className="text-red-600 mt-3">
            เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}
          </p>
        )}

        {loading ? (
          <p className="mt-5 text-center w-10/12">กำลังโหลดข้อมูล...</p>
        ) : (
          <div className="overflow-x-auto w-10/12 mt-5">
            <table className="w-full border border-black border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black p-2">รูป</th>
                  <th className="border border-black p-2">วันที่วิ่ง</th>
                  <th className="border border-black p-2">ระยะทาง (กม.)</th>
                  <th className="border border-black p-2">สถานที่วิ่ง</th>
                  <th className="border border-black p-2">วันที่เพิ่ม</th>
                  <th className="border border-black p-2">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {runs.length > 0 ? (
                  runs.map((run) => (
                    <tr key={run.id} className="text-center">
                      <td className="border border-black p-2">
                        <div className="flex justify-center items-center">
                          {run.run_image_url && validUrl(run.run_image_url) ? (
                            <Image
                              src={run.run_image_url}
                              alt="Run Image"
                              width={50}
                              height={50} // ✅ กำหนด width+height
                              style={{ objectFit: "contain" }} // รักษา aspect ratio
                            />
                          ) : (
                            <span>ไม่มีรูป</span>
                          )}
                        </div>
                      </td>
                      <td className="border border-black p-2">
                        {run.run_date
                          ? new Date(run.run_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="border border-black p-2">
                        {run.run_distance ?? "-"}
                      </td>
                      <td className="border border-black p-2">
                        {run.run_place ?? "-"}
                      </td>
                      <td className="border border-black p-2">
                        {run.created_at
                          ? new Date(run.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="border border-black p-2">
                        <div className="flex justify-center items-center gap-4">
                          <Link
                            href={`/updatetask/${run.id}`}
                            className="text-blue-500 hover:underline"
                            style={{ textDecoration: "none" }}
                          >
                            แก้ไข
                          </Link>
                          <button
                            onClick={() => handleDelete(run.id)}
                            disabled={deletingId === run.id}
                            className="text-red-600 hover:underline bg-transparent border-none p-0 cursor-pointer disabled:opacity-50"
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              margin: 0,
                              boxShadow: "none",
                              outline: "none",
                            }}
                          >
                            {deletingId === run.id ? "กำลังลบ..." : "ลบ"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
