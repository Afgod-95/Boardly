import Header from '@/components/headers/Header'
import PinsClient from '@/components/pins/contents/PinsFeed'
import PageWrapper from '@/components/wrapper/PageWrapper'

const HomePage = () => {
  return (

    <PageWrapper>
      <Header />
      <PinsClient />
    </PageWrapper>

  )
}

export default HomePage
