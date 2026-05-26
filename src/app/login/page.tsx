import LoginForm from './LoginForm';

export const metadata = { title: 'Private Entry' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const next = params.next && params.next.startsWith('/') ? params.next : '/';
  return (
    <main className="min-h-[100svh] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center fade-in">
        <p className="eyebrow mb-6">Private Offering</p>
        <h1 className="h-display text-3xl md:text-4xl text-bone mb-3">CLIFFHANGER&nbsp;IC</h1>
        <p className="text-stone text-sm font-light mb-12">
          This page is private. Enter the access code to continue.
        </p>
        <LoginForm next={next} />
      </div>
    </main>
  );
}
