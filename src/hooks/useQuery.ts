import { useQuery } from "@tanstack/react-query";
import { getAcceptedFriends } from "../redux/api/api";

export const useAcceptedFriends = () => {
  return useQuery({
    queryKey: ["friends", "accepted"],
    queryFn: getAcceptedFriends,
  });
};
