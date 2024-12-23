

// app/dashboard/page.tsx
import { prismaclient } from '../lib/db';
import SongVotingPlatform from '../components/SongVotingPlatform';
import { getServerSession } from 'next-auth/next';

type Props = {
  creatorId: string | null;
};

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return <div>No session found.</div>; 
  }

  const user = await prismaclient.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return <div>No user found.</div>; // Handle case where user is not found
  }

  return <ClientComponent creatorId={user.id} />;
}

function ClientComponent({ creatorId }: { creatorId: string }) {
  return (
    <div>
      <SongVotingPlatform creatorId={creatorId} playVideo={true} />
    </div>
  );
}
