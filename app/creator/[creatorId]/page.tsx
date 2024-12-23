import { PageProps } from "@/.next/types/app/layout";
import SongVotingPlatform from "@/app/components/SongVotingPlatform";

// Define the params interface
interface CreatorPageParams {
    creatorId: string;
}

// Page component with correct type annotations
export default async function Page({
    params,
}: {
    params: CreatorPageParams;
} & PageProps) {
    return (
        <div>
            <SongVotingPlatform creatorId={params.creatorId} playVideo={false} />
        </div>
    );
}