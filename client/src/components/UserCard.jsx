import React from "react";

const UserCard = ({ user, isProfile }) => {
  return (
    <div className="flex flex-row items-center gap-2 ">
      <img src="/placeholder.png" alt="" className="w-10 h-10" />
      <div className="flex flex-col">
        <span className="text-lg font-semibold capitalize">{user?.name}</span>
        {!isProfile && (
          <span
            className={`text-xs capitalize ${
              user?.status === "available" ? "text-green-500" : "text-red-500"
            }`}
          >
            {user?.status}
          </span>
        )}
      </div>
    </div>
  );
};

export default UserCard;
