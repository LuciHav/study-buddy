import { useState } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ItemSelector({
  value = [],
  onChange,
  placeholder = "Type and press Enter",
}) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  const addItem = () => {
    if (inputValue.trim()) {
      const newItems = [...value, inputValue.trim()];
      onChange(newItems);
      setInputValue("");
    }
  };

  const removeItem = (indexToRemove) => {
    const newItems = value.filter((_, index) => index !== indexToRemove);
    onChange(newItems);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button type="button" variant="secondary" onClick={addItem}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-md"
          >
            <span>{item}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 rounded-full hover:bg-gray-900"
              onClick={() => removeItem(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
