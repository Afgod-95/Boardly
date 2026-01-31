const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-4 sm:px-5 pb-20">
      {children}
    </div>
  )
}

export default PageWrapper
