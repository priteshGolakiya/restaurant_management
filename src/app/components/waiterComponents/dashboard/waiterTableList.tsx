import { Card } from "antd";
import Title from "antd/es/typography/Title";

interface TableNumber {
  tableid: number;
  noOfSeats: number;
  tableNumber: number;
  isReserved: boolean;
  isActive: boolean;
  time_to: string | null;
  time_end: string | null;
  note: string | null;
}

interface TableListProps {
  tables: TableNumber[];
  onTableClick: (table: TableNumber) => void;
}

const WaiterTableList: React.FC<TableListProps> = ({
  tables,
  onTableClick,
}) => {
  return (
    <div>
      <div className="mb-4">
        <Title level={2}>Restaurant Tables</Title>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <Card
            key={table.tableid}
            title={
              <span className="text-lg font-semibold">{`Table ${table.tableNumber}`}</span>
            }
            extra={
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  table.isActive
                    ? table.isReserved
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {table.isActive
                  ? table.isReserved
                    ? "Reserved"
                    : "Available"
                  : "Inactive"}
              </span>
            }
            hoverable={table.isActive}
            onClick={table.isActive ? () => onTableClick(table) : undefined}
            className={`cursor-pointer shadow-md rounded-lg transition-transform duration-200 transform ${
              table.isActive ? "hover:scale-105" : "opacity-50"
            }`}
            style={{
              backgroundColor: "white",
              border: "1px solid #f0f0f0",
            }}
          >
            <p className="p-4 text-center">
              {table.isActive ? "Click to view details" : "Table is not active"}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WaiterTableList;
