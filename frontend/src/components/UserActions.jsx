import { useEffect, useState, useRef } from "react";
import useAuth from "@/contexts/AuthProvider";
import { useNavigate } from "react-router";
import { ModeToggle } from "./ModeTogge";
import NavButton from "./NavButton";
import { Input } from "./ui/input";
import UserAvatar from "./UserAvatar";
import { getRequest } from "@/utils/apiHelpers";
import SearchResults from "./SearchResults";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useDebounce } from "@/hooks/use-debounce";

export default function UserActions() {
  const { currentUser, clearUser } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearch) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      const response = await getRequest({
        url: `/api/v1/search?query=${encodeURIComponent(debouncedSearch)}`,
      });

      if (response.success) {
        setSearchResults(response.results);
        setIsSearchOpen(true);
      }
      setIsSearching(false);
    };

    performSearch();
  }, [debouncedSearch]);

  function handleSignout() {
    clearUser();
    navigate("/");
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (!isSearchOpen) {
      setIsSearchOpen(true);
    }
  };

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <div className="hidden md:block relative">
        <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <PopoverTrigger asChild>
            <div>
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search posts and tutors..."
                className="w-64"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchOpen(true)}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-64 p-0"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <SearchResults
              results={searchResults}
              isLoading={isSearching}
              searchQuery={searchQuery}
              onSelect={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {currentUser ? (
        <>
          <span
            className="hover:cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <UserAvatar user={currentUser} />
          </span>
          <div className="hidden md:block">
            <NavButton to="/login" onClick={handleSignout}>
              Log Out
            </NavButton>
          </div>
        </>
      ) : (
        <div className="hidden md:flex items-center gap-4">
          <NavButton to="/login" variant="outline">
            Log In
          </NavButton>
          <NavButton to="/signup">Sign Up</NavButton>
        </div>
      )}
      <ModeToggle />
    </div>
  );
}
