import React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  Card,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { fetchMyNft, fetchNftMarket, fetchUser } from "@/api/repository";

export type NftType = {
  tokenId: string;
  tokenUri: string;
  name: string;
  description: string;
  imageUrl: string;
  attributes: Array<Array<string>>;
  seller: string;
  owner: string;
  price: string;
  sold: string;
};

export const Route = createLazyFileRoute("/nft-market")({
  component: NFTMarketplace,
});

function NFTMarketplace() {
  const [users, setUsers] = React.useState();
  const [user, setUser] = React.useState("admin");
  const [myNfts, setMyNfts] = React.useState<NftType[]>();
  const [nfts, setNfts] = React.useState<NftType[]>();
  const [tokenUri, setTokenUri] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [imageUri, setImageUri] = React.useState("");
  const [attributes, setAttributes] = React.useState([]);
  const [price, setPrice] = React.useState("0");
  const [buyPrice, setBuyPrice] = React.useState("");
  const [buyTokenId, setBuyTokenId] = React.useState("");

  React.useEffect(() => {
    fetchUser({ setUsers });
    fetchMyNft({
      user,
      setMyNfts,
    });
    fetchNftMarket({
      setNfts,
    });
  }, []);

  const handleCreateNft = async () => {
    const url = "/api/nft-market/create-token";
    const data = {
      signer: user,
      tokenUri,
      name,
      description,
      imageUrl: imageUri,
      attributes,
      price,
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
      alert("Success created NFT");
      fetchNftMarket({
        setNfts,
      });
      console.log("Submission successful", result);
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  const handleBuyNft = async () => {
    const url = "/api/nft-market/buy";
    const data = {
      signer: user,
      tokenId: buyTokenId,
      value: buyPrice,
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
      alert("Success buy NFT");
      document.getElementById("close-dialog")?.click();
      fetchMyNft({
        user,
        setMyNfts,
      });
      fetchNftMarket({
        setNfts,
      });
      console.log("Submission successful", result);
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
      <Select
        onValueChange={(value: string) => {
          setUser(value);
          fetchMyNft({
            user: value,
            setMyNfts,
          });
        }}
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
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold">Create Token</h2>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter token name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="metadataUri">Metadata URI</Label>
          <Input
            id="metadataUri"
            placeholder="Enter metadata uri"
            value={tokenUri}
            onChange={(e) => setTokenUri(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageUri">Image URI</Label>
          <Input
            id="imageUri"
            placeholder="Enter image uri"
            value={imageUri}
            onChange={(e) => setImageUri(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="attributes">Attributes</Label>
          <Input
            id="attributes"
            placeholder="Enter attributes"
            // value={JSON.stringify(attributes)}
            onChange={(e) => setAttributes(JSON.parse(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <Button onClick={handleCreateNft}>Create Token</Button>
      </div>
      <section>
        <h2 className="text-2xl font-bold">My NFTs</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {myNfts ? (
            myNfts.map((item, i) => (
              <Card key={i}>
                <CardTitle className="py-4 text-center">{item.name}</CardTitle>
                <CardContent>
                  <div className="rounded-lg bg-white">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="mb-4 h-48 w-full object-cover"
                    />
                    <p className=" mb-4 text-sm text-gray-500">
                      tokenId: {item.tokenId}
                    </p>
                    <p className="mb-4 text-gray-500">{item.description}</p>
                    <div className="mb-4 flex flex-wrap">
                      {item.attributes
                        ? item.attributes.map(([key, value]) => (
                            <span
                              key={key}
                              className="mb-2 mr-2 rounded-full bg-gray-200 px-2 py-1 text-sm text-gray-700"
                            >
                              {`${key}: ${value}`}
                            </span>
                          ))
                        : ""}
                    </div>
                    <div className="mb-4 flex flex-col items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-500">Seller:</span>
                        <span>
                          {item.seller.slice(0, 6)}...{item.seller.slice(-4)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-500">Owner:</span>
                        <span>
                          {item.owner.slice(0, 6)}...{item.owner.slice(-4)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-bold text-green-600`}>
                        {item.price}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>Not Found</p>
          )}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold">Market Items</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {nfts ? (
            nfts.map((item, i) => (
              <Card key={i}>
                <CardTitle className="py-4 text-center">{item.name}</CardTitle>
                <CardContent>
                  <div className="rounded-lg bg-white">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="mb-4 h-48 w-full object-cover"
                    />
                    <p className="mb-4 text-sm text-gray-500">
                      tokenId: {item.tokenId}
                    </p>
                    <p className="mb-4 text-gray-500">{item.description}</p>
                    <div className="mb-4 flex flex-wrap">
                      {item.attributes
                        ? item.attributes.map(([key, value]) => (
                            <span
                              key={key}
                              className="mb-2 mr-2 rounded-full bg-gray-200 px-2 py-1 text-sm text-gray-700"
                            >
                              {`${key}: ${value}`}
                            </span>
                          ))
                        : ""}
                    </div>
                    <div className="mb-4 flex flex-col items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-500">Seller:</span>
                        <span>
                          {item.seller.slice(0, 6)}...{item.seller.slice(-4)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-500">Owner:</span>
                        <span>
                          {item.owner.slice(0, 6)}...{item.owner.slice(-4)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-bold text-green-600`}>
                        {item.price}
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setBuyPrice(item.price);
                              setBuyTokenId(item.tokenId);
                            }}
                          >
                            Buy NFT
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Buy NFT</DialogTitle>
                            <DialogDescription>
                              Confirm your purchase of this NFT.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right" htmlFor="nft">
                                Signer
                              </Label>
                              <Input
                                className="col-span-3"
                                id="signer"
                                disabled
                                value={user}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right" htmlFor="nft">
                                NFT
                              </Label>
                              <Input
                                className="col-span-3"
                                id="nft"
                                disabled
                                value={item.tokenId}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right" htmlFor="price">
                                Price
                              </Label>
                              <Input
                                className="col-span-3"
                                id="price"
                                disabled
                                value={item.price}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleBuyNft}>
                              Confirm Purchase
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>Not Found</p>
          )}
        </div>
      </section>
    </div>
  );
}
