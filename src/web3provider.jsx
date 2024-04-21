import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Inco } from "./customChain";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [Inco],

    // Required API Keys
    walletConnectProjectId: "e7b53371d64a322ae6d669190b6e2fed",

    // Required App Info
    appName: "FHE Authy",

    // Optional App Info
    appDescription: "Your App Description",
    appUrl: "https://family.co",
    appIcon: "https://family.co/logo.png",
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};