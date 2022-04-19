const ClearFiltersComponent = ({ setAllFilters }) => {
  return (
    <div>
      <button onClick={() => setAllFilters([])}>Clear Filters</button>
    </div>
  );
};

export default ClearFiltersComponent;
