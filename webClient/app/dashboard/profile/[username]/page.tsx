import ProfilePage from "@/components/profile/ProfilePage"

const page = async ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params
    return <ProfilePage username={username} />
}

export default page