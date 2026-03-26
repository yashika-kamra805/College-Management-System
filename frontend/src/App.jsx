import { useState, useEffect } from "react";
import axios from "axios";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [editData, setEditData] = useState(null); // ✅ ADD THIS

  // ✅ FETCH CONTACTS
  const getContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contacts");
      setContacts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ LOAD DATA ON START
  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className="p-8 max-w-[1440px] mx-auto grid grid-cols-3 gap-[70px]">
      
      {/* LEFT SIDE (FORM) */}
      <div className="col-span-1 space-y-4">
        <h1 className="text-[32px] font-bold mb-10 text-[#00277a]">
          Contact Management
        </h1>

        <ContactForm
          getContacts={getContacts}     // ✅ IMPORTANT
          editData={editData}           // ✅ IMPORTANT
          setEditData={setEditData}     // ✅ IMPORTANT
        />
      </div>

      {/* RIGHT SIDE (LIST) */}
      <div className="col-span-2">
        <ContactList
          contacts={contacts}
          setContacts={setContacts}
          setEditData={setEditData}     // ✅ IMPORTANT
        />
      </div>

    </div>
  );
}