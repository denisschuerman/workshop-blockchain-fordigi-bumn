import React from "react";
import { clsx } from "clsx";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardFooter,
  Card,
  CardContent,
} from "@/components/ui/card";
import { fetchBlockList } from "@/api/repository";

type Block = {
  index: string;
  previousHash: string;
  timestamp: string;
  data: string;
  nonce: number;
  hash: string;
  createdAt: string;
};

export const Route = createLazyFileRoute("/simple-blockchain")({
  component: SimpleBlockchain,
});

function SimpleBlockchain() {
  const [inputValue, setInputValue] = React.useState("");
  const [chain, setBlocks] = React.useState({
    blocks: [],
    isChainValid: false,
  });

  React.useEffect(() => {
    fetchBlockList({
      setBlocks,
    });
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addBlock = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/blockchain/blocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([inputValue]),
      });
      if (response.ok) {
        alert("Block added successfully");
        console.log("Block added successfully");
        setInputValue("");
        fetchBlockList({
          setBlocks,
        });
      } else {
        alert("Error adding block");
        throw new Error("Error adding block");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="rounded-md border p-4">
        <form className="space-y-4" onSubmit={addBlock}>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Data</Label>
            <Input
              id="data"
              placeholder="Add data to Blockchain"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </div>
      <div
        className={clsx(
          "w-full rounded-md px-2 py-3 text-center",
          chain.isChainValid === true ? "bg-green-500" : "bg-red-500",
        )}
      >
        isValidChain: {chain.isChainValid.toString()}
      </div>
      <div className=" space-y-4">
        {chain &&
          chain?.blocks?.map((item: Block, i: any) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{item.hash}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>index: {item.index}</p>
                <p>prevHash: {item.previousHash}</p>
                <p>data: {item.data}</p>
                <p>nonce: {item.nonce}</p>
                <p>timestamp: {item.timestamp}</p>
              </CardContent>
              <CardFooter>
                <p>{item.createdAt}</p>
              </CardFooter>
            </Card>
          ))}
      </div>
    </>
  );
}
