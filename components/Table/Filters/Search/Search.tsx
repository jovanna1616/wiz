import { debounce } from "lodash";
import { useCallback, useState } from "react";
import styles from "./search.module.scss";

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
    <input
      value={value || ""}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder="Search..."
      className={styles.search}
    />
  );
};

export default Search;
