import React, { useState } from 'react'
import model from '../assets/b9c139ffb12fcc66f56b3da659d94c5233ec920f (2).png'
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    grade: '',
    section: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const { studentId, firstName, lastName, grade, section } = formData;

    if (studentId && firstName && lastName && grade && section) {
      navigate('/level1');
    } else {
      alert('Please fill in all fields before continuing.');
    }
  };

  return (
    <div className="flex flex-1 relative h-screen bg-violet-500 overflow-hidden items-center justify-center p-4 md:justify-end">
      {/* Image */}
      <img
        src={model}
        alt="model"
        className="max-w-full h-auto transform scale-x-[-1] absolute left-[-150px] bottom-[-100px]
                   md:left-[-150px] md:bottom-[-100px]
                   sm:left-[-100px] sm:bottom-[-80px]
                   max-sm:w-[500px]"
      />

      {/* Registration Form */}
      <div
        className="bg-white md:bg-white/100 sm:bg-transparent 
                   p-6 sm:p-4 md:p-8 rounded-2xl shadow-lg z-10 
                   w-full max-w-[350px] 
                   sm:absolute sm:top-[60%] sm:translate-y-[-50%] sm:text-center 
                   md:static md:translate-y-0 md:text-left md:mr-[80px]"
      >
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-pink-700 font-semibold mb-1">Student ID</label>
            <input
              type="text"
              name="studentId"
              placeholder="Enter Student ID"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-pink-700 font-semibold mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-pink-700 font-semibold mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-pink-700 font-semibold mb-1">Grade</label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="" disabled>Select Grade</option>
              {[1, 2, 3, 4, 5, 6].map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-pink-700 font-semibold mb-1">Section</label>
            <input
              type="text"
              name="section"
              placeholder="Enter Section"
              value={formData.section}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white font-semibold py-2 rounded-lg hover:bg-pink-700 transition-all"
          >
            LET'S START!
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
