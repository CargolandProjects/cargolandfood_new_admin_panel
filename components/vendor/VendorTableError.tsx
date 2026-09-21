import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "../ui/table";

interface TableErrorProps {
  colSpan: number;
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

const TableError = ({
  colSpan,
  title = "Something went wrong",
  description = "We couldn't load the data. Please try again.",
  onRetry,
  isRetrying,
}: TableErrorProps) => {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="p-0">
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            <p className="max-w-sm text-xs text-gray-500">{description}</p>
          </div>

          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              disabled={isRetrying}
              className="mt-1 gap-2 rounded-full border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRetrying && "animate-spin"}`}
              />
              {isRetrying ? "Retrying..." : "Try again"}
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TableError;
