import LayoutCompare from "@/components/Layout_compare";
import { useState } from "react";
import Form from "@/components/Form";

export default function Discovery() {
  const [showForm, setShowForm] = useState(false);

  // Function to handle button click and toggle form visibility
  const handleButtonClick = () => {
    setShowForm(!showForm);
  };

  return (
    <div>
      <LayoutCompare />
      <button onClick={handleButtonClick}>Show Form</button>
      {showForm && <Form onClose={handleButtonClick} />}
    </div>
  );
}
