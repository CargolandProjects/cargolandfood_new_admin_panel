import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function MenuRowSkeleton() {
  return (
    <TableRow className="border-b border-gray-50 hover:bg-transparent">
      <TableCell className="pl-6">
        <Skeleton className="h-4 w-4 rounded-[4px]" />
      </TableCell>

      {/* Name + image */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-[130px] rounded" />
            <Skeleton className="h-3 w-[70px] rounded" />
          </div>
        </div>
      </TableCell>

      {/* Category */}
      <TableCell>
        <Skeleton className="h-6 w-[88px] rounded-md" />
      </TableCell>

      {/* Description */}
      <TableCell>
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-[160px] rounded" />
          <Skeleton className="h-3 w-[110px] rounded" />
        </div>
      </TableCell>

      {/* Price */}
      <TableCell>
        <Skeleton className="h-3.5 w-[64px] rounded" />
      </TableCell>

      {/* Addons */}
      <TableCell>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-[96px] rounded" />
          <Skeleton className="h-3 w-[78px] rounded" />
        </div>
      </TableCell>

      {/* Sizes */}
      <TableCell>
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-[46px] rounded-md" />
          <Skeleton className="h-6 w-[56px] rounded-md" />
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="pr-6">
        <div className="flex justify-end">
          <Skeleton className="h-4 w-4 rounded" />
        </div>
      </TableCell>
    </TableRow>
  );
}
