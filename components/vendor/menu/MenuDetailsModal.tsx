import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MenuItem } from "@/lib/services/vendor.service";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface MenuDetailsProps {
  open: boolean;
  onOpenChange: (id: string) => void;
  menu: MenuItem;
}

const MenuDetailsModal = ({ open, onOpenChange, menu }: MenuDetailsProps) => {
  const router = useRouter();

  const addons = menu.addons || [];
  const sizes = menu.sizes || [];

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(menu.id)}>
      <DialogContent
        showCloseButton={false}
        className="max-w-100! gap-0 overflow-y-auto! min-h-[300px] max-h-[calc(100vh-1rem)] border-none px-7 py-6 shadow-xl hide-scrollbar"
      >
        {/* Header */}
        <DialogHeader className="gap-0">
          <div className="mb-5 flex items-start justify-between relative">
            <DialogTitle className="text-2xl font-bold">
              Menu Details
            </DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(menu.id)}
              aria-label="Close"
              className="absolute -top-2 right-0 flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
            >
              <X className="size-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="relative mt-1 h-[91px]">
          <Image
            src={menu.uploadImageUrl}
            alt={menu.name}
            className="size-full object-cover rounded-sm"
            fill
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <p className="text-base leading-5 text-gray-600">Menu name</p>
            <p className="mt-3 text-base font-medium">{menu.name}</p>
          </div>

          <div>
            <p className="text-base text-gray-600">Addons</p>
            <p className="mt-3 text-base font-medium">
              {addons.length === 0 && (
                <span className="text-xs text-gray-400">—</span>
              )}
              {addons.length > 0 && (
                <ul className="space-y-1">
                  {addons.slice(0, 2).map((addon, idx, adns) => {
                    const showExCount =
                      idx === adns.length - 1 && addons.length > 2;
                    return (
                      <li key={addon.id} className="flex items-center gap-0.5">
                        <p className="text-[10px] font-medium px-1 py-0.5 w-fit rounded-[4px] bg-gray-100 text-gray-600">
                          {addon.name}
                        </p>{" "}
                        {showExCount && (
                          <p className="ml-0.5 text-[10px] font-medium text-gray-600">
                            +{addons.length - 2}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-base leading-5 text-gray-600">Description</p>
          <p className="mt-3 text-base font-medium line-clamp-1">
            {menu.description}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <p className="text-base leading-5 text-gray-600">Category</p>
            <p className="mt-3 text-base font-medium">{menu.category?.name}</p>
          </div>

          <div>
            <p className="text-base text-gray-600">Size</p>
            <p className="mt-3 text-base font-medium">
              {sizes.length === 0 && (
                <span className="text-xs text-gray-400">—</span>
              )}
              {sizes.length > 0 && (
                <ul className="space-y-1">
                  {sizes.slice(0, 2).map((size, idx, adns) => {
                    const showSzsCount =
                      idx === adns.length - 1 && sizes.length > 2;
                    return (
                      <li key={size.id} className="flex items-center gap-0.5">
                        <p className="px-2.5 py-0.5 text-[10px] w-fit font-medium text-rose-600 bg-rose-50 rounded-sm">
                          {size.name}
                        </p>{" "}
                        {showSzsCount && (
                          <p className="ml-0.5 text-[10px] font-medium text-gray-600">
                            +{sizes.length - 2}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-base leading-5 text-gray-600">Price</p>
          <p className="mt-3 text-base font-medium line-clamp-1">
            ₦{menu.price}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-7 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(menu.id)}
            className="h-11 flex-1 rounded-lg border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() =>
              router.push(
                `/vendor-management/${menu.vendorId}/menu/create-menu?action=Edit&menuId=${menu.id}`,
              )
            }
            className="h-11 flex-1 rounded-lg bg-[#F16622] text-sm font-semibold text-white hover:bg-[#d95b1c]"
          >
            Edit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuDetailsModal;
