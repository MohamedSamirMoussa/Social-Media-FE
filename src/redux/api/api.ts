export const getAcceptedFriends = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/profile/all-requests?status=accepted`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  
  const data = await response.json();
  if (!response.ok) {
    
    throw new Error("Fail to fetch friends");
  }


  return data;
};
