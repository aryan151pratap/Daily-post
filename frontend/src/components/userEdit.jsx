import React, { useState, useEffect } from "react";

const VITE_BACKEND = import.meta.env.VITE_BACKEND;

export default function EditProfile({ data, setData, setEdit }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    image: "",
    bio: "",
    bgColor: ""
  });

  useEffect(() => {
    if (data) {
      setForm({
        username: data.username || "",
        email: data.email || "",
        image: data.image || "",
        bio: data.bio || "",
        bgColor: data.bgColor || ""
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setForm(prev => ({
        ...prev,
        image: reader.result   // this is base64
      }));
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${VITE_BACKEND}/edit/${data._id}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(form)
	});
	const result = await res.json();
	if(res.ok){
		setData(result.user);
		setEdit(false);
	}
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="md:max-w-md sm:w-md bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Username</label>
        <input
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Image</label>
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500"
        />
        {form.image && (
          <img
            src={form.image}
            alt="preview"
            className="mt-2 w-fit h-20 object-cover rounded-md"
          />
        )}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-gray-700 text-sm font-medium">Background Color</label>
        <input
          name="bgColor"
          type="text"
          value={form.bgColor}
          onChange={handleChange}
          className="px-2 p-1 text-sm border border-blue-200 rounded-md outline-none"
        />
        <div
          className={`${form.bgColor} p-4 px-6 ml-auto rounded-md`}
        />
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => setEdit(false)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
