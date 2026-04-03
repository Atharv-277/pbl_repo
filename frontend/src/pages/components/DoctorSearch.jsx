import { useState } from "react";

// DoctorSearchForm.jsx
export default function DoctorSearchForm() {
  //const [name, setName] = useState("");
  const [speciality, setspeciality] = useState("");

  const handlesubmit = async(e)=>{
      e.preventDefault();
  }
  return (
     <div  className="flex justify-center bg-gray-50 mb-0 pb-0  ">       
    <div className="bg-white p-6 rounded-lg shadow max-w-5xl mt-25  mx-auto">
      <h2 className="text-xl font-semibold mb-5">Find A Doctor</h2>
      <form onSubmit={(e)=>{
          handlesubmit(e);
        }} className="flex flex-col sm:flex-row items-center gap-10">
       
        <input value={speciality} onChange={(e)=>{
          setspeciality(e.target.value);
        }}
          type="text"
          placeholder="Speciality"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 w-48"
        />
        <div className="flex items-center">
          <span className="mr-2 ml-25 text-gray-600">Available</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked
            />
            <div className="w-10 h-6 bg-gray-200 peer-checked:bg-teal-600 rounded-full peer relative after:content-[''] after:absolute after:left-1 after:top-1 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-4" />
          </label>
        </div>
        <button  type="submit" className="bg-teal-700 text-white px-7 cursor-pointer py-2 ml-20 rounded transition hover:bg-teal-800 font-semibold">
          Search
        </button>
      </form>
    </div>

        
          
    </div>
  );
}
