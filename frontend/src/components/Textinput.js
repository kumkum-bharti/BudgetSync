// src/components/Textinput.js
export default function Textinput({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1 ">
      <input
        placeholder={label}
        type="text"
        value={value}
        onChange={onChange}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}
