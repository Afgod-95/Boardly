
import ProfileHeader from './profile/ProfileHeader'

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-background hidden md:block">
        <ProfileHeader />
      </header>

    </>

  )
}
