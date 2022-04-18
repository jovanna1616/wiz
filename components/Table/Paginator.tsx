const Paginator = ({ paginatorData: { count, length } }) => (
  <div>
    Showing the first {length} results of {count} rows
  </div>
);

export default Paginator;
