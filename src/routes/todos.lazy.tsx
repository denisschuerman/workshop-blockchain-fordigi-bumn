import React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchTask } from "@/api/repository";

export const Route = createLazyFileRoute("/todos")({
  component: TodoList,
});

function TodoList() {
  const [inputTask, setInputTask] = React.useState("");
  const [tasks, setTasks] = React.useState([
    {
      task: "",
      isDone: false,
    },
  ]);
  React.useEffect(() => {
    fetchTask({ setTasks });
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://api.pchain.id/contracts/write/project_raesi7t75bk4uq9124r1lwty/besu/contract_cwghsneczo9hw9ufelvl5xz4",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "demo_i0dwnkn68yqitqr72uckbe94",
            "x-wallet-key": "ODlhMTJhYmZjZDBmM2YyNjgxYjg2NzI4MDI1N2MzYWY=",
          },
          body: JSON.stringify({
            signer: "0x10c0d37e8C409A9CE52292931a27928a1E9dF3AD",
            fn: "createTask",
            args: [inputTask],
          }),
        },
      );

      if (response.ok) {
        alert("Successfully Create Task");
        setInputTask("");
        fetchTask({ setTasks });
      } else {
        alert("Error adding block");
        throw new Error("Error adding block");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkTask = async (id: number) => {
    try {
      const response = await fetch(
        "https://api.pchain.id/contracts/write/project_raesi7t75bk4uq9124r1lwty/besu/contract_cwghsneczo9hw9ufelvl5xz4",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "demo_i0dwnkn68yqitqr72uckbe94",
            "x-wallet-key": "ODlhMTJhYmZjZDBmM2YyNjgxYjg2NzI4MDI1N2MzYWY=",
          },
          body: JSON.stringify({
            signer: "0x10c0d37e8C409A9CE52292931a27928a1E9dF3AD",
            fn: "toggleTask",
            args: [id],
          }),
        },
      );

      if (response.ok) {
        alert("Task complete");
        fetchTask({ setTasks });
      } else {
        alert("Error adding block");
        throw new Error("Error adding block");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <h1 className="text-lg font-semibold md:text-2xl">Todo List</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add a new todo"
            type="text"
            value={inputTask}
            onChange={(e) => setInputTask(e.target.value)}
          />
          <Button onClick={createTask}>Add</Button>
        </div>
        <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead>Todo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks &&
                tasks.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Checkbox
                        id={i.toString()}
                        checked={item.isDone}
                        onCheckedChange={() => checkTask(i)}
                      />
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{item.task}</p>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

function TrashIcon(props) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
