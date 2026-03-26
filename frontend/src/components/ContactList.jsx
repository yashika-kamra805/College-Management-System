import axios from "axios";
import { useState, useEffect } from "react";

export default function ContactList({ setContacts, contacts, setEditData }) {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      const query = `?status=${filter}&search=${search}`;

      const fetchPromise = axios
        .get(`http://localhost:5000/api/contacts${query}`)
        .then((res) => setContacts(res.data))
        .catch((err) => console.log(err));

      const delay = new Promise((resolve) => setTimeout(resolve, 1000));
      await Promise.all([fetchPromise, delay]);

      setLoading(false);
    };

    fetchContacts();
  }, [filter, search, setContacts]);

  // UPDATE STATUS
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/contacts/${id}`,
        { status }
      );

      setContacts((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status } : c
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete?");
      if (!confirmDelete) return;

      await axios.delete(
        `http://localhost:5000/api/contacts/${id}`
      );

      setContacts((prev) =>
        prev.filter((c) => c._id !== id)
      );

    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  return (
    <>
      {/* FILTER + SEARCH */}
      <div className="flex gap-10">
        <select
          className="p-2 rounded bg-[#00277a] text-white cursor-pointer outline-0"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Interested">Interested</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Closed">Closed</option>
        </select>

        <input
          type="text"
          placeholder="Search by name or company"
          className="p-3 rounded w-full bg-[#eff4ff] outline-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="w-full h-[415px] flex flex-col items-center justify-center mt-10 gap-4">
          <p className="text-[#00277a] text-2xl font-semibold">
            Loading...
          </p>
        </div>
      ) : (
        <>
          {contacts.length === 0 && (
            <p className="text-center mt-10 text-xl">
              No contacts found.
            </p>
          )}

          {/* CONTACT CARDS */}
          <div className="grid grid-cols-2 gap-10 mt-10">
            {contacts.map((c) => (
              <div key={c._id}>
                <div className="bg-[#eff4ff] shadow-md rounded p-4">
                  <h3 className="font-bold text-xl">{c.name}</h3>
                  <p>{c.company}</p>
                  <p>{c.email}</p>
                  <p>{c.phone}</p>

                  {/* STATUS */}
                  <select
                    value={c.status}
                    onChange={(e) =>
                      handleStatusChange(c._id, e.target.value)
                    }
                  >
                    <option value="Interested">Interested</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Closed">Closed</option>
                  </select>

                  {/* BUTTONS */}
                  <div className="flex gap-2 mt-3">
                    
                    {/* EDIT BUTTON ✅ */}
                    <button
                      onClick={() => setEditData(c)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    {/* DELETE BUTTON ✅ */}
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}