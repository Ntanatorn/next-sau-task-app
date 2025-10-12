"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import taskImage from "../../assets/images/task.png";
import Footer from "@/components/Footer";

type Task = {
  id: string;
  created_at: string;
  title: string;
  detail: string;
  image_url: string | null;
  is_completed: boolean | null;
  update_at: string;
};

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
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

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("task_tb").select("*");
    if (error) {
      console.error("Error fetching tasks:", error);
      setError(error.message);
      setTasks([]);
    } else {
      setTasks(data || []);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("แน่ใจหรือไม่ว่าจะลบงานนี้?");
    if (!confirmDelete) return;

    setDeletingId(id);
    const { error } = await supabase.from("task_tb").delete().eq("id", id);
    setDeletingId(null);

    if (error) {
      alert("ลบงานไม่สำเร็จ: " + error.message);
    } else {
      alert("ลบงานสำเร็จ");
      fetchTasks();
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <Image className="mt-15" src={taskImage} alt="Task" width={100} />

        <h1 className="mt-10 text-2xl font-bold text-red-700">Manage Task App</h1>
        <h2 className="text-lg text-red-700">บริหารจัดการงานที่ทำ</h2>

        <div className="flex justify-end w-10/12">
          <Link
            href="/addtask"
            className="bg-green-500 px-8 py-1 rounded mt-5 text-gray-800 hover:bg-purple-500"
          >
            เพิ่มงาน
          </Link>
        </div>

        {error && (
          <p className="text-red-600 mt-3">เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}</p>
        )}

        {loading ? (
          <p className="mt-5 text-center w-10/12">กำลังโหลดข้อมูล...</p>
        ) : (
          <div className="overflow-x-auto w-10/12 mt-5">
            <table className="w-full border border-black border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black p-2">รูป</th>
                  <th className="border border-black p-2">งานที่ต้องทำ</th>
                  <th className="border border-black p-2">รายละเอียดงาน</th>
                  <th className="border border-black p-2">สถานะ</th>
                  <th className="border border-black p-2">วันที่เพิ่ม</th>
                  <th className="border border-black p-2">วันที่แก้ไข</th>
                  <th className="border border-black p-2">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task.id} className="text-center">
                      <td className="border border-black p-2">
                        <div className="flex justify-center items-center">
                          {task.image_url && validUrl(task.image_url) ? (
                            <Image
                              src={task.image_url}
                              alt={task.title}
                              width={50}
                              height={50}
                            />
                          ) : (
                            <span>ไม่มีรูป</span>
                          )}
                        </div>
                      </td>
                      <td className="border border-black p-2">{task.title}</td>
                      <td className="border border-black p-2">{task.detail}</td>
                      <td className="border border-black p-2">
                        {task.is_completed ? "✔️ เสร็จสิ้น" : "❌ ยังไม่เสร็จ"}
                      </td>
                      <td className="border border-black p-2">
                        {task.created_at
                          ? new Date(task.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="border border-black p-2">
                        {task.update_at
                          ? new Date(task.update_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="border border-black p-2">
                        <div className="flex justify-center items-center gap-4">
                          <Link
                            href={`/edittask/${task.id}`}
                            className="text-blue-500 hover:underline"
                            style={{ textDecoration: "none" }}
                          >
                            แก้ไข
                          </Link>
                          <button
                            onClick={() => handleDelete(task.id)}
                            disabled={deletingId === task.id}
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
                            {deletingId === task.id ? "กำลังลบ..." : "ลบ"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-4">
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
