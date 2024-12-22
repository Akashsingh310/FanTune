import SongVotingPlatform from "@/app/components/SongVotingPlatform";

export default async function Page({
    params,
}: {
    params: { creatorId: string };
}) {
    const { creatorId } = await params; 
    return (
        <div>
            <SongVotingPlatform creatorId={creatorId} />
        </div>
    );
}
