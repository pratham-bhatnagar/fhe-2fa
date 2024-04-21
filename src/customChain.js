
export const Inco = {
    id: 9_090,
    name: "Inco Network",
    //@ts-ignore
    network: "Inco Network",
    iconUrl:
      "https://pbs.twimg.com/profile_images/1700732237728096256/NILeXR0L_400x400.jpg",
    iconBackground: "#fff",
    nativeCurrency: {
      decimals: 18,
      name: "Inco",
      symbol: "INCO",
    },
    rpcUrls: {
      public: { http: ["https://testnet.inco.org/"] },
      default: { http: ["https://testnet.inco.org/"] },
    },
    blockExplorers: {
      default: { name: "Inco", url: "https://explorer.inco.network/" },
      etherscan: { name: "Inco", url: "https://explorer.inco.network/" },
    },
    testnet: true,
  };
  