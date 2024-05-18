/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/

import React, { useEffect, useState } from "react";

export function ClientSide({ children }: React.PropsWithChildren) {
  const [onClient, setOnClient] = useState(false);

  useEffect(() => {
    setOnClient(true);
  }, []);

  if (onClient) {
    return <>{children}</>;
  }
  return <></>;
}
