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
  CommandSeparator,
} from "@/components/ui/command";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  BookText,
  Search,
  User,
  Calendar,
  Loader2,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function CommandDialog() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const [templatesData, setTemplatesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      const timer = setTimeout(() => {
        async function fetchTemplates() {
          try {
            setIsLoading(true);
            const res = await fetch(`/api/template/search?query=${searchTerm}`);
            if (!res.ok) {
              throw new Error("Error fetching templates");
            }
            const data = await res.json();
            setTemplatesData(data);
          } catch (err) {
            console.error("Error", err.message);
          } finally {
            setIsLoading(false);
          }
        }
        fetchTemplates();
      }, 300);

      return () => clearTimeout(timer);
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
        <DialogTitle className="sr-only">Search Templates</DialogTitle>
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Search templates..."
            onValueChange={setSearchTerm}
          />

          {isLoading ? (
            <div className="py-6 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">
                Searching templates...
              </p>
            </div>
          ) : templatesData.length > 0 ? (
            <CommandList>
              <CommandGroup heading="Templates">
                {templatesData.map((template) => (
                  <CommandItem
                    key={template.id}
                    value={template.title}
                    className="cursor-pointer px-4 py-2"
                    onSelect={() => {
                      router.push(`/form/${template.id}`);
                      setOpen(false);
                    }}
                  >
                    <div className="flex flex-col w-full max-w-[90%]">
                      <div className="flex items-center gap-2 mb-1 w-full">
                        <BookText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="font-medium truncate break-all">
                          {template.title}
                        </span>
                      </div>

                      {template.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 ml-6 mb-1 truncate break-all w-full">
                          {template.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 ml-6 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {template.user?.name || "Unknown"}
                          </span>
                        </div>

                        {template.createdAt && (
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <Calendar className="h-3 w-3 shrink-0" />
                            <span>
                              {format(
                                new Date(template.createdAt),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>
                        )}

                        {template.topic && (
                          <Badge variant="outline" className="h-5 text-[10px]">
                            {template.topic}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <ArrowRight className="ml-6 h-4 w-4 shrink-0 opacity-50" />
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup>
                <CommandItem
                  className="cursor-pointer"
                  onSelect={() => {
                    router.push(`/templates`);
                    setOpen(false);
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>Browse all templates</span>
                </CommandItem>

                <CommandItem
                  className="cursor-pointer"
                  onSelect={() => {
                    router.push(`/templates/new`);
                    setOpen(false);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>Create new template</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          ) : searchTerm.length > 0 ? (
            <CommandEmpty className="py-6 text-center">
              <p className="text-sm text-muted-foreground">
                No templates found for "{searchTerm}"
              </p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => {
                  router.push(`/templates`);
                  setOpen(false);
                }}
              >
                Browse all templates
              </Button>
            </CommandEmpty>
          ) : (
            <div className="py-6 text-center">
              <Search className="h-6 w-6 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">
                Type to search templates...
              </p>
            </div>
          )}
        </Command>
      </DialogContent>
    </Dialog>
  );
}
