export const fetchBlockList = async ({ setBlocks }) => {
  try {
    const response = await fetch("/api/blockchain/blocks");
    if (response.ok) {
      const res = await response.json();
      setBlocks(res.data);
    } else {
      throw new Error("Error fetching block list");
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchUser = async ({ setUsers }) => {
  try {
    const response = await fetch("/api/user");
    if (response.ok) {
      const res = await response.json();
      setUsers(res.data);
    } else {
      throw new Error("Error fetching block list");
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchBallot = async ({ setBallots }) => {
  try {
    const response = await fetch("/api/ballot/all");
    if (response.ok) {
      const res = await response.json();
      setBallots(res.data);
    } else {
      throw new Error("Error fetching block list");
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchWinner = async ({ setWinners }) => {
  try {
    const response = await fetch("/api/ballot/winners");
    if (response.ok) {
      const res = await response.json();
      setWinners(res.data);
    } else {
      throw new Error("Error fetching block list");
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchWallet = async ({ user, setWallet }) => {
  try {
    const response = await fetch(`/api/wallet/${user}`);
    if (response.ok) {
      const res = await response.json();
      setWallet(res.data);
    } else {
      throw new Error("Error fetching block list");
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchMyNft = async ({ user, setMyNfts }) => {
  try {
    const response = await fetch(`/api/nft-market/my-nft/${user}`);
    if (response.ok) {
      const res = await response.json();
      setMyNfts(res.data);
    } else {
      throw new Error("Error fetching block list");
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchNftMarket = async ({ setNfts }) => {
  try {
    const response = await fetch(`/api/nft-market/market-items`);
    if (response.ok) {
      const res = await response.json();
      setNfts(res.data);
    } else {
      throw new Error("Error fetching block list");
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchEvents = async ({ setEvents }) => {
  try {
    const response = await fetch(`/api/events`);
    if (response.ok) {
      const res = await response.json();
      setEvents(res.data);
    } else {
      throw new Error("Error fetching block list");
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchTask = async ({ setTasks }) => {
  try {
    const response = await fetch(
      "https://api.pchain.id/contracts/read/besu/contract_cwghsneczo9hw9ufelvl5xz4?fn=getTaskCount",
      {
        method: "POST", // Specify the method
        headers: {
          "x-api-key": "demo_i0dwnkn68yqitqr72uckbe94",
          "x-wallet-key": "ODlhMTJhYmZjZDBmM2YyNjgxYjg2NzI4MDI1N2MzYWY=",
        },
      },
    );
    console.log(response);
    if (response.ok) {
      const res = await response.json();
      const taskCount = parseInt(res.data.hex, 16);
      const tasks = [];

      for (let i = 0; i < taskCount; i++) {
        const resTask = await fetch(
          `https://api.pchain.id/contracts/read/besu/contract_cwghsneczo9hw9ufelvl5xz4?fn=tasks&args=${i}`,
          {
            method: "POST", // Specify the method
            headers: {
              "x-api-key": "demo_i0dwnkn68yqitqr72uckbe94",
              "x-wallet-key": "ODlhMTJhYmZjZDBmM2YyNjgxYjg2NzI4MDI1N2MzYWY=",
            },
          },
        );

        const taskData = await resTask.json();
        const taskObj = { task: taskData.data[0], isDone: taskData.data[1] };
        tasks.push(taskObj);
      }

      console.log(tasks);
      setTasks(tasks);
      // setNfts(res.data);
    } else {
      throw new Error("Error ");
    }
  } catch (error) {
    console.error(error);
  }
};
