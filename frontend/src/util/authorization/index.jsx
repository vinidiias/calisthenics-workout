import { useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useEffect } from "react";
import { useContext } from "react";
import { socket } from "../../services/socket";
import { Navigate } from "react-router-dom";

export const withProtectedRole = (ComponentToProtect, redirectPath = "/") => {
  return function NewComponent(props) {
    const [friendOnline, setFriendsOnline] = useState([]);

    const { user } = useContext(UserContext);
    useEffect(() => {
      if (!user.isLogged || !user._id) {
        return
      }

      socket.emit("authenticate", user._id);
    }, [user._id, user.isLogged, user]);

    useEffect(() => {
      function onActiveUsers(activeUsers) {
        setFriendsOnline(activeUsers);
      }

      function onDisconnect() {
        setFriendsOnline(new Set());
      }

      socket.on("disconnect", onDisconnect);
      socket.on("active-users", onActiveUsers);

      return () => {
        socket.off("active-users", onActiveUsers);
      };
    }, [user._id, user.isLogged]);

    if (!user.isLogged) {
      return <Navigate to={redirectPath} />;
    }

    return <ComponentToProtect {...props} activeFriends={friendOnline} userId={user._id} />;
  }
};