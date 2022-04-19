import { debounce } from "lodash";
import { useEffect, useRef } from "react";

const useServerFilters = ({ tableState, onFiltersChanged }) => {
  const debouncedRefetch = useRef(
    debounce((filters, globalFilter) => {
      const filterVariables = {
        filter: {
          name: globalFilter,
          ...Object.fromEntries(filters.map(({ id, value }) => [id, value])),
        },
      };
      console.log({ filterVariables });
      onFiltersChanged(filterVariables);
    }, 200)
  );

  useEffect(() => {
    debouncedRefetch.current(tableState.filters, tableState.globalFilter);
  }, [tableState.filters, tableState.globalFilter]);
};

export default useServerFilters;
