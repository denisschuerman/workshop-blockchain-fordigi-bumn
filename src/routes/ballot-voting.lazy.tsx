import React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { fetchBallot, fetchUser, fetchWinner } from "@/api/repository";

export const Route = createLazyFileRoute("/ballot-voting")({
  component: BallotVoting,
});

function BallotVoting() {
  const [users, setUsers] = React.useState();
  const [ballots, setBallots] = React.useState();
  const [ballot, setBallot] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState("");
  const [eventName, setEventName] = React.useState("");
  const [candidates, setCandidates] = React.useState([]);
  const [duration, setDuration] = React.useState("");
  const [selectedOption, setSelectedOption] = React.useState("");
  const [winners, setWinners] = React.useState();

  React.useEffect(() => {
    fetchUser({ setUsers });
    fetchBallot({ setBallots });
    fetchWinner({ setWinners });
  }, []);

  const handleCreateBallot = async () => {
    const url = "/api/ballot/create";
    const data = {
      signer: selectedUser,
      eventName: eventName,
      candidates: candidates,
      duration: duration,
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
      alert("Submission successful");
      fetchBallot({ setBallots });
      fetchWinner({ setWinners });
      console.log("Submission successful", result);
      setDuration("");
      setEventName("");
      setCandidates([]);
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  const handleCastBallot = async () => {
    const url = "/api/ballot/cast";
    const data = {
      signer: selectedUser,
      ballotIndex: JSON.parse(ballot).id,
      optionIndex: selectedOption,
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
      alert("Submission successful");
      fetchBallot({ setBallots });
      fetchWinner({ setWinners });
      console.log("Submission successful", result);
      setBallot("");
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  const handleCheckVoted = async () => {
    const url = "/api/ballot/has-vote";
    const data = {
      username: selectedUser,
      ballotIndex: JSON.parse(ballot).id,
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
      alert(result.data);
      console.log("Submission successful", result);
      setBallot("");
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* CREATE BALLOT */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Create a New Ballot</CardTitle>
              <CardDescription>
                Enter the details of the ballot below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  onValueChange={(value: string) => setSelectedUser(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a user signer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>User signer</SelectLabel>
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
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Title of the ballot"
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="Duration of the ballot in seconds"
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="options">Options</Label>
                  <Textarea
                    id="options"
                    placeholder="Enter options separated by commas"
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const inputArray = inputValue
                        .split(",")
                        .map((item) => item.trim());
                      setCandidates(inputArray);
                    }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCreateBallot}>
                Create Ballot
              </Button>
            </CardFooter>
          </Card>

          {/* CAST BALLOT */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Cast Your Vote</CardTitle>
              <CardDescription>
                Select an option below to cast your vote.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Select
                    onValueChange={(value: string) => setSelectedUser(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a user signer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>User signer</SelectLabel>
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ballot">Ballot</Label>
                  <Select onValueChange={(value) => setBallot(value)}>
                    <SelectTrigger id="ballot">
                      <SelectValue placeholder="Select a ballot" />
                    </SelectTrigger>
                    <SelectContent>
                      {ballots &&
                        // @ts-ignore
                        ballots?.map((item, i) => (
                          <SelectItem key={i} value={JSON.stringify(item)}>
                            {item.event}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="option">Option</Label>
                  <Select onValueChange={(value) => setSelectedOption(value)}>
                    <SelectTrigger id="option">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {ballot &&
                        // @ts-ignore
                        JSON.parse(ballot)?.candidates?.map((item, i) => (
                          <SelectItem key={i} value={i}>
                            {item}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCastBallot}>
                Cast Vote
              </Button>
            </CardFooter>
          </Card>
          {/* CHECK IS YOU VOTED */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Check if You Voted</CardTitle>
              <CardDescription>
                Enter your user ID to check if you have already voted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Select
                    onValueChange={(value: string) => setSelectedUser(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>User signer</SelectLabel>
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ballot">Ballot</Label>
                  <Select onValueChange={(value) => setBallot(value)}>
                    <SelectTrigger id="ballot">
                      <SelectValue placeholder="Select a ballot" />
                    </SelectTrigger>
                    <SelectContent>
                      {ballots &&
                        // @ts-ignore
                        ballots?.map((item, i) => (
                          <SelectItem key={i} value={JSON.stringify(item)}>
                            {item.event}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCheckVoted}>
                Check Vote
              </Button>
            </CardFooter>
          </Card>
        </section>
        {/* RESULT */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>RESULTS</CardTitle>
            <CardDescription>
              The current winner of the ballot is displayed below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3">
              {winners &&
                // @ts-ignore
                winners?.map((item, i) => (
                  <div className="flex flex-col items-center space-y-2">
                    <TrophyIcon className="h-16 w-16 text-yellow-500" />
                    <p className="text-2xl font-bold text-gray-500">
                      {item.title}
                    </p>
                    {item.candidates.map((option, i) => (
                      <h3 className="">{`${option.candidate} has ${option.tally} votes`}</h3>
                    ))}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function TrophyIcon(props) {
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
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
