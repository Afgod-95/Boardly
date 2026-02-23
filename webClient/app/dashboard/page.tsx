import Header from '@/components/shared/headers/Header'
import PinsClient from '@/components/pins/contents/PinsFeed'
import PageWrapper from '@/components/shared/wrapper/PageWrapper'

const HomePage = () => {
  return (

    <PageWrapper>
      <Header />
      <PinsClient />
    </PageWrapper>

  )
}

export default HomePage
