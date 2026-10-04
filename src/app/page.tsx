import { Show } from "@clerk/nextjs";
import Header from "@/components/Header";
import SessionForm from "@/components/SessionForm";
import SessionList from "@/components/SessionList";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
}).replace(/</g, "\\u003c");

export default function Home() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <Header />
      <main id="main" className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold">Learn something. Teach something.</h1>
          <p className="mt-1 text-sm text-slate-600">
            A demo learning marketplace built with Next.js, Convex, and Clerk.
          </p>
        </div>
        <Show when="signed-in">
          <SessionForm />
        </Show>
        <Show when="signed-out">
          <p className="rounded-lg border bg-white p-4 text-sm text-slate-600">
            Sign in to post a session.
          </p>
        </Show>
        <SessionList />
      </main>
      <footer className="border-t py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Alexis Luzon. All rights reserved.</p>
        <p className="mt-1">
          Demo project for portfolio purposes only. Provided &quot;as is&quot; without warranty;
          the author is not liable for any damages arising from its use.
        </p>
      </footer>
    </>
  );
}