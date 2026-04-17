import { useState } from "react";
import frameworkData from "./framework.json";

export default function FrameworkListSearchFilter() {
  /** Deklrasai state **/
  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedTag, setSelectedTag] = useState("");

  /*Inisialisasi DataForm*/
		const [dataForm, setDataForm] = useState({
			searchTerm: "",
			selectedTag: "",
			/*Tambah state lain beserta default value*/
			});
		
		/*Inisialisasi Handle perubahan nilai input form*/
		const handleChange = (evt) => {
			const { name, value } = evt.target;
			setDataForm({
				...dataForm,
				[name]: value,
			});
		};
  
  /** Deklrasai Logic Search & Filter **/
  const _searchTerm = dataForm.searchTerm.toLowerCase();
  const filteredFrameworks = frameworkData.filter((framework) => {
    const matchesSearch =
      framework.name
				.toLowerCase()
				.includes(_searchTerm) ||
      framework.description
				.toLowerCase()
				.includes(_searchTerm);

    const matchesTag = dataForm.selectedTag ? framework.tags.includes(selectedTag) : true;

    return matchesSearch && matchesTag;
  });

  const allTags = [
    ...new Set(frameworkData.flatMap((framework) => framework.tags)),
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Modern Frameworks
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Kumpulan teknologi terbaik untuk membangun aplikasi web modern.
        </p>
      </div>

      <input
        type="text"
        name="searchTerm"
        placeholder="Search framework..."
        className="w-full p-2 border border-gray-300 rounded mb-4"
        onChange={handleChange}
      />

      <select
        name="selectedTag"
        className="w-full p-2 border border-gray-300 rounded mb-4"
        onChange={handleChange}
      >
       <option value="">All Tags</option>
        {allTags.map((tag, index) => (
        <option key={index} value={tag}>
        {tag}
        </option>
        ))}
        
      </select>

      {/* Grid Container */}
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredFrameworks.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white border border-cyan-500 p-6 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-5 hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              {/* Header Card */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-blue-50 text-blue-600 rounded">
                  2013
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-500 px-2.5 py-0.5 text-xs font-medium rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Card */}
            <div className="pt-4 border-t border-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">
                    Developer
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {item.details.developer}
                  </p>
                </div>
                <a
                  href={item.details.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Visit Site
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
