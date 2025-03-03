import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MyForms({ userForms, refreshData }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(userForms);
  }, [userForms]);

  return (
    <div>
      <DataTable columns={columns(refreshData)} data={data} />
    </div>
  );
}
