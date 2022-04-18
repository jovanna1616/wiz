import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
} from "react-table";
// A great library for fuzzy filtering/sorting items
import matchSorter from "match-sorter";
import schema from "./rickMorty.gql";
import { useQuery, useApolloClient } from "@apollo/client";
import { Table, Paginator, TableAdditionalInfoWrapper } from "../../components";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  // const onChange = useAsyncDebounce((value) => {
  //   // TODO: rule - trigger on min 2 chars
  //   setGlobalFilter(value || undefined);
  // }, 200);
  const onChange = () => console.log("ON CHANGE");

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
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
function SliderColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={(e) => {
          setFilter(parseInt(e.target.value, 10));
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  );
}

// // This is a custom UI for our 'between' or number range
// // filter. It uses two number boxes and filters rows to
// // ones that have values between the two
// function NumberRangeColumnFilter({
//   column: { filterValue = [], preFilteredRows, setFilter, id },
// }) {
//   const [min, max] = React.useMemo(() => {
//     let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
//     let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
//     preFilteredRows.forEach((row) => {
//       min = Math.min(row.values[id], min);
//       max = Math.max(row.values[id], max);
//     });
//     return [min, max];
//   }, [id, preFilteredRows]);

//   return (
//     <div
//       style={{
//         display: "flex",
//       }}
//     >
//       <input
//         value={filterValue[0] || ""}
//         type="number"
//         onChange={(e) => {
//           const val = e.target.value;
//           setFilter((old = []) => [
//             val ? parseInt(val, 10) : undefined,
//             old[1],
//           ]);
//         }}
//         placeholder={`Min (${min})`}
//         style={{
//           width: "70px",
//           marginRight: "0.5rem",
//         }}
//       />
//       to
//       <input
//         value={filterValue[1] || ""}
//         type="number"
//         onChange={(e) => {
//           const val = e.target.value;
//           setFilter((old = []) => [
//             old[0],
//             val ? parseInt(val, 10) : undefined,
//           ]);
//         }}
//         placeholder={`Max (${max})`}
//         style={{
//           width: "70px",
//           marginLeft: "0.5rem",
//         }}
//       />
//     </div>
//   );
// }

// function fuzzyTextFilterFn(rows, id, filterValue) {
//   return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
// }

// Let the table remove the filter if the string is empty
// fuzzyTextFilterFn.autoRemove = (val: any) => !val;

// const renderFiltersComponent = (headerGroups: any) => {
//   {
//     return headerGroups.map((headerGroup) => (
//       <tr {...headerGroup.getHeaderGroupProps()}>
//         {headerGroup.headers.map((column) => (
//           <th
//             {...column.getHeaderProps((column as any).getSortByToggleProps())}
//           >
//             {column.canFilter && column.Filter ? (
//               <div style={{ display: "flex", flexDirection: "column" }}>
//                 <span>{column.render("Header")}</span>
//                 <span>{column.render("Filter")}</span>
//               </div>
//             ) : null}
//           </th>
//         ))}
//       </tr>
//     ));
//   }
// };

// const FiltersComponent = ({
//   setIsFilterOpened,
//   isFilterOpened,
//   headerGroups,
//   setAllFilters,
// }) => {
//   return (
//     <div
//       style={{
//         width: "500px",
//         height: "500px",
//         position: "absolute",
//         top: 0,
//         left: 0,
//         backgroundColor: "lightgray",
//       }}
//     >
//       <ClearFiltersComponent setAllFilters={setAllFilters} />
//       <button onClick={() => setIsFilterOpened(!isFilterOpened)}>Filter</button>
//       {renderFiltersComponent(headerGroups)}
//     </div>
//   );
// };

// const ClearFiltersComponent = ({ setAllFilters }) => {
//   return (
//     <div>
//       <button onClick={() => setAllFilters([])}>Clear Filters</button>
//     </div>
//   );
// };

// // Our table component
// function Table({ columns, data, isFilterOpened, setIsFilterOpened }: any) {
//   const filterTypes = useMemo(
//     () => ({
//       // Add a new fuzzyTextFilterFn filter type.
//       fuzzyText: fuzzyTextFilterFn,
//       // Or, override the default text filter to use
//       // "startWith"
//       text: (rows: any, id: any, filterValue: any) => {
//         return rows.filter((row: any) => {
//           const rowValue = row.values[id];
//           return rowValue !== undefined
//             ? String(rowValue)
//                 .toLowerCase()
//                 .startsWith(String(filterValue).toLowerCase())
//             : true;
//         });
//       },
//     }),
//     []
//   );
//   // RENDERS DEFAULT FILTER TO EACH COLUMN
//   // const defaultColumn = useMemo(
//   //   () => ({
//   //     // Let's set up our default Filter UI
//   //     Filter: DefaultColumnFilter,
//   //   }),
//   //   []
//   // );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//     state,
//     visibleColumns,
//     preGlobalFilteredRows,
//     setGlobalFilter,
//     setAllFilters,
//   } = useTable(
//     {
//       columns,
//       data,
//       // defaultColumn, // Be sure to pass the defaultColumn option
//       filterTypes,
//     },
//     useFilters, // useFilters!
//     useGlobalFilter, // useGlobalFilter!
//     useSortBy
//   );

