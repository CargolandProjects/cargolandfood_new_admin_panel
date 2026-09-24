import { cuisines } from "@/lib/services/cuisines.service";
import { useQuery } from "@tanstack/react-query";

export const useGetCuisines = () => {
  return useQuery({
    queryKey: ["cuisines"],
    queryFn: cuisines.getCuisines,
    select: (res) => res.data.data
  });
};
