import { matchSorter } from "match-sorter";

const useCustomFilters = () => {
  // Let the table remove the filter if the string is empty
  // fuzzyTextFilterFn.autoRemove = (val: any) => !val;
  const fuzzyText = (rows, id, filterValue) => {
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
  };

  const text = (rows: any, id: any, filterValue: any) => {
    return rows.filter((row: any) => {
      const rowValue = row.values[id];
      return rowValue !== undefined
        ? String(rowValue)
            .toLowerCase()
            .startsWith(String(filterValue).toLowerCase())
        : true;
    });
  };

  return { fuzzyText, text };
};

export default useCustomFilters;
