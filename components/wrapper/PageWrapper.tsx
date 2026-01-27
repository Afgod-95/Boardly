const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-4 sm:px-5">
      {children}
    </div>
  )
}

export default PageWrapper
