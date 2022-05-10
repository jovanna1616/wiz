import styles from "./paginator.module.scss";

const Paginator = ({ paginatorData: { count, length } }) => (
  <div className={styles.paginator}>
    Showing the first <span className="font-normal">{length}</span> results of{" "}
    <span className="font-normal">{count}</span> rows
  </div>
);

export default Paginator;
