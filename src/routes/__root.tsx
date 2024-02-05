import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  createRootRoute,
  Link,
  Outlet,
  useMatchRoute,
} from "@tanstack/react-router";
import { clsx } from "clsx";

export const Route = createRootRoute({
  component: Layout,
});

function Layout() {
  const matchRoute = useMatchRoute();
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" to="#">
              <Package2Icon className="h-6 w-6" />
              <span className="">Acme Inc</span>
            </Link>
            <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
              <BellIcon className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all  hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50",
                  matchRoute({ to: "/" }) && "bg-gray-300",
                )}
                to="#"
              >
                <HomeIcon className="h-4 w-4" />
                Home
              </Link>
              {/* Blockchain NodeJS */}
              <Link
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all  hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50",
                  matchRoute({ to: "/simple-blockchain" }) && "bg-gray-300",
                )}
                to="simple-blockchain"
              >
                <ShoppingCartIcon className="h-4 w-4" />
                Simple Blockchain
              </Link>
              {/* Pemungutan Suara */}
              <Link
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all  hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50",
                  matchRoute({ to: "/ballot-voting" }) && "bg-gray-300",
                )}
                to="ballot-voting"
              >
                <PackageIcon className="h-4 w-4" />
                Ballot Voting
              </Link>
              <Link
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all  hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50",
                  matchRoute({ to: "/wallet" }) && "bg-gray-300",
                )}
                to="wallet"
              >
                <UsersIcon className="h-4 w-4" />
                Blockchain Wallet
              </Link>
              <Link
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all  hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50",
                  matchRoute({ to: "/nft-market" }) && "bg-gray-300",
                )}
                to="nft-market"
              >
                <BlobIcon className="h-4 w-4" />
                NFT Marketplace
              </Link>
              <Link
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all  hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50",
                  matchRoute({ to: "/todos" }) && "bg-gray-300",
                )}
                to="todos"
              >
                <StarIcon className="h-4 w-4" />
                pChain ToDo List
              </Link>
              <Link
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all  hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50",
                  matchRoute({ to: "/event" }) && "bg-gray-300",
                )}
                to="event"
              >
                <RocketIcon className="h-4 w-4" />
                Events
              </Link>
              <Link
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all  hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50",
                  matchRoute({ to: "/documentation" }) && "bg-gray-300",
                )}
                to="documentation"
              >
                <AbstractIcon className="h-4 w-4" />
                Documentation
              </Link>
              <Link
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all  hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50",
                  matchRoute({ to: "/slides" }) && "bg-gray-300",
                )}
                to="slides"
              >
                <LineChartIcon className="h-4 w-4" />
                Slides
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 lg:h-[60px] dark:bg-gray-800/40">
          <Link className="lg:hidden" to="#">
            <Package2Icon className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1"></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-8 w-8 rounded-full border  border-slate-200 dark:border-gray-800 "
                size="icon"
                variant="ghost"
              >
                <img
                  alt="Avatar"
                  className="rounded-full"
                  height="32"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "32/32",
                    objectFit: "cover",
                  }}
                  width="32"
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Package2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 1-2 2H5a2 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 1 7.24 3h9.52a2 1.8 1.1L21" />
      <path d="M12 3v6" />
    </svg>
  );
}

function BellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 1 12 0c0 7 3 9 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 3.4" />
    </svg>
  );
}

function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 7v11a2 2 0 1-2 2H5a2 1-2-2z" />
      <polyline points="9 22 12 15" />
    </svg>
  );
}

function ShoppingCartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 1.58h9.78a2 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function PackageIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0-1-1.73l-7-4a2 0-2 0l-7 4A2 3 8v8a2 1 1.73l7 4a2 0l7-4A2 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0-4-4H6a4 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 1 7.75" />
    </svg>
  );
}

function LineChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
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

function RocketIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="M16.87 16.87l-7.37-7.36M7 13l-.72.72c-1.68-1.68-1.75-4.38-.17-6.06 1.56-1.56 4.1-1.51 5.71.11l-6.09 6.09L7 13z" />
      <path d="M2.05 20.05L4.44 17.66l2.83 2.83-2.83 2.83zM15.88 5.12l2.83-2.83L21.9 5.1l-2.83 2.83zM7.34 7.34L9.17 9.17" />
    </svg>
  );
}

function StarIcon(props) {
  return (
    <svg
      {...props}
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
      <polygon points="12 2 15.09 8.06 22 9 17 13.84 18.18 20.03 12 17.77 5.82 20.03 7 13.84 2 9 8.91 8.06 12 2" />
    </svg>
  );
}

function BlobIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="M21.55,10.33c-.77-4.12-3.78-7.16-7.32-7.16-3.63,0-6.57,2.89-6.99,6.55l-.04.84c0,.4.32.73,.72,.73H9.9c.39,0,.71.32,.71,.72l.03,1.78c.02.38,.32,.68,.7,.68l2.06-.03c.4,0,.72.33,.72,.73l.03,1.79c.01,.39,.33,.71,.72,.7h2.78c.39,0,.71-.3,.73-.68l.03-1.79c0-.39,.32-.72,.71-.72l2.06.03c.39,0,.7-.3,.72-.68l.03-1.78c.01-.4.33-.72,.72-.72l.07-.84C21.79,10.93,21.63,10.6,21.55,10.33Z" />
    </svg>
  );
}

function AbstractIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="M13.28,10.68a3,3,0,1,0,3.57-1.93L12,4,6.76,8.75a3,3,0,1,0,3.35,5,5,5,0,0,0-6.76-.42A3,3,0,0,0,8,12H4a7,7,0,0,1,9.57-6.35A7,7,0,0,1,20,12v.35a3,3,0,0,0,2.07,2.84" />
    </svg>
  );
}

function AbstractLineIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="M21,2H3A2,2,0,0,0,1,4V20a2,2,0,0,0,2,2H21a2,2,0,0,0,2-2V4A2,2,0,0,0,21,2ZM4,9V7H20V9ZM4,15H9v2H4Zm14,0H11v2h7Z" />
    </svg>
  );
}
