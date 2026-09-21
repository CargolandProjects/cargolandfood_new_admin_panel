import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

const TransactionRowSkeleton = () => {
  return (
    <TableRow className="border-b border-gray-50 hover:bg-transparent">
      {/* Checkbox */}
      <TableCell className="pl-6">
        <Skeleton className="h-4 w-4 rounded-[4px]" />
      </TableCell>

      {/* ID */}
      <TableCell>
        <Skeleton className="h-3.5 w-[76px] rounded" />
      </TableCell>

      {/* Details */}
      <TableCell>
        <Skeleton className="h-3.5 w-[160px] rounded" />
      </TableCell>

      {/* Type badge */}
      <TableCell>
        <Skeleton className="h-5 w-[68px] rounded-md" />
      </TableCell>

      {/* Amount */}
      <TableCell>
        <Skeleton className="h-3.5 w-[64px] rounded" />
      </TableCell>

      {/* Date/Time — two lines */}
      <TableCell>
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-[88px] rounded" />
          <Skeleton className="h-3 w-[64px] rounded" />
        </div>
      </TableCell>

      {/* Method */}
      <TableCell>
        <Skeleton className="h-3.5 w-[96px] rounded" />
      </TableCell>

      {/* Status pill */}
      <TableCell className="pr-6">
        <Skeleton className="h-6 w-[92px] rounded-full" />
      </TableCell>
    </TableRow>
  );
};

export default TransactionRowSkeleton;
