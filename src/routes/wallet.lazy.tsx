import React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { fetchUser, fetchWallet } from "@/api/repository";

export const Route = createLazyFileRoute("/wallet")({
  component: Wallet,
});

function Wallet() {
  const [users, setUsers] = React.useState();
  const [user, setUser] = React.useState("admin");
  const [targetUser, setUserTarget] = React.useState("");
  const [amount, setAmount] = React.useState("0");
  const [targetUser2, setUserTarget2] = React.useState("");
  const [amount2, setAmount2] = React.useState("0");
  const [wallet, setWallet] = React.useState({
    address: "",
    ethBalance: "",
    tokenBalance: "",
  });

  React.useEffect(() => {
    fetchUser({ setUsers });
    fetchWallet({
      user,
      setWallet,
    });
  }, []);

  const handleSendEth = async () => {
    const url = "/api/wallet/transfer-eth";
    const data = {
      signer: user,
      to: targetUser,
      amount,
    };
    console.log(data);
    try {
      const response = await fetch(url, {
        method: "POST", // Specify the method
        headers: {
          // Set the appropriate headers
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Convert the data object to JSON
      });

      if (!response.ok) {
        alert("Failed");
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json(); // Assuming server responds with JSON
      // setResponse(result);
      alert(`Sending Eth is Success, ${result.data.txHash}`);
      console.log("Submission successful", result);
      setUserTarget("");
      setAmount("");
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  const handleSendToken = async () => {
    const url = "/api/wallet/transfer-token";
    const data = {
      signer: user,
      to: targetUser2,
      amount: amount2,
    };
    console.log(data);
    try {
      const response = await fetch(url, {
        method: "POST", // Specify the method
        headers: {
          // Set the appropriate headers
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Convert the data object to JSON
      });

      if (!response.ok) {
        alert("Failed");
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json(); // Assuming server responds with JSON
      // setResponse(result);
      alert(`Sending Eth is Success, ${result.data.hash}`);
      console.log("Submission successful", result);
      setUserTarget2("");
      setAmount2("");
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8">
      <Select
        onValueChange={(value: string) => {
          setUser(value);
          fetchWallet({
            user: value,
            setWallet,
          });
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a user signer" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>User signer</SelectLabel>
            <SelectItem value="admin">admin</SelectItem>
            {users &&
              // @ts-ignore
              users?.map((item, i) => (
                <SelectItem key={i} value={item.username}>
                  {item.username}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <h1 className="text-3xl font-bold">Ethereum Wallet</h1>
      <div className="grid grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Native Token</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallet1-address">Address</Label>
                <Input disabled id="wallet1-address" value={wallet.address} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet1-balance">Balance</Label>
                <Input
                  disabled
                  id="wallet1-balance"
                  value={wallet.ethBalance}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet1-send-address">Send To</Label>
                <Input
                  id="wallet1-send-address"
                  placeholder="Enter recipient's username"
                  value={targetUser}
                  onChange={(e) => setUserTarget(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet1-send-amount">Amount</Label>
                <Input
                  id="wallet1-send-amount"
                  placeholder="Enter amount to send"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <Button onClick={handleSendEth}>Send</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ERC20 Token: DEMO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallet2-address">Address</Label>
                <Input disabled id="wallet2-address" value={wallet.address} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet2-balance">Balance</Label>
                <Input
                  disabled
                  id="wallet2-balance"
                  value={wallet.tokenBalance}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet2-send-address">Send To</Label>
                <Input
                  id="wallet2-send-address"
                  placeholder="Enter recipient's address"
                  value={targetUser2}
                  onChange={(e) => setUserTarget2(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet2-send-amount">Amount</Label>
                <Input
                  id="wallet2-send-amount"
                  placeholder="Enter amount to send"
                  value={amount2}
                  onChange={(e) => setAmount2(e.target.value)}
                />
              </div>
              <Button onClick={handleSendToken}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
