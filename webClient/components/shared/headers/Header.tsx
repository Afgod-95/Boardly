
import ProfileHeader from './profile/ProfileHeader'

export default function Header({ classname } : {classname?: string}) {
  return (
    <>
      <header className={`sticky top-0 z-50 bg-background ${classname || ''}`}>
        <ProfileHeader />
      </header>

    </>

  )
}
