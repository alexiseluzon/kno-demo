"use client";

import { SignInButton, Show, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <span className="text-lg font-bold text-indigo-600">Knō Demo</span>
        <nav aria-label="Account">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                title="Sign in"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign in
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </nav>
      </div>
    </header>
  );
}