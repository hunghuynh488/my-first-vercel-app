"use client";

import { useEffect, useState } from "react";
import { WalletButton } from "./wallet-button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBalance() {
      if (!publicKey) {
        setBalance(null);
        return;
      }

      try {
        setLoading(true);
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        setBalance(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, [connection, publicKey]);

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="max-w-xl w-full p-8">
        <h1 className="text-5xl font-bold mb-4">Orca Demo</h1>

        <p className="text-slate-300 mb-8">
          Trade tokens on Solana
        </p>

        <WalletButton />

        <div className="mt-8 p-4 bg-slate-800 rounded-lg">
          <p className="break-all">
            Wallet:{" "}
            {connected && publicKey
              ? publicKey.toBase58()
              : "Not Connected"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-slate-400">SOL Balance</p>
            <p className="text-xl">
              {!connected
                ? "Connect wallet"
                : loading
                ? "Loading..."
                : balance !== null
                ? `${balance.toFixed(4)} SOL`
                : "Unavailable"}
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-slate-400">Pool TVL</p>
            <p className="text-xl">$1.25M</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-slate-400">Volume</p>
            <p className="text-xl">$250K</p>
          </div>
        </div>
      </div>
    </main>
  );
}