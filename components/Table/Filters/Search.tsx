import { debounce } from "lodash";
import { useCallback, useState } from "react";

const Search = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useCallback(
    debounce((val) => {
      if (!val) setGlobalFilter(undefined);
      if (val?.length < 2) return;
      console.log("ON CHANGE", { val });
      setGlobalFilter(val || undefined);
    }, 200),
    []
  );
  return (
    <span>
      Search:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: "1.1rem",
          border: "0",
        }}
      />
    </span>
  );
};

export default Search;
