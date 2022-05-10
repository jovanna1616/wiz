import ClearFiltersComponent from "../ClearFiltersComponent";
import style from "./filtersComponent.module.scss";
import { AiOutlineCloseCircle } from "react-icons/ai";

const renderFiltersComponent = (headerGroups: any) => {
  {
    return headerGroups.map((headerGroup) => (
      <tr {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map((column) => (
          <th
            {...column.getHeaderProps((column as any).getSortByToggleProps())}
            className="pr-4"
          >
            {column.canFilter && column.Filter ? (
              <div className="flex direction-column">
                <span className="flex direction-column mr-2">
                  {column.render("Header")}
                </span>
                <span className="flex direction-column mr-2">
                  {column.render("Filter")}
                </span>
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
    <div className={style.filter}>
      <button onClick={() => setIsFilterOpened(!isFilterOpened)}>
        <AiOutlineCloseCircle fontSize={25} />
      </button>
      {renderFiltersComponent(headerGroups)}
    </div>
  );
};

export default FiltersComponent;
