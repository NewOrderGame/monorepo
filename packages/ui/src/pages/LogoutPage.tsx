import {useAuth} from "../utils/auth";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export function LogoutPage() {
  const auth = useAuth()
  const navigate = useNavigate();
  useEffect(() => {
    auth.signOut(() => {
      navigate('/');
    });
  });
  return null;
}
