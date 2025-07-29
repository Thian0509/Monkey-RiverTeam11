import { useContext } from "react";
import { AuthContext } from "../hooks/useAuth";
import { Button } from "primereact/button";

export const LogoutButton = () => {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  return <Button label="Log Out" icon="pi pi-sign-out" className="p-button-danger" onClick={auth.logout} size="small"/>;
};
