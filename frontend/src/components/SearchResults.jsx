import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import { useNavigate } from "react-router";
import { BookIcon, GraduationCapIcon, Loader2Icon } from "lucide-react";

export default function SearchResults({
  results = [],
  onSelect,
  isLoading,
  searchQuery,
}) {
  const navigate = useNavigate();

  const handleSelect = (result) => {
    onSelect?.();
    if (result.type === "post") {
      navigate(`/posts/${result.id}`);
    } else if (result.type === "tutor") {
      navigate(`/tutors/${result.id}`);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "post":
        return <BookIcon className="w-8 h-8 text-muted-foreground" />;
      case "tutor":
        return <GraduationCapIcon className="w-8 h-8 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandList>
        <CommandEmpty>
          {searchQuery ? "No results found." : "Type to search..."}
        </CommandEmpty>
        {isLoading ? (
          <CommandLoading>
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              Searching...
            </div>
          </CommandLoading>
        ) : (
          results.length > 0 && (
            <CommandGroup heading="Search Results">
              {results.map((result) => (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  onSelect={() => handleSelect(result)}
                  className="flex items-center gap-3 cursor-pointer p-2"
                >
                  {getIcon(result.type)}
                  {result.image ? (
                    <img
                      src={`${import.meta.env.VITE_SERVER_URL}/${result.image}`}
                      alt={result.title}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {result.title.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">{result.title}</span>
                    <span className="text-sm text-muted-foreground truncate">
                      {result.description || `View ${result.type} details`}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )
        )}
      </CommandList>
    </Command>
  );
}
