import "@styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { publicProvider } from "wagmi/providers/public";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import Head from "next/head";
import {
  xdcTestnet,
  celoAlfajores,
  filecoinHyperspace,
  arbitrumGoerli,
  lineaTestnet,
} from "viem/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { AuthProvider } from "@components/AuthProvider";

const polygonZkEvmTestnet = {
  id: 1442,
  name: "Polygon zkEVM Testnet",
  network: "polygon-zkevm-testnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.public.zkevm-test.net"],
    },
    public: {
      http: ["https://rpc.public.zkevm-test.net"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://explorer.public.zkevm-test.net",
    },
  },
  testnet: true,
};

const scrollSepoliaTestnet = {
  id: 534351,
  name: "Scroll Sepolia Testnet",
  network: "scroll-sepolia-testnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://scroll-public.scroll-testnet.quiknode.pro"],
    },
    public: {
      http: ["https://scroll-public.scroll-testnet.quiknode.pro"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://sepolia-blockscout.scroll.io/",
    },
  },
  testnet: true,
};

const mantleTestnet = {
  id: 5001,
  name: "Mantle Testnet",
  network: "mantle-testnet",
  nativeCurrency: {
    name: "Mantle",
    symbol: "MNT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
    public: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://explorer.mantle.xyz/",
    },
  },
  testnet: true,
};

const neonDevnet = {
  id: 245022926,
  name: "Neon Testnet",
  network: "neon-testnet",
  nativeCurrency: {
    name: "Neon",
    symbol: "NEON",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://devnet.neonevm.org"],
    },
    public: {
      http: ["https://devnet.neonevm.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://neon-devnet.blockscout.com/",
    },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [
    polygonZkEvmTestnet,
    scrollSepoliaTestnet,
    xdcTestnet,
    celoAlfajores,
    mantleTestnet,
    filecoinHyperspace,
    neonDevnet,
    arbitrumGoerli,
    lineaTestnet,
  ],
  [publicProvider()]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider,
});

/* Theming */
const theme = extendTheme({
  styles: {
    global: {
      "*": {
        fontFamily: "Montserrat",
      },
      a: {
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
});

function MyApp({ Component, pageProps, router }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <WagmiConfig client={wagmiClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Head>
            <title>Playz: Unleash your creative capital</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} key={router.route} />
        </AuthProvider>
      </ChakraProvider>
    </WagmiConfig>
  );
}

export default MyApp;
