import React from "react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  PaginationPrevious,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationContent,
  Pagination,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchEvents } from "@/api/repository";

export const Route = createLazyFileRoute("/event")({
  component: Event,
});

function Event() {
  const [events, setEvents] = React.useState();
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    fetchEvents({ setEvents });
  }, []);

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchIconClick = () => {
    const filteredEvents = searchQuery
      ? // @ts-ignore
        events.filter(
          (item) =>
            item.txHash.includes(searchQuery) ||
            item.method.includes(searchQuery),
        )
      : events;
    setEvents(filteredEvents);
  };

  return (
    <div className="flex min-h-screen flex-col ">
      <header className="flex h-16 items-center border-b bg-white px-4 dark:bg-gray-800">
        <div className="flex w-full items-center gap-4 md:gap-6">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <SearchIcon
                handle={handleSearchIconClick}
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400"
              />
              <Input
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                placeholder="Search transactions or blocks..."
                type="search"
                value={searchQuery}
                onChange={handleSearchQueryChange}
              />
            </div>
          </form>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Timestamp</TableHead>
                  <TableHead>Transaction Hash</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events ? (
                  // @ts-ignore
                  events
                    // @ts-ignore
                    .filter(
                      (item) =>
                        item.txHash.includes(searchQuery) ||
                        item.method.includes(searchQuery),
                    )
                    .map((item, i) => (
                      <TableRow>
                        <TableCell className="font-medium">
                          {new Date(item.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{item.txHash}</TableCell>
                        <TableCell>{item.method}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger className="text-blue-600 underline">
                              View
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Event Details</DialogTitle>
                              </DialogHeader>
                              <div className="p-4">
                                <p>ID: {item.id}</p>
                                <p>
                                  TxHash:
                                  <span className="break-all">
                                    {item.txHash}
                                  </span>
                                </p>
                                <p>Method: {item.method}</p>
                                <p>From: {item.from}</p>
                                <p>To: {item.to}</p>
                                <p>
                                  Created At:{" "}
                                  {new Date(item.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <p>Event not found</p>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      onClick={props.handle}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
