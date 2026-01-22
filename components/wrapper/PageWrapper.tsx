const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-3 sm:px-5">
      {children}
    </div>
  )
}

export default PageWrapper
