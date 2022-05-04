import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useAuth} from "../utils/auth";

export function RootPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user) {
      navigate("/game");
    } else {
      navigate("/login");
    }
  })
  return null;
}
