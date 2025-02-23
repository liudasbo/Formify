import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MyTemplates({ userTemplates, refreshData }) {
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setData(userTemplates);
  }, [userTemplates]);

  return (
    <div>
      <Button onClick={() => router.push("/templates/new")} className="mb-3">
        Create new
      </Button>
      <DataTable columns={columns(refreshData)} data={data} />
    </div>
  );
}
