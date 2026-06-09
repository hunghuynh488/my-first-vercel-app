"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const { publicKey, connected } = useWallet();

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="max-w-xl w-full p-8">
        <h1 className="text-5xl font-bold mb-4">
          Orca Demo
        </h1>

        <p className="text-slate-300 mb-8">
          Trade tokens on Solana
        </p>

        <WalletMultiButton />

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
            <p className="text-sm text-slate-400">
              Balance
            </p>
            <p className="text-xl">$0.00</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-slate-400">
              Pool TVL
            </p>
            <p className="text-xl">$1.25M</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-slate-400">
              Volume
            </p>
            <p className="text-xl">$250K</p>
          </div>
        </div>
      </div>
    </main>
  );
}