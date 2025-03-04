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
      <Button
        className="text-sm mb-2"
        variant="outline"
        onClick={() => router.push("/templates/new")}
      >
        Create new
      </Button>
      <DataTable columns={columns(refreshData)} data={data} />
    </div>
  );
}
