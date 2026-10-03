"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { PromotionMenuItem } from "./CreatePromoPageContent";

interface MenuItemComboboxProps {
  items: PromotionMenuItem[];
  selected: PromotionMenuItem[];
  onToggle: (item: PromotionMenuItem) => void;
  search: string;
  onSearchChange: (search: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const getMenuCode = (id: string) => `CLF-${id.slice(-4).toUpperCase()}`;

export default function MenuItemCombobox({
  items,
  selected,
  onToggle,
  search,
  onSearchChange,
  isLoading,
  placeholder = "All menu items",
}: MenuItemComboboxProps) {
  return (
    <Combobox
      multiple
      items={items}
      itemToStringValue={(item) => item.name}
      isItemEqualToValue={(a, b) => a.id === b.id}
      value={selected}
      onValueChange={(next) => {
        const nextIds = new Set(next.map((i) => i.id));
        const currentIds = new Set(selected.map((i) => i.id));

        next.filter((i) => !currentIds.has(i.id)).forEach(onToggle);
        selected.filter((i) => !nextIds.has(i.id)).forEach(onToggle);
      }}
    >
      <ComboboxInput
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        showTrigger
        showClear={selected.length > 0}
        className="form-input"
      />

      <ComboboxContent>
        <ComboboxEmpty>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2 py-4 text-sm text-neutral-400">
              <Loader2 className="size-4 animate-spin" />
              Searching...
            </span>
          ) : (
            "No menu items found."
          )}
        </ComboboxEmpty>

        <ComboboxList>
          {items.map((item) => (
            <ComboboxItem
              key={item.id}
              value={item}
              showIndicator={false}
              className="cursor-pointer gap-3 px-3 py-2.5"
            >
              <div className="relative size-10 shrink-0">
                <Image
                  src={item.uploadImageUrl}
                  alt={item.name}
                  fill
                  sizes="40px"
                  className="rounded-md object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {item.name}
                </p>
                <p className="truncate text-xs text-gray-400">
                  {item.description || getMenuCode(item.id)}
                </p>
              </div>

              <Checkbox
                checked={selected.some((s) => s.id === item.id)}
                tabIndex={-1}
                aria-hidden
                className="pointer-events-none border-neutral-500"
              />
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
