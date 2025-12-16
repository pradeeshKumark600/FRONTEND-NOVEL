import styles from './DataTable.module.scss';

/**
 * DataTable Component
 *
 * Reusable table component for displaying data in admin pages
 *
 * Props:
 * - columns: Array of column definitions [{ key, label, render? }]
 * - data: Array of data objects
 * - onRowClick: Optional callback when row is clicked
 * - actions: Optional render function for row actions
 * - emptyMessage: Message to show when no data
 */

const DataTable = ({
  columns = [],
  data = [],
  onRowClick,
  actions,
  emptyMessage = 'No data available'
}) => {
  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📋</div>
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={styles.th}>
                {column.label}
              </th>
            ))}
            {actions && <th className={styles.th}>Actions</th>}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={`${styles.tr} ${onRowClick ? styles.clickable : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <td key={column.key} className={styles.td}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              {actions && (
                <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.actions}>
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
