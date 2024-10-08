import { useState, useEffect, useRef } from 'react';
import './App.css';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from './pagination/Pagination';

const getLocalItems = () => {
  const list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("Nepal");
  const [countries, setCountries] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");
  const [items, setItems] = useState(getLocalItems());
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [showForm, setShowForm] = useState(false); // State for form visibility
  const formRef = useRef(null); // Ref for form element

  const [currentPage,setCurrentPage] = useState(1)
  const [postsPerPage,setPostPerPage] = useState(5)
  const lastPostIndex = currentPage * postsPerPage
  const firstPostIndex = lastPostIndex - postsPerPage
  const currentPost = items.slice(firstPostIndex,lastPostIndex)

  // Fetch countries from API
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        const countryNames = data.map((country) => country.name.common);
        setCountries(countryNames);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false); // Hide form if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const addItems = () => {
    if (!name || !email || !phone || !dob || !city || !district || !province || !profilePicture) {
      alert("Please fill in all fields");
    } else if (name && isEdit) {
      setItems(
        items.map((item) => {
          if (item.id === editId) {
            return {
              ...item,
              name,
              email,
              phone,
              dob,
              city,
              district,
              province,
              country,
              profilePicture,
            };
          }
          return item;
        })
      );
      clearFields();
    } else {
      const allInputData = {
        id: new Date().getTime().toString(),
        name,
        email,
        phone,
        dob,
        city,
        district,
        province,
        country,
        profilePicture,
      };
      setItems([...items, allInputData]);
      clearFields();
    }
  };

  const clearFields = () => {
    setName("");
    setEmail("");
    setPhone("");
    setDob("");
    setCity("");
    setDistrict("");
    setProvince("");
    setCountry("Nepal");
    setProfilePicture("");
    setIsEdit(false); // Reset to "Add" mode
  };

  // Add data to local storage
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(items));
  }, [items]);

  // Delete items
  const handleDelete = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };

  // Handle edit
  const handleEdit = (id) => {
    const editedItem = items.find((item) => item.id === id);
    setName(editedItem.name);
    setEmail(editedItem.email);
    setPhone(editedItem.phone);
    setDob(editedItem.dob);
    setCity(editedItem.city);
    setDistrict(editedItem.district);
    setProvince(editedItem.province);
    setCountry(editedItem.country);
    setProfilePicture(editedItem.profilePicture);
    setIsEdit(true);
    setEditId(id);
    setShowForm(true); // Show form when editing
  };

  return (
    <div className='relative w-full bg-gray-100 text-black flex flex-col justify-center items-center p-8'>
      {showForm && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white rounded-lg p-6 shadow-lg w-full max-w-lg' ref={formRef}>

            

            <form onSubmit={onSubmit}>
              <input className='block mb-2 p-2 rounded text-black border w-full' type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className='block mb-2 p-2 rounded text-black border w-full' type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className='block mb-2 p-2 rounded text-black border w-full' type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input className='block mb-2 p-2 rounded text-black border w-full' type="date" placeholder="DOB" value={dob} onChange={(e) => setDob(e.target.value)} />
              <input className='block mb-2 p-2 rounded text-black border w-full' type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <input className='block mb-2 p-2 rounded text-black border w-full' type="text" placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
              <select className='block mb-2 p-2 rounded text-black border w-full' value={province} onChange={(e) => setProvince(e.target.value)}>
                <option value="">Select Province</option>
                <option value="1">Province 1</option>
                <option value="2">Province 2</option>
                <option value="3">Bagmati Province</option>
                <option value="4">Gandaki Province</option>
                <option value="5">Lumbini Province</option>
                <option value="6">Karnali Province</option>
                <option value="7">Sudurpashchim Province</option>
              </select>
              <select className='block mb-2 p-2 rounded text-black  border w-full' value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="Nepal">Nepal</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </select>
              <input className='block mb-2 p-2 rounded text-black' type="file" onChange={handleImageUpload} />
              <button onClick={addItems} className='border px-5 py-2 rounded'>{isEdit ? "Update" : "Add"}</button>
              {isEdit && (
                <button
                  type="button"
                  onClick={clearFields}
                  className='border px-5 py-2 rounded ml-2 bg-red-500 text-white'>
                  Cancel
                </button>
              )}
            </form>
          </div>
        </div>
      )}
     
        <button onClick={() => setShowForm(true)} className='border border-black font-bold text-white rounded-md px-5 py-3 mb-4 self-end bg-gradient-to-r from-blue-600 to-blue-500'>
          Add User
        </button>
      
      <table className="w-full text-left table-auto border-collapse">
        <thead className='bg-gray-400'>
          <tr>
            <th className="border border-gray-500 p-2">Name</th>
            <th className="border border-gray-500 p-2">Email</th>
            <th className="border border-gray-500 p-2">Phone</th>
            <th className="border border-gray-500 p-2">DOB</th>
            <th className="border border-gray-500 p-2">Location</th>
            <th className="border border-gray-500 p-2">Profile Picture</th>
            <th className="border border-gray-500 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPost.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-500 p-2">{item.name}</td>
              <td className="border border-gray-500 p-2">{item.email}</td>
              <td className="border border-gray-500 p-2">{item.phone}</td>
              <td className="border border-gray-500 p-2">{item.dob}</td>
              <td className="border border-gray-500 p-2">{item.city}, {item.district}, {item.province}, {item.country}</td>
              <td className="border border-gray-500 p-2">
                <img src={item.profilePicture} alt="Profile" className="w-28 h-16 object-cover" />
              </td>
              <td className="border border-gray-500 p-2">
                <div className='flex justify-center items-center gap-2'>
                <button className="text-green-600 text-2xl" onClick={() => handleEdit(item.id)}><FaRegEdit /></button>
                <button className="text-red-600 text-2xl" onClick={() => handleDelete(item.id)}><MdDelete /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        
      </table>
      <div className='mx-auto my-10'>
          <Pagination totalPosts={items.length} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage}/>
        </div>
    </div>
  );
}

export default App;
