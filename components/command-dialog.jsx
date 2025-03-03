import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export function CommandDialog() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const [templatesData, setTemplatesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm) {
      async function fetchTemplates() {
        try {
          const res = await fetch(`/api/template/search?query=${searchTerm}`);
          if (!res.ok) {
            throw new Error("Error fetching templates");
          }
          const data = await res.json();

          setTemplatesData(data);
        } catch (err) {
          console.error("Error", err.message);
        }
      }
      fetchTemplates();
    } else {
      setTemplatesData([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setTemplatesData([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:ml-auto sm:w-auto inline-flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64"
        >
          {t("search")}...
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 rounded-lg">
        {/* Hidden title for screen readers */}
        <DialogTitle className="sr-only">Command Dialog</DialogTitle>
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput
            placeholder="Type a command or search..."
            onValueChange={(value) => {
              setSearchTerm(value);
            }}
          />
          {templatesData.length > 0 ? (
            <CommandList>
              <CommandGroup heading="Templates">
                {templatesData.map((template) => (
                  <CommandItem
                    key={template.id}
                    value={template.title}
                    className="cursor-pointer"
                    onSelect={() => {
                      router.push(`/form/${template.id}`);
                      setOpen(false);
                    }}
                  >
                    <span>{template.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          ) : (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
        </Command>
      </DialogContent>
    </Dialog>
  );
}
