import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

async function getData() {
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ];
}

export default function MyTemplates({ userTemplates }) {
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setData(userTemplates);
  }, [userTemplates]);

  console.log(data);

  return (
    <div>
      <Button onClick={() => router.push("/templates/new")} className="mb-3">
        Create new
      </Button>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
