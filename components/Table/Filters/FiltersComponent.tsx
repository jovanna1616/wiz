import ClearFiltersComponent from "./ClearFiltersComponent";

const renderFiltersComponent = (headerGroups: any) => {
  {
    return headerGroups.map((headerGroup) => (
      <tr {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map((column) => (
          <th
            {...column.getHeaderProps((column as any).getSortByToggleProps())}
          >
            {column.canFilter && column.Filter ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>{column.render("Header")}</span>
                <span>{column.render("Filter")}</span>
              </div>
            ) : null}
          </th>
        ))}
      </tr>
    ));
  }
};

const FiltersComponent = ({
  setIsFilterOpened,
  isFilterOpened,
  headerGroups,
  setAllFilters,
}) => {
  return (
    <div
      style={{
        width: "500px",
        height: "500px",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "lightgray",
      }}
    >
      <ClearFiltersComponent setAllFilters={setAllFilters} />
      <button onClick={() => setIsFilterOpened(!isFilterOpened)}>Filter</button>
      {renderFiltersComponent(headerGroups)}
    </div>
  );
};

export default FiltersComponent;
