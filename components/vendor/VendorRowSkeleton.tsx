import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

const VendorRowSkeleton = () => {
  return (
    <TableRow className="border-b border-gray-50 hover:bg-transparent">
      {/* Checkbox */}
      <TableCell className="pl-6">
        <Skeleton className="h-4 w-4 rounded-[4px]" />
      </TableCell>

      {/* Vendors — avatar + 3 lines */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0 space-y-1.5">
            <Skeleton className="h-3 w-[160px] rounded" />
            {/* <Skeleton className="h-3 w-[200px] rounded" /> */}
            <Skeleton className="h-3 w-[120px] rounded" />
          </div>
        </div>
      </TableCell>

      {/* Mobile Number */}
      <TableCell>
        <Skeleton className="h-3.5 w-[110px] rounded" />
      </TableCell>

      {/* Category */}
      <TableCell>
        <Skeleton className="h-3.5 w-[90px] rounded" />
      </TableCell>

      {/* Revenue */}
      <TableCell>
        <Skeleton className="h-3.5 w-[60px] rounded" />
      </TableCell>

      {/* Pending Payout */}
      <TableCell>
        <Skeleton className="h-3.5 w-[60px] rounded" />
      </TableCell>

      {/* Rating */}
      <TableCell>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3.5 w-[28px] rounded" />
        </div>
      </TableCell>

      {/* Status pill */}
      <TableCell>
        <Skeleton className="h-6 w-[72px] rounded-full" />
      </TableCell>

      {/* Action */}
      <TableCell className="pr-6">
        <div className="flex justify-end">
          <Skeleton className="h-4 w-4 rounded" />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default VendorRowSkeleton;
