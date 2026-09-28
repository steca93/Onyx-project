import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { CLIENT_NAMESPACES } from "./client-messages.generated";

type Messages = Awaited<ReturnType<typeof getMessages>>;
export type ClientRoute = keyof typeof CLIENT_NAMESPACES.routes;

function pick(messages: Messages, namespaces: readonly string[]): Partial<Messages> {
  return Object.fromEntries(
    namespaces.filter((ns) => ns in messages).map((ns) => [ns, messages[ns as keyof Messages]]),
  ) as Partial<Messages>;
}

/**
 * Sends only the message namespaces client components actually use to the
 * browser (active locale only). Without `messages`, NextIntlClientProvider
 * would serialize the whole catalog — legal text, FAQ, SEO templates — into
 * every page. Namespace lists are generated from the import graph by
 * scripts/client-messages.mts (checked in `npm run typecheck`).
 *
 * `route` omitted = the root layout's set. A route-level provider replaces
 * (doesn't merge with) the layout one for everything rendered inside it.
 */
export async function ClientMessages({
  locale,
  route,
  children,
}: {
  locale: Locale;
  route?: ClientRoute;
  children: React.ReactNode;
}) {
  const namespaces = route === undefined ? CLIENT_NAMESPACES.layout : CLIENT_NAMESPACES.routes[route];
  if (route !== undefined && namespaces.length === 0) return children;
  const messages = await getMessages({ locale });
  return <NextIntlClientProvider messages={pick(messages, namespaces)}>{children}</NextIntlClientProvider>;
}
