import { useState, useEffect } from "react";
import axios from "axios";

export default function ContactForm({ getContacts, editData, setEditData }) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "Interested",
  });

  // 👉 AUTO-FILL WHEN EDIT CLICK
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        company: editData.company || "",
        email: editData.email || "",
        phone: editData.phone || "",
        status: editData.status || "Interested",
      });
    }
  }, [editData]);

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT (CREATE + UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editData) {
        // ✅ UPDATE
        await axios.put(
          `http://localhost:5000/api/contacts/${editData._id}`,
          form
        );
        setEditData(null);
      } else {
        // ✅ CREATE
        await axios.post(
          "http://localhost:5000/api/contacts",
          form
        );
      }

      // RESET FORM
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        status: "Interested",
      });

      getContacts(); // refresh list

    } catch (err) {
      console.log("FORM ERROR:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[400px]">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        className="p-2 border rounded"
      />

      <input
        name="company"
        value={form.company}
        onChange={handleChange}
        placeholder="Company"
        className="p-2 border rounded"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="p-2 border rounded"
      />

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="p-2 border rounded"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="p-2 border rounded"
      >
        <option value="Interested">Interested</option>
        <option value="Follow-up">Follow-up</option>
        <option value="Closed">Closed</option>
      </select>

      {/* BUTTON TEXT CHANGE */}
      <button className="bg-blue-700 text-white p-2 rounded">
        {editData ? "Update" : "Submit"}
      </button>
    </form>
  );
}