//   // We don't want to render all of the rows for this example, so cap
//   // it for this use case
//   // const firstPageRows = rows.slice(0, 10);

//   return (
//     <>
//       {isFilterOpened && (
//         <FiltersComponent
//           setIsFilterOpened={setIsFilterOpened}
//           isFilterOpened={isFilterOpened}
//           headerGroups={headerGroups}
//           setAllFilters={setAllFilters}
//         />
//       )}
//       <table {...getTableProps()}>
//         <ClearFiltersComponent setAllFilters={setAllFilters} />
//         <button onClick={() => setIsFilterOpened(!isFilterOpened)}>
//           Filter
//         </button>
//         <thead>
//           <tr>
//             <th
//               colSpan={visibleColumns.length}
//               style={{
//                 textAlign: "left",
//               }}
//             >
//               <GlobalFilter
//                 preGlobalFilteredRows={preGlobalFilteredRows}
//                 globalFilter={state.globalFilter}
//                 setGlobalFilter={setGlobalFilter}
//               />
//             </th>
//           </tr>
//           {headerGroups.map((headerGroup) => (
//             <tr {...headerGroup.getHeaderGroupProps()}>
//               {headerGroup.headers.map((column) => (
//                 <th
//                   {...column.getHeaderProps(
//                     (column as any).getSortByToggleProps()
//                   )}
//                 >
//                   {column.render("Header")}
//                   {/* Render the columns filter UI */}
//                   {/* <div>{column.canFilter ? column.render("Filter") : null}</div> */}
//                   <span>
//                     {(column as any).isSorted
//                       ? (column as any).isSortedDesc
//                         ? " 🔽"
//                         : " 🔼"
//                       : " 🔽🔼"}
//                   </span>
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody {...getTableBodyProps()}>
//           {rows.map((row, i) => {
//             prepareRow(row);
//             return (
//               <tr {...row.getRowProps()}>
//                 {row.cells.map((cell) => {
//                   return (
//                     <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
//                   );
//                 })}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//       <br />
//       <div>Showing the first 20 results of {rows.length} rows</div>
//       {/* <div>
//         <pre>
//           <code>{JSON.stringify(state.filters, null, 2)}</code>
//         </pre>
//       </div> */}
//     </>
//   );
// }

// // Define a custom filter filter function!
// function filterGreaterThan(rows, id, filterValue) {
//   return rows.filter((row) => {
//     const rowValue = row.values[id];
//     return rowValue >= filterValue;
//   });
// }

// // This is an autoRemove method on the filter function that
// // when given the new filter value and returns true, the filter
// // will be automatically removed. Normally this is just an undefined
// // check, but here, we want to remove the filter if it's not a number
// filterGreaterThan.autoRemove = (val) => typeof val !== "number";

const getCols = (isFilterOpened: boolean) =>
  useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        // Filter: isFilterOpened ? DefaultColumnFilter : false,
      },
      {
        Header: "Name",
        accessor: "name",
        // Use our custom `fuzzyText` filter on this column
        // filter: "fuzzyText",
        // Filter: isFilterOpened ? DefaultColumnFilter : false,
        // disableFilters: true,
        Filter: isFilterOpened ? DefaultColumnFilter : false,
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Species",
        accessor: "species",
        Filter: isFilterOpened ? DefaultColumnFilter : false,
      },
    ],
    [isFilterOpened]
  );

const transformer = (data: any) => {
  return (
    data?.characters.results.map(({ id, name, status, species }) => ({
      id,
      name,
      status,
      species,
    })) || []
  );
};
function App() {
  const { data, loading, error, refetch, fetchMore } = useQuery(
    schema.characters
  );
  const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);

  const { cache } = useApolloClient();

  const mappedData = useMemo(() => transformer(data), [data]);

  const listInnerRef = useRef();

  // useEffect(() => {
  //   refetch({ page: data?.characters?.info?.next });
  // }, [filters]);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        fetchMore({ variables: { page: data?.characters?.info?.next } });
      }
    }
  };

  return (
    <>
      <div
        onScroll={onScroll}
        ref={listInnerRef}
        style={{ height: "500px", overflowY: "auto" }}
      >
        {/* TODO: this is for different table layout proof of concept */}
        {/* <TableAdditionalInfoWrapper>
          <Paginator
            paginatorData={{
              count: data?.characters?.info?.count,
              length: data?.characters?.results?.length,
            }}
          />
        </TableAdditionalInfoWrapper> */}
        <Table
          onScroll={onScroll}
          ref={listInnerRef}
          isFilterOpened={isFilterOpened}
          setIsFilterOpened={setIsFilterOpened}
          columns={getCols(isFilterOpened)}
          data={mappedData}
        />
      </div>
      <Paginator
        paginatorData={{
          count: data?.characters?.info?.count,
          length: data?.characters?.results?.length,
        }}
      />
    </>
  );
}

export default App;
