"use client";

import { useEffect, useState } from "react";
import { WalletButton } from "./wallet-button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

type TokenBalance = {
  mint: string;
  amount: string;
  decimals: number;
};

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBalances() {
      if (!publicKey) {
        setSolBalance(null);
        setTokens([]);
        return;
      }

      try {
        setLoading(true);

        const lamports = await connection.getBalance(publicKey);
        setSolBalance(lamports / LAMPORTS_PER_SOL);

        const tokenAccounts =
          await connection.getParsedTokenAccountsByOwner(publicKey, {
            programId: new PublicKey(
              "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ),
          });

        const parsedTokens = tokenAccounts.value.map((account) => {
          const info = account.account.data.parsed.info;
          const tokenAmount = info.tokenAmount;

          return {
            mint: info.mint,
            amount: tokenAmount.uiAmountString,
            decimals: tokenAmount.decimals,
          };
        });

        setTokens(parsedTokens);
      } catch (error) {
        console.error("Failed to fetch balances:", error);
        setSolBalance(null);
        setTokens([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBalances();
  }, [connection, publicKey]);

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="max-w-2xl w-full p-8">
        <h1 className="text-5xl font-bold mb-4">Orca Demo</h1>

        <p className="text-slate-300 mb-8">
          Read SOL and SPL token balances
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

        <div className="mt-8 bg-slate-800 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Balances</h2>

          {!connected && <p>Connect wallet to view balances.</p>}

          {connected && loading && <p>Loading balances...</p>}

          {connected && !loading && (
            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span>SOL</span>
                <span>
                  {solBalance !== null
                    ? `${solBalance.toFixed(4)} SOL`
                    : "Unavailable"}
                </span>
              </div>

              {tokens.length === 0 && (
                <p className="text-slate-400">
                  No SPL tokens found in this wallet.
                </p>
              )}

              {tokens.map((token) => (
                <div
                  key={token.mint}
                  className="border-b border-slate-700 pb-2"
                >
                  <div className="flex justify-between">
                    <span className="text-slate-300">Token</span>
                    <span>{token.amount}</span>
                  </div>
                  <p className="text-xs text-slate-500 break-all">
                    Mint: {token.mint}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}